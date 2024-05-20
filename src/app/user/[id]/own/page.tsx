'use client';

import Head from 'next/head';
import * as React from 'react';

import ArrowLink from '@/components/links/ArrowLink';
import ButtonLink from '@/components/links/ButtonLink';
import UnderlineLink from '@/components/links/UnderlineLink';
import UnstyledLink from '@/components/links/UnstyledLink';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */
import Logo from '~/svg/Logo.svg';

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.
import { IoMdSearch, IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { CiPassport1, CiMedicalCross } from "react-icons/ci";
import { FaCity } from "react-icons/fa";
import { MdOutlineWorkOutline, MdOutlineAdminPanelSettings, MdLogout } from "react-icons/md";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NextImage from '@/components/NextImage';
import useLocalStorage from "use-local-storage";


export default function HomePage({ params }: { params: { id: string } }) {
  const userID = params.id;
  const [userData, setUserData] = React.useState<any>({
    nickname: "Steve"
  });
  const [rolesData, setRolesData] = React.useState<any>([]);
  const [ownData, setOwnData] = React.useState<any>([]);
  const [ownsData, setOwnsData] = React.useState<any>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [session, setSession] = useLocalStorage("session", "");
  const [passid, setPassid] = React.useState<any>();
  const [authData, setAuthData] = React.useState<any>({});
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Create a single supabase client for interacting with your database
  const supabase = createClientComponentClient();

  async function getUserData() {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("id", userID)
      .single();
    if (users == null) {
      location.replace("/error");
      return;
    }
    setUserData(users);
    getRolesData();
    getOwn();
    getOwns(users?.passid);
    console.log(session);
    getPassID(session);
    setLoaded(true);
    console.log(users)
  }

  async function getRolesData() {
    let { data: users, error } = await supabase
      .from('roles')
      .select('*');
    setRolesData(users);
    console.log(users)
  }

  async function getOwns(id: any) {
    let { data: owns, error } = await supabase
      .from('owns')
      .select('*')
      .eq("passid", id);
    setOwnsData(owns);
    console.log(owns);
  }

  async function getOwn() {
    let { data: owns, error } = await supabase
      .from('own')
      .select('*');
    setOwnData(owns);
    console.log(owns);
  }

  async function getUser(nickname: any) {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("nickname", nickname)
      .single();
    if (users?.id == null) {
      alert("Пользователь не найден!")
    }
    location.replace("/user/" + users.id)

  }

  async function getPassID(session: any) {
    let { data: users, error } = await supabase
      .from('sessions')
      .select('*')
      .eq("session", session)
      .single();
    setPassid(users?.passid);
    getUserByPassID(users?.passid);
  }

  async function getUserByPassID(passid: any) {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("passid", passid)
      .single();
    if (users?.id == null) {
      alert("Пользователь не найден!")
      location.replace("/error")
    } else {
      setAuthData(users);
    }

  }

  React.useEffect(() => {
    if (!loaded) {
      getUserData();
    }
  })

  async function handleSearch(event: any) {
    if (event.key === 'Enter') {
      getUser(event.target.value)
    }
  }

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

  return (
    <main className='bg-dark'>
      <Head>
        <title>Hi</title>
      </Head>
      <div className='bg-red-500 bg-red-600 bg-green-800 bg-zinc-400 '></div>
      {loaded ? <section className='bg-dark min-w-screen min-h-screen py-4 mx-auto text-white xl:w-[1280px]'>
        {searchOpen ? <div className='flex sm:hidden mb-2 mx-4 items-center border border-dark3 rounded-md select-none px-2 sm:w-96'>
          <IoMdSearch size={20} className='text-gray-600' />
          <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onKeyDown={handleSearch} />
        </div> : null}
        <header className='px-4 flex h-[56px] items-center justify-between'>
          <a className='hidden lg:flex items-end translation-transform hover:scale-105 text-lg gap-2' href='/'><img src='/logo.png' className='w-14' /> <span className='font-bold bg-red-500 rounded-md px-[5px] py-[1px]'>ALPHA</span></a>
          <div className='hidden sm:flex items-center border border-dark3 rounded-md select-none px-2 sm:w-96'>
            <IoMdSearch size={20} className='text-gray-600' />
            <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onKeyDown={handleSearch} />
          </div>
          <div className='flex gap-4 justify-center w-full sm:w-fit sm:justify-start items-center select-none'>
            {authData?.roles?.includes(1) ? <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => location.replace("/admin")}><MdOutlineAdminPanelSettings color='black' size={28} /></div> : null}
            <div className='block sm:hidden bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => setSearchOpen(!searchOpen)}><IoMdSearch color='black' size={28} /></div>
            <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => location.replace("/settings")}><IoSettingsOutline color='black' size={28} /></div>
            <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoMdNotificationsOutline color='black' size={28} /></div>
            <div className='bg-red-500 hover:bg-red-600 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => {
              setSession("");
              alert("Выход успешно выполнен!")
              location.replace("/");
            }}><MdLogout color='white' size={28} /></div>
            {session != "" ? <div className='w-14 h-14 cursor-pointer' onClick={() => {
              getUser(authData?.nickname)
            }}>
              <NextImage onError={(e) => {
                e.currentTarget.srcset = "/Steve.webp";
              }} width={56} height={56} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (authData?.nickname)} />
            </div> : null}
          </div>
        </header>
        <section className='bg-transparent text-transparent select-none rounded-2xl px-4 py-4 mx-4 mt-4 hidden sm:block'>
          <div className='text-lg'><span className='uppercase font-black'>Внимание!</span> Для безопасности и быстрого входа, привяжите свой Telegram, <span className='cursor-pointer'>инструкция</span></div>
        </section>
        <section className='px-4 mt-4'>
          <div className='z-1 hidden xl:flex gap-4 h-48 select-none'>
            <div className='bg-dark2 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer' onClick={() => location.replace("/user/" + userID)}>
              <div className='text-3xl font-bold'>Профиль</div>
              <CiPassport1 className='absolute bottom-[-0.8rem] right-[-2rem] text-zinc-600 hover:text-white' size={150} />
            </div>
            <div className='bg-dark2 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer hidden'>
              <div className='text-3xl font-bold'>Здоровье</div>
              <CiMedicalCross className='absolute bottom-[-1.2rem] right-[-1.3rem] text-zinc-600 hover:text-white' size={150} />
            </div>
            <div className='bg-dark2 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer'>
              <div className='text-3xl font-bold'>Собственность</div>
              <FaCity className='absolute bottom-[-0.9rem] right-[0rem]' size={150} />
            </div>
            <div className='bg-dark2 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer hidden' onClick={() => location.replace("/user/" + userID + "/job")}>
              <div className='text-3xl font-bold'>Работа</div>
              <MdOutlineWorkOutline className='absolute bottom-[-1.2rem] right-[-1rem] text-zinc-600 hover:text-white' size={150} />
            </div>
          </div>
          <div className='flex flex-col xl:hidden gap-2 select-none'>
            <div className='grid grid-cols-2 w-full gap-2'>
              <div className='bg-dark2 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg' onClick={() => location.replace("/user/" + userID)}><CiPassport1 size={28} /> Профиль</div>
              <div className='bg-dark2 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg hidden'><CiMedicalCross size={28} /> Здоровье</div>
              <div className='bg-dark2 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg'><FaCity size={28} /> Собственность</div>
            </div>
            <div className='grid grid-cols-2 w-full gap-2 hidden'>
              <div className='bg-dark2 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg'><FaCity size={28} /> Собственность</div>
              <div className='bg-dark2 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg hidden'><MdOutlineWorkOutline size={28} onClick={() => location.replace("/user/" + userID + "/job")} /> Работа</div>
            </div>
          </div>
          <div className='flex gap-4 mt-4 flex-col md:flex-row'>
            <div className='bg-dark2 rounded-2xl md:w-1/3 px-4 py-6 h-fit'>
              <div className='flex flex-col gap-2'>
                <div className='flex gap-2 md:gap-0 md:flex-col'>
                  <NextImage onError={(e) => {
                    e.currentTarget.srcset = "/Steve.webp";
                  }} width={128} height={128} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (userData?.nickname)} />
                  <div className='flex flex-col'>
                    <div className='font-bold text-3xl'>{userData?.surname}</div>
                    <div className='font-medium text-zinc-400 text-xl'>{userData?.nickname}</div>
                    <div className='text-zinc-500'>@user{userID}</div>
                  </div>
                </div>
                <div className='flex flex-wrap gap-1 select-none'>
                  {userData?.roles?.map((e: any) =>
                    <div key={makeid(5)} className={'rounded-md px-2 py-0.5 bg-' + (rolesData[e - 1]?.color)}>{rolesData[e - 1]?.name}</div>
                  )}
                </div>
              </div>
            </div>
            <div className='w-full grid md:grid-cols-2 lg:grid-cols-3 gap-4 rounded-2xl h-fit'>
              {ownsData?.map((e: any) =>
                <div key={makeid(5)} className='bg-dark2 py-6 px-8 min-h-[10rem] flex flex-col justify-between rounded-2xl'>
                  <div className={'bg-yellow-500 w-fit md:w-full rounded-2xl px-2 py-1 ' + (e?.onCredit ? "block" : "hidden")}>В кредит</div>
                  <div className='text-3xl font-bold'>{ownData.find((x: any) => x.id == e?.ownid)?.name}</div>
                  <div className='text-lg font-bold'>{e?.role}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      </section> :
        <section className='bg-dark w-screen h-screen flex justify-center items-center'>
          <div className='flex flex-col gap-2'>
            <img src='/logo.png' className='animate-pulse' width={256} />
            <div className='text-3xl text-fond text-center text-white'>Загрузка...</div>
          </div>
        </section>
      }
    </main>
  );
}

/*export async function getServerSideProps() {
  const router = useRouter();
  // Fetch data from external API
  const supabase = createClient(process.env.PUBLIC_SUPABASE_URL as string, process.env.PUBLIC_SUPABASE_ANON_KEY as string)
  let { data, error } = await supabase
    .from('users')
    .select('*')
    .eq("id", router.query.id)
    .single();

  // Pass data to the page via props
  return { props: { data } }
}*/
