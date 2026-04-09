# -----------------------------------------------------------------------------
# 标准化 DevOps Makefile
#
# 哲学：入口标准化、逻辑脚本化
#   - Makefile 只负责暴露统一的 target 协议接口
#   - 复杂 / 跨平台逻辑统一下沉到 dev.sh
#   - 除 'install' 外所有 target 在容器中执行
# -----------------------------------------------------------------------------

SHELL := /bin/bash

# 颜色（在不支持 tput 的环境下静默回退为空）
G     := $(shell tput -Txterm setaf 2 2>/dev/null)
R     := $(shell tput -Txterm setaf 1 2>/dev/null)
Y     := $(shell tput -Txterm setaf 3 2>/dev/null)
RESET := $(shell tput -Txterm sgr0   2>/dev/null)

# 项目名（自动取当前目录名）
PROJECT_NAME := $(notdir $(CURDIR))

.PHONY: help doctor deps lint build clean test up down restart status logs shell artifacts install release

# 默认目标：显示帮助
.DEFAULT_GOAL := help

## help: [帮助] 显示所有可用指令
help:
	@echo "Project: $(G)$(PROJECT_NAME)$(RESET)"
	@echo "Usage: make $(Y)<target>$(RESET)"
	@echo ""
	@echo "Available targets:"
	@sed -n 's/^##//p' $(MAKEFILE_LIST) | column -t -s ':' | sed -e 's/^/ /'

# --- 1. 环境准备 ---

## doctor: [环境] 检查 docker / docker compose / .env 配置
doctor:
	@echo "$(G)[MAKE]==> Checking environment health...$(RESET)"
	@bash ./dev.sh doctor

## deps: [环境] 在容器内安装 npm 依赖
deps:
	@echo "$(G)[MAKE]==> Installing dependencies...$(RESET)"
	@bash ./dev.sh deps

# --- 2. 开发与构建 ---

## lint: [代码] 在容器内执行 ESLint 静态检查
lint:
	@echo "$(G)[MAKE]==> Running static analysis...$(RESET)"
	@bash ./dev.sh lint

## build: [构建] 在容器内编译插件 (生产模式)
build:
	@echo "$(G)[MAKE]==> Building plugin...$(RESET)"
	@bash ./dev.sh build

## clean: [构建] 清理构建产物
clean:
	@echo "$(G)[MAKE]==> Cleaning up...$(RESET)"
	@bash ./dev.sh clean

# --- 3. 运行与调试 ---

## up: [运行] 启动开发容器 (后台运行 esbuild watch)
up:
	@echo "$(G)[MAKE]==> Starting dev container...$(RESET)"
	@bash ./dev.sh up

## down: [运行] 停止并移除开发容器
down:
	@echo "$(G)[MAKE]==> Stopping dev container...$(RESET)"
	@bash ./dev.sh down

## restart: [运行] 重启开发容器
restart:
	@echo "$(G)[MAKE]==> Restarting dev container...$(RESET)"
	@bash ./dev.sh restart

## status: [运行] 查看开发容器运行状态
status:
	@echo "$(G)[MAKE]==> Checking container status...$(RESET)"
	@bash ./dev.sh status

## logs: [运行] 跟踪开发容器实时日志
logs:
	@bash ./dev.sh logs

## shell: [调试] 进入开发容器 shell
shell:
	@echo "$(G)[MAKE]==> Entering container shell...$(RESET)"
	@bash ./dev.sh shell

# --- 4. 质量保证 ---

## test: [测试] 在容器内运行 Jest 单元测试
test:
	@echo "$(G)[MAKE]==> Running tests...$(RESET)"
	@bash ./dev.sh test

## artifacts: [测试] 列出构建产物清单
artifacts:
	@echo "$(G)[MAKE]==> Inspecting output artifacts...$(RESET)"
	@bash ./dev.sh artifacts

# --- 5. 部署与发布 ---

## install: [部署] 在宿主机将构建产物复制到 $$VAULT_PLUGIN_DIR
install:
	@echo "$(G)[MAKE]==> Installing plugin to vault...$(RESET)"
	@bash ./dev.sh install

## release: [发布] 升级版本号并打 git tag (用法: make release VERSION=x.y.z)
release:
	@echo "$(G)[MAKE]==> Creating new release...$(RESET)"
	@bash ./dev.sh release $(VERSION)
