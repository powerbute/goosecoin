import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useState } from "react"
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";
import { MdOutlinePolicy, MdOutlinePlayCircle, MdOutlinePauseCircle } from "react-icons/md";

export default function Passport({ passport }: { passport: { authData: any, userID: any } }) {
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState<any>({});

  async function getUser(id: any) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq("id", id)
      .single();
    setUserData(user);
  }

  useEffect(() => {
    if (loaded) return;
    getUser(passport.userID);
    if (userData?.id != null) {
      setLoaded(true);
    }
  })

  return (
    <>
      {!loaded ?
        <div className="flex flex-col gap-4 w-full">
          <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl min-h-[395px] justify-center items-center'>
            <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl'>
              <div className='flex justify-between items-center mb-4 select-none flex-col md:flex-row'>
                <div className='text-3xl font-bold flex items-center gap-2 text-transparent'><span className="bg-dark4 animate-pulse rounded-2xl">Паспортные данные</span> <span className='rounded-md bg-dark4 animate-pulse text-base px-1 h-fit'>Активно</span></div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Никнейм</div>
                  <div className='text-xl md:text-2xl font-bold text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Example Nickname</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Псевдоним</div>
                  <div className='text-xl md:text-2xl font-bold text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Example Surname</div>
                </div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Дата рождения</div>
                  <div className='text-xl md:text-2xl font-bold text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Example Birth Date</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Telegram</div>
                  <div className='text-xl md:text-2xl font-bold text-transparent bg-dark4 w-fit animate-pulse rounded-2xl' onClick={() => {
                    location.replace("https://t.me/" + userData?.tg)
                  }}>@ExampleTG</div>
                </div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>ID</div>
                  <div className='text-xl md:text-2xl font-bold uppercase text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>EXM-XXXXXX</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Выдан кем</div>
                  <div className='text-xl md:text-2xl font-bold text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Government of Avinesia</div>
                </div>
              </div>
              <div className='grid grid-cols-2'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Дата выдачи</div>
                  <div className='text-xl md:text-2xl font-bold text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>01.01.1970</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>Действителен до</div>
                  <div className='text-xl md:text-2xl font-bold text-transparent bg-dark4 w-fit animate-pulse rounded-2xl'>01.01.1970</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : null}
      {(passport.authData?.id == userData?.id || passport.authData?.roles?.includes(1)) && loaded ?
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full wrapper">
            <div className={"rounded-2xl " + (userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" ? " border-passport2021" : "")} ></div>
            <div className={'w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl' + (userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" ? " main-element" : "")}>
              <div className='flex justify-between items-center mb-4 select-none flex-col md:flex-row'>
                <div className='text-3xl font-bold flex items-center gap-2'>Паспортные данные {userData?.status == 1 && userData?.preStatus == null ? <span className='rounded-md bg-green-500 text-base px-1 h-fit'>Активно</span> : null}{userData?.status == 1 && userData?.preStatus == 1 ? <span className='rounded-md bg-green-500 text-base px-1 h-fit bg-opacity-50 text-opacity-50'>Активно</span> : null}{userData?.status == 0 || (userData?.status == 2 && userData?.preStatus == null) ? <span className='rounded-md bg-yellow-500 text-base px-1 h-fit'>На рассмотрении</span> : null}{userData?.status == 2 && userData?.preStatus != null ? <span className='rounded-md bg-purple-500 text-base px-1 h-fit'>Приостановлено</span> : null}{userData?.status == 3 ? <span className='rounded-md bg-red-500 text-base px-1 h-fit'>Изъято</span> : null}</div>
              </div>
              <div className={'grid mb-4 ' + (userData?.nickname?.length > 14 ? "grid-cols-1 md:grid-cols-2 gap-2 md:gap-0" : "grid-cols-2")}>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Никнейм</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.nickname}</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Псевдоним</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.surname}</div>
                </div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Дата рождения</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.birthdate}</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Telegram</div>
                  <div className='text-xl md:text-2xl font-bold hover:text-blue-500 cursor-pointer' onClick={() => {
                    location.replace("https://t.me/" + userData?.tg)
                  }}>@{userData?.tg}</div>
                </div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>ID</div>
                  <div className='text-xl md:text-2xl font-bold uppercase'>{userData?.passid}</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Выдан кем</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.issuedby}</div>
                </div>
              </div>
              <div className='grid grid-cols-2'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Дата выдачи</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.dateofissue}</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Действителен до</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.validuntil}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : null
      }
      {(passport.authData?.id != userData?.id && !passport.authData?.roles?.includes(1)) && loaded ?
        <div className="flex flex-col gap-4 w-full">
          <div className="w-full wrapper">
            <div className={"rounded-2xl " + (userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" ? " border-passport2021" : "")} ></div>
            <div className={'w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl' + (userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" ? " main-element" : "")}>
              <div className='flex justify-between items-center mb-4 select-none flex-col md:flex-row'>
                <div className='text-3xl font-bold flex items-center gap-2'>Общедоступные данные</div>
              </div>
              <div className='grid grid-cols-2 mb-4'>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Никнейм</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.nickname}</div>
                </div>
                <div className='flex flex-col gap-0.5'>
                  <div className='text-lg text-zinc-400'>Псевдоним</div>
                  <div className='text-xl md:text-2xl font-bold'>{userData?.surname}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        : null}
    </>
  )
}