import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { customAlphabet } from 'nanoid';
import { useRouter } from "next/router";

const nanoId = customAlphabet('abcdefghijklmnopqrstuvwxyz1234567890', 10);

const Home: NextPage = () => {
  const router = useRouter();

  const createRoom = () => {
    const roomId = nanoId();

    router.push(`/rooms/${roomId}`);
  }

  return (
    <>
      <Head>
        <title>Live Chat</title>
        <meta name="description" content="Just a live chat " />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              Hello World!
            </p>
            <AuthShowcase />
            <button onClick={createRoom}>Create Live Chat Room</button>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.email}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
