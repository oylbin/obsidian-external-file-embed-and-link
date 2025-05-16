import * as http from 'http';
import { Notice } from 'obsidian';
import { httpRequestHandler, findAvailablePort, CrossComputerLinkContext } from './server';

export class HttpServer {
    private server: http.Server | null = null;

    constructor(private context: CrossComputerLinkContext) {}

    public async start() {
        try {
            const port = await findAvailablePort(this.context.port);
            if (port !== this.context.port) {
                this.context.port = port;
            }

            const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
                httpRequestHandler(req, res, this.context);
            });

            server.listen(port, "127.0.0.1", () => {
                // Server started successfully
            });

            server.on('error', (e: NodeJS.ErrnoException) => {
                if (e.code === 'EADDRINUSE') {
                    new Notice(`Port ${port} is already in use. Please choose a different port in settings.`);
                } else {
                    new Notice(`Failed to start HTTP server: ${e.message}`);
                }
                this.server = null;
            });

            this.server = server;
        } catch (err) {
            new Notice(`Failed to start HTTP server: ${err.message}`);
            this.server = null;
        }
    }

    public stop() {
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }
} 
