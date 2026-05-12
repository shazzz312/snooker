import { Server } from "@colyseus/core";
import { WebSocketTransport } from "@colyseus/ws-transport";
import express from "express";
import http from "http";
import cors from "cors";

import { SnookerRoom } from "./rooms/SnookerRoom";

const port = Number(process.env.PORT || 2567);
const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const gameServer = new Server({
  transport: new WebSocketTransport({
    server
  })
});

// Register SnookerRoom
gameServer.define("snooker", SnookerRoom);

app.get("/hello", (req, res) => {
    res.send("Hello from Snooker Server");
});

gameServer.listen(port).then(() => {
    console.log(`[Snooker Server] Listening on ws://localhost:${port}`);
});
