import http from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import * as pty from "node-pty";

interface ShellSession {
    ptyProcess: pty.IPty;
}

const activeSessions = new Map<WebSocket, ShellSession>();

export function attachTerminalWS(
    server: http.Server,
    path: string
): void {
    const wss = new WebSocketServer({ server, path });

    console.log(`[terminal.ws] WebSocket server attached at path: ${path}`);

    wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
        const parsedUrl = url.parse(req.url ?? "", true);
        const sessionId = (parsedUrl.query.sessionId as string) ?? "unknown";

        console.log(`[terminal.ws] Client connected — sessionId=${sessionId}`);

        const shell = process.env.SHELL ?? "/bin/bash";

        let ptyProcess: pty.IPty;
        try {
            ptyProcess = pty.spawn(shell, [], {
                name: "xterm-color",
                cols: 80,
                rows: 24,
                cwd: process.env.HOME ?? "/",
                env: {
                    ...process.env,
                    TERM: "xterm-color",
                    SESSION_ID: sessionId,
                } as Record<string, string>,
            });
        } catch (err) {
            console.error(`[terminal.ws] Failed to spawn shell:`, err);
            ws.close(1011, "Shell spawn failed");
            return;
        }

        activeSessions.set(ws, { ptyProcess });

        ptyProcess.onData((data: string) => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(data);
            }
        });

        ptyProcess.onExit(({ exitCode }) => {
            console.log(
                `[terminal.ws] Shell exited — sessionId=${sessionId}, code=${exitCode}`
            );
            if (ws.readyState === WebSocket.OPEN) {
                ws.close(1000, `Shell exited with code ${exitCode}`);
            }
            activeSessions.delete(ws);
        });

        ws.on("message", (data: Buffer | string) => {
            try {
                const text = data.toString();
                if (text.startsWith("{")) {
                    const msg = JSON.parse(text) as {
                        type?: string;
                        cols?: number;
                        rows?: number;
                    };
                    if (msg.type === "resize" && msg.cols && msg.rows) {
                        ptyProcess.resize(msg.cols, msg.rows);
                        return;
                    }
                }
                ptyProcess.write(text);
            } catch {
                ptyProcess.write(data.toString());
            }
        });

        ws.on("close", () => {
            console.log(
                `[terminal.ws] Client disconnected — sessionId=${sessionId}`
            );
            const session = activeSessions.get(ws);
            if (session) {
                try {
                    session.ptyProcess.kill();
                } catch {
                    // already dead
                }
                activeSessions.delete(ws);
            }
        });

        ws.on("error", (err) => {
            console.error(`[terminal.ws] WS error — sessionId=${sessionId}:`, err);
        });
    });

    wss.on("error", (err) => {
        console.error("[terminal.ws] Server error:", err);
    });
}
