import { router } from "../trpc";
import { authRouter } from "./auth";
import { roomRouter } from "./room";
import fetch from "node-fetch";

if(!global.fetch){
  (global.fetch as unknown) = fetch;
}

export const appRouter = router({
  room: roomRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
