'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation'
import * as React from 'react';
import { FaIdCard } from 'react-icons/fa6';
import useLocalStorage from 'use-local-storage';

export default function HomePage() {
  const [session, setSession] = useLocalStorage("session", "");
  const [authData, setAuthData] = useLocalStorage("authdata", {});
  const supabase = createClientComponentClient();

  const searchParams = useSearchParams()

  const voteID = searchParams.get('vote')
  const sessionKey = searchParams.get('key')

  function makeid(length: any) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async function genSession(passID: any) {
    let sess = makeid(256);
    const { error } = await supabase
      .from('sessions')
      .insert({ passid: passID, session: sess })
    setSession(sess);
    getProfile(passID);
  }

  async function getProfile(passID: any) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('passid', passID)
      .single()
    setAuthData(data)
    if (voteID != null) {
      window.open("/vote/" + voteID, "_self");
      return;
    }
    window.open("/", "_self")
  }

  async function getPassID(authID: any) {

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session', authID)
      .single()
    if (data != null) {
      const { data: a1, error: a2 } = await supabase
        .from('users')
        .select('*')
        .eq('passid', data?.passid)
        .single()
      setAuthData(a1);
      setSession(authID);
      if (voteID != null) {
        window.open("/vote/" + voteID, "_self")
      } else {
        window.open("/", "_self")
      }
    }
  }

  return (
    <main className='bg-dark'>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-dark min-w-screen min-h-screen py-4 mx-auto text-white xl:w-[1280px] flex flex-col justify-center items-center text-center'>
        <div className='flex flex-col gap-6 bg-dark2 rounded-2xl justify-around items-center p-8 w-1/2'>
          <div className='p-4 rounded-2xl bg-dark5 flex items-center justify-center gap-2 hover:bg-dark4 cursor-pointer w-full' onClick={() => {
            getPassID(sessionKey);
          }}><FaIdCard /> Авторизоваться</div>
        </div>
      </section>
    </main>
  );
}
