import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import type { Message } from '../../constants/schemas';
import { appRouter } from '../../server/trpc/router/_app';
import { trpc } from '../../utils/trpc';

const RoomPage = () => {
    const { query } = useRouter();
    const roomId = query.roomId as string;
    const { data: session } = useSession();
    const [message, setMessage] = useState('');
    const [ messages, setMessages ] = useState<Message[]>([]);

    const { mutateAsync: sendMessageMutation } = trpc.room.sendMessage.useMutation();
    trpc.room.onSendMessage.useSubscription({ roomId }, {
        onData(message) {
            setMessages(messages => {
                return [...messages, message]
            })
        }
    })

    return (
        <div>
            <div>Welcome to room {roomId}</div>
            <ul>
                {messages.map((message, key) => (
                    <div key={key}>{message.sender.name} - {message.message}</div>
                ))}
            </ul>
            <form onSubmit={(e) => {
                e.preventDefault();
                sendMessageMutation({
                    roomId,
                    message
                });
                setMessage('');
            }}>
                <textarea value={message} onChange={(e) => setMessage(e.currentTarget.value)} placeholder='write something...'/>
                <button type='submit'>Send Message</button>

            </form>
        </div>
    )
}

export default RoomPage;
