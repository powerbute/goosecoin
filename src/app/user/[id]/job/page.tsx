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
import JobTask from '@/components/JobTask';
import JobTasks from '@/components/JobTasks';


export default function HomePage({ params }: { params: { id: string } }) {
  const userID = params.id;
  const [userData, setUserData] = React.useState<any>({
    nickname: "Steve"
  });
  const [rolesData, setRolesData] = React.useState<any>([]);
  const [ownData, setOwnData] = React.useState<any>([]);
  const [jobsData, setJobsData] = React.useState<any>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [session, setSession] = useLocalStorage("session", "");
  const [passid, setPassid] = React.useState<any>();
  //const [jobsID, setJobsID] = React.useState<any>();
  const [jobID, setJobID] = React.useState<any>();
  const [authData, setAuthData] = React.useState<any>({});
  const [avatarMenu, setAvatarMenu] = React.useState(false);
  let jobsID: any[] = [];

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
    getJobsID(users?.passid);
    //console.log(session);
    getPassID(session);
    setLoaded(true);
    //console.log(users)
  }

  async function getRolesData() {
    let { data: users, error } = await supabase
      .from('roles')
      .select('*');
    setRolesData(users);
    //console.log(users)
  }

  async function getJobsID(id: any) {
    jobsID = [];
    let { data: jobs, error } = await supabase
      .from('jobworkers')
      .select('passid, jobid, active')
      .eq('passid', id)
      .eq('active', 'true')
    jobs?.forEach((e: any) => {
      if (e?.jobid != undefined) {
        jobsID?.push(e?.jobid);
      }
    });
    let uniqueChars: any[] = [];
    jobsID.forEach((element) => {
      if (!uniqueChars.includes(element)) {
        uniqueChars.push(element);
      }
    });
    jobsID = uniqueChars;
    getJobs(id);
    console.log(jobsID)
  }

  async function getJobs(id: any) {
    let { data: jobs, error } = await supabase
      .from('jobs')
      .select('*')
      .eq("id", jobsID);
    setJobsData(jobs);
    //console.log(jobs);
  }

  async function getOwn() {
    let { data: owns, error } = await supabase
      .from('own')
      .select('*');
    setOwnData(owns);
    //console.log(owns);
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
      {loaded ? <section className='bg-dark min-w-screen min-h-screen py-4 mx-auto text-white xl:w-[1280px]'>
        <header className='px-4 flex h-[56px] items-center justify-between'>
          <a className='hidden lg:flex items-end translation-transform hover:scale-105 text-lg gap-2' href='/'><img src='/logo.png' className='w-14' /> <span className='font-bold bg-red-500 rounded-md px-[5px] py-[1px]'>ALPHA</span></a>
          <div className='hidden sm:flex items-center border border-zinc-700 rounded-md select-none px-2 sm:w-96'>
            <IoMdSearch size={20} className='text-gray-600' />
            <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onKeyDown={handleSearch} />
          </div>
          <div className='flex gap-4 justify-center w-full sm:w-fit sm:justify-start items-center select-none'>
            {authData?.roles?.includes(1) ? <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><MdOutlineAdminPanelSettings color='black' size={28} /></div> : null}
            <div className='block sm:hidden bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoMdSearch color='black' size={28} /></div>
            <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => location.replace("/settings")}><IoSettingsOutline color='black' size={28} /></div>
            <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoMdNotificationsOutline color='black' size={28} /></div>
            {avatarMenu ? <div className='bg-red-500 hover:bg-red-600 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => {
              setSession("");
              alert("Выход успешно выполнен!")
              location.replace("/");
            }}><MdLogout color='white' size={28} /></div> : null}
            {session != "" ? <div className='w-14 h-14 cursor-pointer' onClick={() => setAvatarMenu(!avatarMenu)}>
              <img src={'https://avatar.spworlds.ru/face/512/' + (authData?.nickname)} className='rounded-2xl' />
            </div> : null}
          </div>
        </header>
        <section className='bg-zinc-700 rounded-2xl px-4 py-4 mx-4 mt-4'>
          <div className='text-lg'><span className='uppercase font-black'>Внимание!</span> Для безопасности и быстрого входа, привяжите свой Telegram, <span className='cursor-pointer'>инструкция</span></div>
        </section>
        <section className='px-4 mt-4'>
          <div className='z-1 hidden xl:flex justify-between h-48 select-none'>
            <div className='bg-zinc-700 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer' onClick={() => location.replace("/user/" + userID)}>
              <div className='text-3xl font-bold'>Профиль</div>
              <CiPassport1 className='absolute bottom-[-0.8rem] right-[-2rem] text-zinc-600 hover:text-white' size={150} />
            </div>
            <div className='bg-zinc-700 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer' onClick={() => location.replace("/user/" + userID + "/own")}>
              <div className='text-3xl font-bold'>Здоровье</div>
              <CiMedicalCross className='absolute bottom-[-1.2rem] right-[-1.3rem] text-zinc-600 hover:text-white' size={150} />
            </div>
            <div className='bg-zinc-700 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer'>
              <div className='text-3xl font-bold'>Собственность</div>
              <FaCity className='absolute bottom-[-0.9rem] right-[0rem] text-zinc-600 hover:text-white' size={150} />
            </div>
            <div className='bg-zinc-700 rounded-2xl py-4 px-2 relative w-72 overflow-hidden cursor-pointer'>
              <div className='text-3xl font-bold'>Работа</div>
              <MdOutlineWorkOutline className='absolute bottom-[-1.2rem] right-[-1rem]' size={150} />
            </div>
          </div>
          <div className='flex flex-col xl:hidden gap-2 select-none'>
            <div className='grid grid-cols-2 w-full gap-2'>
              <div className='bg-zinc-700 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg'><CiPassport1 size={28} onClick={() => location.replace("/user/" + userID)} /> Профиль</div>
              <div className='bg-zinc-700 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg'><CiMedicalCross size={28} /> Здоровье</div>
            </div>
            <div className='grid grid-cols-2 w-full gap-2'>
              <div className='bg-zinc-700 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg'><FaCity size={28} onClick={() => location.replace("/user/" + userID + "/own")} /> Собственность</div>
              <div className='bg-zinc-700 rounded-2xl h-fit p-2 flex items-center gap-2 font-bold text-lg'><MdOutlineWorkOutline size={28} /> Работа</div>
            </div>
          </div>
          <div className='flex gap-4 mt-4 flex-col md:flex-row'>
            <div className='bg-zinc-700 rounded-2xl md:w-1/3 px-4 py-6 h-fit'>
              <div className='bg-blue-500 p-2 rounded-2xl mb-2'>
                <div className='text-lg text-center'>Нужна работа? Воспользуйтесь нашей биржей труда</div>
                <div className='bg-blue-600 hover:bg-blue-700 cursor-pointer rounded-2xl p-1 flex justify-center'>Открыть</div>
              </div>
              <div className='text-3xl font-bold'>Организации</div>
              <div className='flex flex-col mt-4'>
                {jobsData?.map((e: any) =>
                  <div key={makeid(5)} className='text-xl font-bold p-2 hover:bg-zinc-500 cursor-pointer rounded-2xl' onClick={() => {
                    setJobID(e?.id);
                  }}>{e?.name}</div>
                )}
              </div>
            </div>
            <div className='w-full flex flex-col x-4 sm:px-8 py-4 sm:py-6 gap-4 rounded-2xl bg-zinc-700'>
              {jobID != null ? <JobTasks job={{ jobID: jobID, passID: userData?.passid }} /> : <div className='text-3xl flex justify-center items-center h-full'>Выберите организацию</div>}
            </div>
          </div>
        </section>
      </section> :
        <section className='bg-dark w-screen h-screen flex justify-center items-center'>
          <div className='flex flex-col gap-2'>
            <img src='/logo.png' className='animate-pulse' width={256} />
            <div className='text-3xl font-bold text-center text-white'>Загрузка...</div>
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
