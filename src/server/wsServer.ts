import { WebSocketServer } from "ws";
import { applyWSSHandler } from "@trpc/server/adapters/ws";

import { createContext } from "./trpc/context";
import { appRouter } from "./trpc/router/_app";

const wss = new WebSocketServer({
  port: 3001,
});

const handler = applyWSSHandler({ wss, router: appRouter, createContext });

wss.on("connection", () => {
  console.log(`Got a connection ${wss.clients.size}`);
  wss.once("close", () => {
    console.log(`Closed connection ${wss.clients.size}`);
  });
});

console.log(`wss server start at ws://localhost:3001`);

process.on("SIGTERM", () => {
  console.log("Got SIGTERM");
  handler.broadcastReconnectNotification();
  wss.close();
});