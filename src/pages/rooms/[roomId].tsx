import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import type { Message } from '../../constants/schemas';
import { trpc } from '../../utils/trpc';
import Head from 'next/head';
import moment from "moment";

const RoomPage = () => {
    const router = useRouter();
    const { query } = router;
    const roomId = query.roomId as string;
    const { data: session } = useSession();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);

    const { mutateAsync: sendMessageMutation } = trpc.room.sendMessage.useMutation();
    trpc.room.onSendMessage.useSubscription({ roomId }, {
        onData(message) {
            setMessages(messages => {
                return [...messages, message]
            })
        }
    })

    const exit = () => {
        router.push("/");
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        sendMessageMutation({
            roomId,
            message
        });
        setMessage('');
    };

    return (
        <>
            <Head>
                <title>Live Chat | {roomId ? "Private Room" : "Public Room"}</title>
                <meta name="description" content="Just a live chat " />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {session && <div className="fixed text-lg top-0 right-0 left-0 flex justify-end px-10 py-4 bg-neutral-900">
                <div className="text-white mr-5">{session.user?.name || "Unknown"}</div>
                <button className="text-gray-400 hover:text-white underline transition-color duration-300" onClick={exit}>Exit Chat Room</button>
            </div>}
            <main className="flex min-h-screen flex-col bg-neutral-900">
                <div className='flex flex-1 justify-end flex-col h-full w-full border-b-2 border-cyan-500 overflow-y-auto px-4 pb-2'>
                    {messages.map((message, key) => {
                        const isCurrentUser = message.sender.name === session?.user?.name;
                        const messageClassName = "w-2/3 rounded-xl p-2";

                        return (
                            <div key={key} className="text-white font-xl flex items-end mb-3">
                                {!isCurrentUser && <div className='h-10 w-10 rounded-full bg-white mr-4'/>}
                                <div className={isCurrentUser ? `bg-gradient-to-r from-cyan-500 to-blue-500 ml-auto rounded-br-none ${messageClassName}` : `bg-neutral-800 mr-auto rounded-bl-none ${messageClassName}`}>
                                    <div>
                                        {!isCurrentUser && <div className='font-bold'>{message.sender.name}</div>}
                                        <div className='text-lg text-white'>{message.message}</div>
                                    </div>
                                    <div className={!isCurrentUser ? 'text-end text-sm text-neutral-400' : 'text-end text-sm text-white'}>Sent {moment(message.sentAt).fromNow()}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <form
                    className='w-full bg-neutral-800 px-3 pb-7 pt-4 flex justify-center items-center'
                    onSubmit={handleSubmit}
                >
                    <input placeholder="Aa" autoFocus={true} className="w-full py-2 px-5 h-14 text-lg rounded-full bg-neutral-700 focus:ring-white text-white resize-none" value={message} onChange={e => setMessage(e.currentTarget.value)} />
                    <button className='rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 w-14 h-14 text-white font-semibold ml-5 p-2' type='submit'>Send</button>
                </form>
            </main>
        </>
    )
}

export default RoomPage;
