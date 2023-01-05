import { randomUUID } from "crypto";
import { Events } from "../../../constants/events";
import type { Message} from "../../../constants/schemas";
import { messageSubSchema, sendMessageSchema } from "../../../constants/schemas";
import { observable } from "@trpc/server/observable";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const roomRouter = router({
    onSendMessage: publicProcedure.input(messageSubSchema).subscription(({ ctx, input }) => {
        return observable<Message>((emit) => {
            function onMessage(data: Message) {
                if(input.roomId !== data.roomId){
                    emit.next(data);
                }
            }

            ctx.ee.on(Events.SEND_MESSAGE, onMessage);

            return () => {
                ctx.ee.on(Events.SEND_MESSAGE, onMessage);
            }
        })
    }),
    sendMessage: publicProcedure.input(sendMessageSchema).mutation(async ({ ctx, input }) => {
        const message: Message = {
            id: randomUUID(),
            ...input,
            sentAt: new Date(),
            sender: {
                name: ctx.session?.user?.name || "Unknown"
            }
        }

        ctx.ee.emit(Events.SEND_MESSAGE, message);

        return message;
    }),
    
})
