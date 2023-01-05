import * as trpc from "@trpc/server";
import type ws from "ws";
import type * as trpcNext from "@trpc/server/adapters/next";
import { EventEmitter } from "node:events";
import type { IncomingMessage } from "http";
import { unstable_getServerSession as getServerSession } from "next-auth";

import { authOptions as nextAuthOptions } from "../../pages/api/auth/[...nextauth]";
import { prisma } from "../db/client";
import { getSession } from "next-auth/react";
import type { NodeHTTPCreateContextFnOptions } from "@trpc/server/dist/adapters/node-http";

const ee = new EventEmitter();

export const createContext = async (
  opts?:
    | trpcNext.CreateNextContextOptions
    | NodeHTTPCreateContextFnOptions<IncomingMessage, ws>
) => {
  const req = opts?.req;
  const res = opts?.res;

  const session = req && res && (await getSession({ req }));

  return {
    req,
    res,
    session,
    prisma,
    ee,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
