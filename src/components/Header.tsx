import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect, useState } from "react";
import { IoMdSearch, IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout, MdOutlineAdminPanelSettings } from "react-icons/md";
import useLocalStorage from "use-local-storage";

export default function Passport({ passport }: { passport: { authData: any, userID: any } }) {
  const supabase = createClientComponentClient();
  const [searchOpen, setSearchOpen] = React.useState(false);
  const [searchOpen2, setSearchOpen2] = React.useState(false);
  const [searchData1, setSearchData1] = React.useState<any>([]);
  const [loaded, setLoaded] = React.useState(false);
  const [session, setSession] = useLocalStorage("session", "");
  //const [authData, setAuthData] = useLocalStorage<any>("authdata", {})

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

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
    }
  })


  async function handleSearch(event: any) {
    if (!loaded) return;
    if (event.key === 'Enter') {
      getUser(event.target.value)
    }
  }

  async function handleSearch3(event: any) {
    if (!loaded) return;
    const array = [];
    if (event.target.value == "") {
      setSearchData1([]);
      return;
    };
    const { data: a1 } = await supabase
      .from('users')
      .select('*')
      .ilike('surname', '%' + event.target.value + '%');
    if (a1 != null) {
      for (let g1 = 0; g1 < a1.length; g1++) {
        const newArray = {
          id: a1[g1]?.id,
          nickname: a1[g1]?.nickname,
          surname: a1[g1]?.surname
        };
        array.push(newArray);
      }
    }
    const { data: a2 } = await supabase
      .from('users')
      .select('*')
      .ilike('nickname', '%' + event.target.value + '%');
    if (a2 != null) {
      for (let g1 = 0; g1 < a2.length; g1++) {
        const newArray = {
          id: a2[g1]?.id,
          nickname: a2[g1]?.nickname,
          surname: a2[g1]?.surname
        };
        if (check1(array, newArray)) {
          array.push(newArray);
        } else {
          console.log(array);
          console.log(a2[g1]?.nickname + " уже есть!")
        }
      }
    }
    setSearchData1(array);
  }

  function check1(array: any, twoarray: any) {
    for (let g2 = 0; g2 < array.length; g2++) {
      if (twoarray?.nickname != array[g2]?.nickname) {
        return true;
      } else {
        return false;
      }
    }
    if (array.length == 0) return true;
    return false;
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
    <>
      {!loaded ?
        <>
          <header className='px-4 flex h-[56px] items-center justify-between'>
            <a className='hidden lg:flex items-end translation-transform hover:scale-105 text-lg gap-2' href='/'><img src='/logo.png' className='w-14' /> <span className='font-bold bg-yellow-500 rounded-md px-[5px] py-[1px]'>BETA</span></a>
            <div className='hidden sm:flex items-center border border-dark3 rounded-md select-none px-2 sm:w-96'>
              <IoMdSearch size={20} className='text-gray-600' />
              <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onKeyDown={handleSearch} />
            </div>
            <div className='flex gap-4 justify-center w-full sm:w-fit sm:justify-start items-center select-none'>
              <div className='block sm:hidden bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoMdSearch color='black' size={28} /></div>
              <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoSettingsOutline color='black' size={28} /></div>
              <div className='bg-white hover:bg-gray-200 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoMdNotificationsOutline color='black' size={28} /></div>
              <div className='bg-red-500 hover:bg-red-600 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><MdLogout color='white' size={28} /></div>
              <div className="w-14 h-14 bg-dark4 animate-pulse rounded-2xl"></div>
            </div>
          </header>
        </>
        :
        <>
          {searchOpen ? <div className='flex sm:hidden mb-2 mx-4 items-center border border-dark3 rounded-md select-none px-2 sm:w-96'>
            <IoMdSearch size={20} className='text-gray-600' />
            <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onChange={handleSearch3} onFocus={() => {
              setSearchOpen2(true);
            }} />
          </div> : null}
          <header className='px-4 flex h-[56px] items-center justify-between'>
            <a className='hidden lg:flex items-end translation-transform hover:scale-105 text-lg gap-2' href='/'><img src='/logo.png' className='w-14' /> <span className='font-bold bg-yellow-500 rounded-md px-[5px] py-[1px]'>BETA 3H1</span><span className='font-bold bg-gradient-to-br from-rose-600 to-emerald-600 rounded-md px-[5px] py-[1px] hidden'>С днем Авинесии!</span></a>
            <div className="relative h-[38px] w-[384px]">
              <div className="absolute top-0 left-0 flex flex-col justify-center">
                <div className='hidden sm:flex items-center border border-dark3 rounded-md select-none px-2 sm:w-96'>
                  <IoMdSearch size={20} className='text-gray-600' />
                  <input placeholder='Поиск по Авинесии' className='bg-dark border-none focus:ring-transparent py-2 text-sm w-full' onChange={handleSearch3} onFocus={() => {
                    setSearchOpen2(true);
                  }} />
                </div>
                {searchOpen2 && searchData1.length > 0 ?
                  <div className="flex-col relative p-2 bg-dark2 rounded-b-2xl z-[90] max-h-[80vh] overflow-y-scroll w-[90vw] md:w-full">
                    {searchData1?.map((e: any) =>
                      <div key={makeid(50)} className="hover:bg-dark3 cursor-pointer flex justify-between items-center p-2 rounded-2xl" onClick={() => {
                        window.open("/user/" + e?.id, "_self")
                      }}>
                        <div className="flex gap-2 items-center">
                          <NextImage onError={(e) => {
                            e.currentTarget.srcset = "/Steve.webp";
                          }} width={56} height={56} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                          <div>{e?.surname}</div>
                        </div>
                        <div>{e?.nickname}</div>
                      </div>
                    )}
                  </div>
                  : null}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className='flex gap-4 justify-center w-full sm:w-fit sm:justify-start items-center select-none bg-dark2 p-2 rounded-2xl'>
                {(passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2) || passport.authData?.roles?.includes(6)) ? <div className='bg-dark4 hover:bg-dark3 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => window.open("/admin", "_self")}><MdOutlineAdminPanelSettings color='white' size={28} /></div> : null}
                <div className='block sm:hidden bg-dark4 hover:bg-dark3 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => setSearchOpen(!searchOpen)}><IoMdSearch color='white' size={28} /></div>
                <div className='bg-dark4 hover:bg-dark3 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => window.open("/settings", "_self")}><IoSettingsOutline color='white' size={28} /></div>
                <div className='bg-dark4 hover:bg-dark3 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer'><IoMdNotificationsOutline color='white' size={28} /></div>
                <div className='bg-red-500 hover:bg-red-600 rounded-2xl w-10 h-10 flex justify-center items-center cursor-pointer' onClick={() => {
                  setSession("");
                  //setAuthData({})
                  alert("Выход успешно выполнен!")
                  window.open("/", "_self")
                }}><MdLogout color='white' size={28} /></div>
              </div>
              <div className='flex gap-4 justify-center w-full sm:w-fit sm:justify-start items-center select-none'>
                {session != "" ? <div className='w-14 h-14 cursor-pointer' onClick={() => {
                  window.open("/home", "_self")
                }}>
                  <NextImage onError={(e) => {
                    e.currentTarget.srcset = "/Steve.webp";
                  }} width={56} height={56} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (passport.authData?.nickname)} />
                </div> : null}
              </div>
            </div>
          </header>
        </>
      }
    </>
  )
}