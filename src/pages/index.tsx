import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";
import { customAlphabet } from 'nanoid';
import { useRouter } from "next/router";
import { Modal } from "../components/Modal";
import { useState } from "react";

const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10);

const Home: NextPage = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [roomId, setRoomId] = useState('');
  const [showModal, setShowModal] = useState(false);

  const createPublicRoom = () => {
    router.push(`/rooms/public`);
  };

  const createPrivateRoom = () => {
    const roomId = nanoId();

    router.push(`/rooms/${roomId}`);
  };

  const joinPrivateRoom = (roomId: string) => {
    router.push(`/rooms/${roomId}`);
  };

  return (
    <>
      <Head>
        <title>Live Chat</title>
        <meta name="description" content="Just a live chat " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Modal showModal={showModal}>
        <div className="max-w-lg mx-auto bg-neutral-800 py-5 rounded-lg">
          <form onSubmit={(e) => {
            e.preventDefault();
            joinPrivateRoom(roomId);
          }}>
            <div className="border-b mb-5 w-full px-5 py-3 flex justify-end items-center">
              <div className="cursor-pointer text-white border-gray-400 text-2xl transition-opacity duration-300 hover:opacity-30" onClick={() => setShowModal(false)}>x</div>
            </div>
            <div className="px-4">
              <div className="text-white text-center mb-8 text-xl font-semibold">Join Private Chat Room</div>
              <input placeholder="Enter the chat room id..." autoFocus={true} className="w-full py-2 px-5 rounded-full mb-3 bg-neutral-600 focus:ring-white text-white" value={roomId} onChange={(e) => setRoomId(e.currentTarget.value)} />
              <button className="w-full py-3 rounded-full bg-gradient-to-r from-sky-600 to-indigo-700 text-white font-semibold transition-opacity duration-300 hover:opacity-30" type="submit">Go To The Chat Room</button>
            </div>
          </form>
        </div>
      </Modal>
      {session && <div className="fixed text-lg top-0 right-0 left-0 flex justify-end px-10 py-4">
        <div className="text-white mr-5">{session.user?.name || "Unknown"}</div>
        <button className="text-gray-400 hover:text-white underline transition-color duration-300" onClick={() => signOut()}>Sign Out</button>
      </div>}
      <main className="flex min-h-screen flex-col items-center justify-center bg-neutral-900">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <div className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-blue-500">Live Chat</div>
            <div className="text-base font-thin text-white text-center">By Isaac Fimbres</div>
            {session ? (
              <div className="mt-16 max-w-xs w-full">
                <button className="w-full py-3 rounded-full bg-gradient-to-r from-sky-600 to-indigo-700 text-white font-semibold transition-opacity duration-300 hover:opacity-30" onClick={createPublicRoom}>Create Public Chat Room</button>
                <button className="w-full py-3 rounded-full mt-3 bg-gradient-to-r from-sky-600 to-indigo-700 text-white font-semibold transition-opacity duration-300 hover:opacity-30" onClick={createPrivateRoom}>Create Private Chat Room</button>
                <button className="w-full py-3 mt-3 text-white font-semibold transition-opacity duration-300 hover:opacity-30" onClick={() => setShowModal(true)}>Join Private Chat Room</button>
              </div>
            ) : (
              <div className="mt-16 max-w-xs w-full">
                <button className="w-full py-3 rounded-full bg-gradient-to-r from-sky-600 to-indigo-700 text-white font-semibold transition-opacity duration-300 hover:opacity-30" onClick={() => signIn()}>Sign In</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
