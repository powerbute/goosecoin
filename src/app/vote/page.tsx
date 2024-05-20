'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Head from 'next/head';
import * as React from 'react';
import useLocalStorage from 'use-local-storage';

export default function HomePage() {
  const [session, setSession] = useLocalStorage("session", "");
  const [authData, setAuthData] = useLocalStorage("authdata", {});
  const supabase = createClientComponentClient();

  return (
    <main className='bg-dark'>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-dark min-w-screen min-h-screen py-4 mx-auto text-white xl:w-[1280px] flex flex-col justify-center items-center text-center'>
      </section>
    </main>
  );
}
