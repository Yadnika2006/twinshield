import http from "http";
import url from "url";
import { WebSocketServer, WebSocket } from "ws";
import type { Request, Response } from "express";

const sessionClients = new Map<string, Set<WebSocket>>();

export function attachEventsWS(
    server: http.Server,
    path: string
): void {
    const wss = new WebSocketServer({ server, path });

    console.log(`[events.ws] WebSocket server attached at path: ${path}`);

    wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
        const parsedUrl = url.parse(req.url ?? "", true);
        const sessionId = (parsedUrl.query.sessionId as string) ?? "unknown";

        console.log(`[events.ws] Client connected — sessionId=${sessionId}`);

        if (!sessionClients.has(sessionId)) {
            sessionClients.set(sessionId, new Set());
        }
        sessionClients.get(sessionId)!.add(ws);

        if (ws.readyState === WebSocket.OPEN) {
            ws.send(
                JSON.stringify({
                    type: "connected",
                    sessionId,
                    message: "Event stream ready",
                })
            );
        }

        ws.on("close", () => {
            console.log(
                `[events.ws] Client disconnected — sessionId=${sessionId}`
            );
            const clients = sessionClients.get(sessionId);
            if (clients) {
                clients.delete(ws);
                if (clients.size === 0) {
                    sessionClients.delete(sessionId);
                }
            }
        });

        ws.on("error", (err) => {
            console.error(`[events.ws] WS error — sessionId=${sessionId}:`, err);
        });
    });

    wss.on("error", (err) => {
        console.error("[events.ws] Server error:", err);
    });
}

export function emitEventHandler(req: Request, res: Response): void {
    const { sessionId, event } = req.body as {
        sessionId?: string;
        event?: string;
    };

    if (!sessionId || typeof sessionId !== "string") {
        res.status(400).json({ error: "sessionId is required and must be a string" });
        return;
    }
    if (!event || typeof event !== "string") {
        res.status(400).json({ error: "event is required and must be a string" });
        return;
    }

    const clients = sessionClients.get(sessionId);

    if (!clients || clients.size === 0) {
        console.log(
            `[events.ws] No clients for sessionId=${sessionId}, event dropped`
        );
        res.status(200).json({ delivered: 0, sessionId });
        return;
    }

    let delivered = 0;
    for (const ws of clients) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(event);
            delivered++;
        }
    }

    console.log(
        `[events.ws] Broadcasted event to ${delivered}/${clients.size} clients — sessionId=${sessionId}`
    );

    res.status(200).json({ delivered, total: clients.size, sessionId });
}

export function getSessionStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    for (const [sid, clients] of sessionClients.entries()) {
        stats[sid] = clients.size;
    }
    return stats;
}
