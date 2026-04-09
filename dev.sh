#!/bin/bash
# -----------------------------------------------------------------------------
# dev.sh — 项目 DevOps 逻辑分发脚本
#
# 入口标准化、逻辑脚本化：所有 build/lint/test 等操作都在容器中执行；
# install target 是唯一例外，在宿主机直接 cp 构建产物到 Obsidian 生产 vault。
# -----------------------------------------------------------------------------

set -e

SCRIPTDIR="$( cd -P "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
SERVICE="app"

# ----- 加载 .env -----
if [ -f "$SCRIPTDIR/.env" ]; then
    set -a
    # shellcheck disable=SC1091
    source "$SCRIPTDIR/.env"
    set +a
fi

# ----- 操作系统检测 -----
if [ "$OS" = "Windows_NT" ]; then
    OS_TYPE="Windows"
else
    OS_TYPE="$(uname -s)"
fi

# ----- 日志函数 -----
info()  { echo -e "\033[32m[INFO] [dev.sh] $1\033[0m"; }
warn()  { echo -e "\033[33m[WARN] [dev.sh] $1\033[0m"; }
error() { echo -e "\033[31m[ERROR] [dev.sh] $1\033[0m"; exit 1; }

# ----- docker compose 包装：自动适配 v2 / v1 -----
if docker compose version >/dev/null 2>&1; then
    COMPOSE="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
    COMPOSE="docker-compose"
else
    COMPOSE=""
fi

require_compose() {
    if [ -z "$COMPOSE" ]; then
        error "Neither 'docker compose' (v2 plugin) nor 'docker-compose' (v1) found. Install Docker Desktop or docker-compose."
    fi
}

# ----- 工具函数：展开 ~ 为 $HOME -----
expand_path() {
    local p="$1"
    case "$p" in
        "~")     echo "$HOME" ;;
        "~/"*)   echo "$HOME/${p#~/}" ;;
        *)       echo "$p" ;;
    esac
}

# ----- 工具函数：获取文件修改时间 (跨平台) -----
file_mtime() {
    local path="$1"
    if [ "$OS_TYPE" = "Darwin" ]; then
        # BSD stat (macOS)
        stat -f '%Sm' -t '%Y-%m-%d %H:%M:%S' "$path"
    else
        # GNU stat (Linux / Windows MINGW64)
        stat -c '%y' "$path" | cut -d. -f1
    fi
}

# ----- 工具函数：检查容器是否运行 -----
container_running() {
    require_compose
    local cid
    cid="$($COMPOSE ps -q "$SERVICE" 2>/dev/null || true)"
    if [ -z "$cid" ]; then
        return 1
    fi
    local state
    state="$(docker inspect -f '{{.State.Running}}' "$cid" 2>/dev/null || echo false)"
    [ "$state" = "true" ]
}

# ----- 工具函数：在容器中执行命令 -----
# 优先 exec 已运行容器；否则用一次性容器，并在缺失 node_modules 时先 npm install。
exec_in_container() {
    require_compose
    if container_running; then
        $COMPOSE exec "$SERVICE" "$@"
    else
        info "Container not running, falling back to one-shot 'docker compose run'."
        # 把命令拼成单字符串供 sh -c 使用
        local cmd_str=""
        for arg in "$@"; do
            cmd_str+=" $(printf '%q' "$arg")"
        done
        $COMPOSE run --rm "$SERVICE" sh -c \
            "if [ ! -d node_modules/.bin ]; then npm install --silent; fi;${cmd_str}"
    fi
}

COMMAND="${1:-}"
shift || true

