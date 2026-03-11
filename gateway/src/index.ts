import http from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import { attachTerminalWS } from "./terminal.ws";
import { attachEventsWS, emitEventHandler } from "./events.ws";

dotenv.config();

const PORT = process.env.PORT ?? 4000;

const app = express();

// ── Middleware ────────────────────────────────────────────────
app.use(cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true,
}));
app.use(express.json());

// ── Health check ──────────────────────────────────────────────
app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: "twinshield-gateway" });
});

// ── POST /emit-event ──────────────────────────────────────────
app.post("/emit-event", emitEventHandler);

// ── HTTP server (shared with WebSocket servers) ───────────────
const server = http.createServer(app);

// ── Attach WebSocket handlers ─────────────────────────────────
attachTerminalWS(server, "/terminal");
attachEventsWS(server, "/events");

// ── Start ─────────────────────────────────────────────────────
server.listen(PORT, () => {
    console.log(`[gateway] Listening on http://localhost:${PORT}`);
    console.log(`[gateway]   WS terminal → ws://localhost:${PORT}/terminal?sessionId=<id>`);
    console.log(`[gateway]   WS events   → ws://localhost:${PORT}/events?sessionId=<id>`);
    console.log(`[gateway]   POST event  → http://localhost:${PORT}/emit-event`);
});
