'use client';

import Head from 'next/head';
import * as React from 'react';

import useLocalStorage from "use-local-storage";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function HomePage({ params }: { params: { id: string } }) {
  const authID = params.id;
  const [session, setSession] = useLocalStorage("session", "");
  const supabase = createClientComponentClient();
  const [a, setA] = React.useState(false);

  async function getProfile(passID: any) {
    const { data, error } = await supabase
      .from('users')
      .select('passid, id')
      .eq('passid', passID)
      .single()
    location.replace("/user/" + data?.id);
  }

  React.useEffect(() => {
    getPassID();
  })

  async function getPassID() {
    if (a == true) return;

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('session', session)
      .single()
    if (data != null) {
      getProfile(data?.passid)
    } else {
      alert("Пользователь не найден!")
    }
  }

  return (
    <main className='bg-dark'>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-dark w-screen h-screen flex justify-center items-center'>
        <div className='flex flex-col gap-2'>
          <img src='/logo.png' className='animate-pulse' width={256} />
          <div className='text-3xl font-bold text-center text-white'>Загрузка...</div>
        </div>
      </section>
    </main>
  );
}