case "$COMMAND" in

    # ------------------------------------------------------------------
    # 1. 环境准备
    # ------------------------------------------------------------------
    doctor)
        info "Checking environment health..."

        # docker
        if command -v docker >/dev/null 2>&1; then
            info "docker found: $(docker --version)"
        else
            error "docker is not installed."
        fi

        # docker compose
        require_compose
        info "compose backend: $COMPOSE"

        # .env
        if [ -f "$SCRIPTDIR/.env" ]; then
            info ".env found."
            if [ -z "${VAULT_PLUGIN_DIR:-}" ]; then
                warn "VAULT_PLUGIN_DIR is not set in .env (only required for 'make install')."
            else
                vault_dir="$(expand_path "$VAULT_PLUGIN_DIR")"
                if [ -d "$vault_dir" ]; then
                    info "VAULT_PLUGIN_DIR exists: $vault_dir"
                else
                    warn "VAULT_PLUGIN_DIR does not exist yet: $vault_dir (will be created on 'make install')"
                fi
            fi
        else
            warn ".env not found. Copy .env.example to .env and configure VAULT_PLUGIN_DIR before running 'make install'."
        fi

        info "Doctor check complete."
        ;;

    deps)
        info "Installing npm dependencies inside container..."
        exec_in_container npm install
        ;;

    # ------------------------------------------------------------------
    # 2. 开发与构建
    # ------------------------------------------------------------------
    lint)
        info "Running ESLint inside container..."
        exec_in_container npx eslint src --ext .ts
        ;;

    build)
        info "Building plugin inside container (production mode)..."
        exec_in_container npm run build
        ;;

    clean)
        info "Cleaning build artifacts..."
        exec_in_container rm -f main.js
        ;;

    # ------------------------------------------------------------------
    # 3. 运行与调试
    # ------------------------------------------------------------------
    up)
        require_compose
        info "Starting development container (esbuild watch mode)..."
        $COMPOSE up -d
        info "Container started. Use 'make logs' to follow esbuild output."
        ;;

    down)
        require_compose
        info "Stopping development container..."
        $COMPOSE down
        ;;

    restart)
        require_compose
        info "Restarting development container..."
        $COMPOSE restart "$SERVICE"
        ;;

    status)
        require_compose
        $COMPOSE ps
        ;;

    logs)
        require_compose
        $COMPOSE logs -f "$SERVICE"
        ;;

    shell)
        require_compose
        info "Entering container shell..."
        if container_running; then
            $COMPOSE exec "$SERVICE" sh
        else
            $COMPOSE run --rm "$SERVICE" sh
        fi
        ;;

    # ------------------------------------------------------------------
    # 4. 质量保证
    # ------------------------------------------------------------------
    test)
        info "Running Jest tests inside container..."
        exec_in_container npm test
        ;;

    artifacts)
        info "Build artifacts:"
        printf "  %-15s %12s   %s\n" "FILE" "SIZE" "MODIFIED"
        printf "  %-15s %12s   %s\n" "----" "----" "--------"
        for f in main.js styles.css manifest.json; do
            path="$SCRIPTDIR/$f"
            if [ -f "$path" ]; then
                size=$(wc -c < "$path" | tr -d ' ')
                mtime=$(file_mtime "$path")
                printf "  %-15s %12s   %s\n" "$f" "$size" "$mtime"
            else
                printf "  %-15s %12s   %s\n" "$f" "-" "(missing — run 'make build')"
            fi
        done
        ;;

    # ------------------------------------------------------------------
    # 5. 部署 (宿主机执行，不进容器)
    # ------------------------------------------------------------------
    install)
        info "Installing plugin to vault (host-side)..."
        if [ -z "${VAULT_PLUGIN_DIR:-}" ]; then
            error "VAULT_PLUGIN_DIR is not set. Configure it in .env first (see .env.example)."
        fi

        vault_dir="$(expand_path "$VAULT_PLUGIN_DIR")"

        for f in main.js styles.css manifest.json; do
            if [ ! -f "$SCRIPTDIR/$f" ]; then
                error "$f not found. Run 'make build' first."
            fi
        done

        mkdir -p "$vault_dir"
        cp "$SCRIPTDIR/main.js"       "$vault_dir/"
        cp "$SCRIPTDIR/styles.css"    "$vault_dir/"
        cp "$SCRIPTDIR/manifest.json" "$vault_dir/"
        info "Installed to: $vault_dir"
        ;;

    # ------------------------------------------------------------------
    # 6. 发布
    # ------------------------------------------------------------------
    release)
        NEW_VERSION="${1:-}"
        if [ -z "$NEW_VERSION" ]; then
            error "Usage: make release VERSION=x.y.z"
        fi

        if ! command -v git >/dev/null 2>&1; then
            error "git is required on host for release."
        fi

        if [ -n "$(git -C "$SCRIPTDIR" status --porcelain)" ]; then
            error "Working tree is not clean. Commit or stash changes first."
        fi

        info "Bumping version to $NEW_VERSION (inside container)..."
        exec_in_container npm version "$NEW_VERSION" --no-git-tag-version

        info "Staging version files on host..."
        git -C "$SCRIPTDIR" add package.json package-lock.json manifest.json versions.json
        git -C "$SCRIPTDIR" commit -m "release: $NEW_VERSION"
        git -C "$SCRIPTDIR" tag "$NEW_VERSION"

        info "Tag $NEW_VERSION created locally."
        info "Push with: git push && git push --tags"
        info "GitHub Actions will then build and create a draft release."
        ;;

    *)
        error "Unknown command: '$COMMAND'. Run 'make help' to see available targets."
        ;;
esac
