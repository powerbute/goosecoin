import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import { IoMdSearch, IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout, MdOutlineAdminPanelSettings } from "react-icons/md";
import useLocalStorage from "use-local-storage";

export default function Passport({ passport }: { passport: { authData: any, setUser: any } }) {
  const supabase = createClientComponentClient();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [session, setSession] = useLocalStorage("session", "");
  const [authData, setAuthData] = useLocalStorage<any>("authdata", {})

  async function getUser(nickname: any) {
    const { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("nickname", nickname)
      .single();
    if (users?.id == null) {
      alert("Пользователь не найден!")
      return;
    }
    window.open("/user/" + users?.id, "_self")

  }

  return (
    <>
      {searchOpen ? <div className='flex sm:hidden mb-2 mx-4 items-center border border-dark3 rounded-md select-none px-2 sm:w-96'>
        <IoMdSearch size={20} className='text-gray-600' />
        <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onKeyDown={passport.setUser} />
      </div> : null}
      <header className='px-4 flex h-[56px] items-center justify-between'>
        <a className='hidden lg:flex items-end translation-transform hover:scale-105 text-lg gap-2' href='/'><img src='/logo.png' className='w-14' /> <span className='font-bold bg-yellow-500 rounded-md px-[5px] py-[1px]'>BETA</span></a>
        <div className='hidden sm:flex items-center border border-dark3 rounded-md select-none px-2 sm:w-96'>
          <IoMdSearch size={20} className='text-gray-600' />
          <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onKeyDown={passport.setUser} />
        </div>
        <div className='flex gap-4 justify-center w-full sm:w-fit sm:justify-start items-center select-none'>
          {(passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2) || passport.authData?.roles?.includes(6)) ? <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => window.open("/admin", "_self")}><MdOutlineAdminPanelSettings color='black' size={28} /></div> : null}
          <div className='block sm:hidden bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => setSearchOpen(!searchOpen)}><IoMdSearch color='black' size={28} /></div>
          <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => window.open("/settings", "_self")}><IoSettingsOutline color='black' size={28} /></div>
          <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoMdNotificationsOutline color='black' size={28} /></div>
          <div className='bg-red-500 hover:bg-red-600 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => {
            setSession("");
            setAuthData({})
            alert("Выход успешно выполнен!")
            window.open("/", "_self")
          }}><MdLogout color='white' size={28} /></div>
          {session != "" ? <div className='w-14 h-14 cursor-pointer' onClick={() => {
            getUser(passport.authData?.nickname)
          }}>
            <NextImage onError={(e) => {
              e.currentTarget.srcset = "/Steve.webp";
            }} width={56} height={56} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (passport.authData?.nickname)} />
          </div> : null}
        </div>
      </header>
    </>
  )
}