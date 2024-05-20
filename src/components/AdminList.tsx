import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { IoMdSearch, IoMdNotificationsOutline } from "react-icons/io";
import { IoSettingsOutline } from "react-icons/io5";
import { MdLogout, MdOutlineAdminPanelSettings } from "react-icons/md";
import useLocalStorage from "use-local-storage";

export default function Passport({ passport }: { passport: { authData: any, menu: any, setMenu: any, setUserData: any, setCurrentID: any, setUserByPassID: any } }) {
  const supabase = createClientComponentClient();
  const [session, setSession] = useLocalStorage("session", "");
  const [authData, setAuthData] = useLocalStorage<any>("authdata", {})
  const [users, setUsers] = React.useState<any>([]);
  const [pauseUsers, setPauseUsers] = React.useState<any>([]);
  const [kickUsers, setKickUsers] = React.useState<any>([]);
  const [banUsers, setBanUsers] = React.useState<any>([]);
  const [turUsers, setTurUsers] = React.useState<any>([]);
  const [activeUsers, setActiveUsers] = React.useState<any>([]);
  const [requestUsers, setRequestUsers] = React.useState<any>([]);
  const [onlyActive, setOnlyActive] = React.useState(true);
  const [onlyRequest, setOnlyRequest] = React.useState(false);
  const [onlyBan, setOnlyBan] = React.useState(false);
  const [onlyKick, setOnlyKick] = React.useState(false);
  const [onlyTur, setOnlyTur] = React.useState(false);
  const [onlyPause, setOnlyPause] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);

  async function getUserByPassID() {
    const { data: users1 } = await supabase
      .from('users')
      .select('*')
      .order('nickname', { ascending: true })

    setUsers(users1);
    const { data: users2 } = await supabase
      .from('users')
      .select('*')
      .eq('status', 1)
      .order('nickname', { ascending: true })

    setActiveUsers(users2);

    const { data: users3 } = await supabase
      .from('users')
      .select('*')
      .eq('status', 0)
      .order('nickname', { ascending: true })

    setRequestUsers(users3);

    const { data: users4 } = await supabase
      .from('users')
      .select('*')
      .eq('status', 5)
      .order('nickname', { ascending: true })

    setBanUsers(users4);

    const { data: users5 } = await supabase
      .from('users')
      .select('*')
      .eq('status', 3)
      .order('nickname', { ascending: true })

    setKickUsers(users5);

    const { data: users6 } = await supabase
      .from('users')
      .select('*')
      .eq('status', 4)
      .order('nickname', { ascending: true })

    setTurUsers(users6);

    const { data: users7 } = await supabase
      .from('users')
      .select('*')
      .eq('status', 2)
      .order('nickname', { ascending: true })

    setPauseUsers(users7);
  }

  useEffect(() => {
    if (!loaded) {
      getUserByPassID();
      setLoaded(true);
    }
  }, [])

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

  function makeid2(length: any) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
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
      {loaded ?
        <>
          {passport.menu ?
            <div className='block md:hidden bg-dark2 rounded-2xl md:w-1/3 px-4 py-6 select-none'>
              <div className='flex flex-col gap-2'>
                <div className='text-3xl font-bold'>Граждане</div>
                <div className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                  passport.setMenu(false);
                  passport.setUserData({})
                }}>
                  <div className='rounded-2xl w-12 h-12 bg-zinc-400'></div>
                  <div className='text-xl font-bold'>Добавить</div>
                </div>
                {users?.map((e: any) =>
                  <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                    passport.setCurrentID(e?.id)
                    passport.setUserByPassID(e?.passid)
                    passport.setMenu(false);
                  }}>
                    <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                      e.currentTarget.srcset = "/Steve.webp";
                    }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                    <div className='text-xl font-bold'>{e?.nickname}</div>
                  </div>
                )}
              </div>
            </div>
            : null}
          <div className='hidden md:block md:w-1/3 select-none'>
            <div className='bg-dark2 rounded-2xl rounded-b-none w-full px-4 pt-6 pb-2'>
              <div>Отображать только:</div>
              <div className='flex gap-2 items-center'>
                <div className={'w-4 h-4 min-h-4 min-w-4 rounded-2xl cursor-pointer ' + (onlyActive ? " bg-green-500" : " bg-white")} onClick={() => {
                  setOnlyActive(!onlyActive)
                }}></div>
                <div className='w-[70%]'>Активное гражданство</div>
              </div>
              <div className='flex gap-2 items-center'>
                <div className={'w-4 h-4 min-h-4 min-w-4 rounded-2xl cursor-pointer ' + (onlyRequest ? " bg-green-500" : " bg-white")} onClick={() => {
                  setOnlyRequest(!onlyRequest);
                }}></div>
                <div className='w-[70%]'>Заявка на гражданство</div>
              </div>
              <div className='flex gap-2 items-center'>
                <div className={'w-4 h-4 min-h-4 min-w-4 rounded-2xl cursor-pointer ' + (onlyPause ? " bg-green-500" : " bg-white")} onClick={() => {
                  setOnlyPause(!onlyPause);
                }}></div>
                <div className='w-[70%]'>Приостановленное гражданство</div>
              </div>
              <div className='flex gap-2 items-center'>
                <div className={'w-4 h-4 min-h-4 min-w-4 rounded-2xl cursor-pointer ' + (onlyKick ? " bg-green-500" : " bg-white")} onClick={() => {
                  setOnlyKick(!onlyKick);
                }}></div>
                <div className='w-[70%]'>Изъято гражданство</div>
              </div>
              <div className='flex gap-2 items-center'>
                <div className={'w-4 h-4 min-h-4 min-w-4 rounded-2xl cursor-pointer ' + (onlyTur ? " bg-green-500" : " bg-white")} onClick={() => {
                  setOnlyTur(!onlyTur);
                }}></div>
                <div className='w-[70%]'>Турвиза</div>
              </div>
              <div className='flex gap-2 items-center'>
                <div className={'w-4 h-4 min-h-4 min-w-4 rounded-2xl cursor-pointer ' + (onlyBan ? " bg-green-500" : " bg-white")} onClick={() => {
                  setOnlyBan(!onlyBan);
                }}></div>
                <div className='w-[70%]'>Запрет на въезд</div>
              </div>
            </div>
            <div className='bg-dark2 rounded-2xl rounded-t-none w-full px-4 pb-6'>
              {onlyActive || onlyRequest || onlyBan || onlyPause || onlyKick || onlyTur ?
                <>
                  {onlyActive || onlyRequest || onlyBan || onlyPause || onlyKick || onlyTur ?
                    <div className='flex flex-col gap-2'>
                      <div className='text-3xl font-bold'>Граждане</div>
                      <div className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                        passport.setUserData({})
                      }}>
                        <div className='rounded-2xl w-12 h-12 bg-zinc-400'></div>
                        <div className='text-xl font-bold'>Добавить</div>
                      </div>
                      {onlyActive ? <>
                        {activeUsers?.map((e: any) =>
                          <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                            passport.setCurrentID(e?.id)
                            passport.setUserByPassID(e?.passid)
                          }}>
                            <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                              e.currentTarget.srcset = "/Steve1.webp";
                            }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                            <div className='text-xl font-bold'>{e?.nickname}</div>
                          </div>
                        )}
                      </> : null}
                      {onlyRequest ? <>
                        <div className="border-b border-dark3"></div>
                        {requestUsers?.map((e: any) =>
                          <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                            passport.setCurrentID(e?.id)
                            passport.setUserByPassID(e?.passid)
                          }}>
                            <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                              e.currentTarget.srcset = "/Steve1.webp";
                            }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                            <div className='text-xl font-bold'>{e?.nickname}</div>
                          </div>
                        )}</> : null}
                      {onlyPause ? <>
                        <div className="border-b border-dark3"></div>
                        {pauseUsers?.map((e: any) =>
                          <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                            passport.setCurrentID(e?.id)
                            passport.setUserByPassID(e?.passid)
                          }}>
                            <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                              e.currentTarget.srcset = "/Steve1.webp";
                            }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                            <div className='text-xl font-bold'>{e?.nickname}</div>
                          </div>
                        )}</> : null}
                      {onlyKick ? <>
                        <div className="border-b border-dark3"></div>
                        {kickUsers?.map((e: any) =>
                          <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                            passport.setCurrentID(e?.id)
                            passport.setUserByPassID(e?.passid)
                          }}>
                            <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                              e.currentTarget.srcset = "/Steve1.webp";
                            }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                            <div className='text-xl font-bold'>{e?.nickname}</div>
                          </div>
                        )}</> : null}
                      {onlyBan ? <>
                        <div className="border-b border-dark3"></div>
                        {banUsers?.map((e: any) =>
                          <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                            passport.setCurrentID(e?.id)
                            passport.setUserByPassID(e?.passid)
                          }}>
                            <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                              e.currentTarget.srcset = "/Steve1.webp";
                            }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                            <div className='text-xl font-bold'>{e?.nickname}</div>
                          </div>
                        )}</> : null}
                      {onlyTur ? <>
                        <div className="border-b border-dark3"></div>
                        {turUsers?.map((e: any) =>
                          <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                            passport.setCurrentID(e?.id)
                            passport.setUserByPassID(e?.passid)
                          }}>
                            <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                              e.currentTarget.srcset = "/Steve1.webp";
                            }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                            <div className='text-xl font-bold'>{e?.nickname}</div>
                          </div>
                        )}</> : null}
                    </div> : null}
                </> :
                <div className='flex flex-col gap-2'>
                  <div className='text-3xl font-bold'>Граждане</div>
                  <div className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                    passport.setUserData({})
                  }}>
                    <div className='rounded-2xl w-12 h-12 bg-zinc-400'></div>
                    <div className='text-xl font-bold'>Добавить</div>
                  </div>
                </div>
              }
            </div>
          </div>
        </> :
        <>
          <div className='hidden md:block md:w-1/3 select-none'>
            <div className='bg-dark2 rounded-2xl rounded-b-none w-full px-4 pt-6 pb-2'>
              <div className='flex flex-col gap-1'>
                <div className='text-3xl font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Статистика</div>
                <div className='text-xl text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Всего: 666</div>
                <div className='text-xl text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Активных: 666</div>
                <div className='flex gap-2 items-center'>
                  <div className={'w-4 h-4 min-h-4 min-w-4 rounded-2xl bg-dark4 animate-pulse rounded-2xl'}></div>
                  <div className='w-[70%] text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Не показывать людей с приостановленным гражданством</div>
                </div>
              </div>
            </div>
            <div className='bg-dark2 rounded-2xl rounded-t-none w-full px-4 pb-6'>
              <div className='flex flex-col gap-2'>
                <div className='text-3xl font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Граждане</div>
                <div className='flex gap-2 items-center rounded-2xl cursor-pointer text-transparent bg-dark3 animate-pulse rounded-2xl'>
                  <div className='w-12 h-12 text-transparent bg-dark4 animate-pulse rounded-2xl'></div>
                  <div className='text-xl font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Никнейм</div>
                </div>
                <div className='flex gap-2 items-center rounded-2xl cursor-pointer text-transparent bg-dark3 animate-pulse rounded-2xl'>
                  <div className='w-12 h-12 text-transparent bg-dark4 animate-pulse rounded-2xl'></div>
                  <div className='text-xl font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Никнейм</div>
                </div>
                <div className='flex gap-2 items-center rounded-2xl cursor-pointer text-transparent bg-dark3 animate-pulse rounded-2xl'>
                  <div className='w-12 h-12 text-transparent bg-dark4 animate-pulse rounded-2xl'></div>
                  <div className='text-xl font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Никнейм</div>
                </div>
                <div className='flex gap-2 items-center rounded-2xl cursor-pointer text-transparent bg-dark3 animate-pulse rounded-2xl'>
                  <div className='w-12 h-12 text-transparent bg-dark4 animate-pulse rounded-2xl'></div>
                  <div className='text-xl font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Никнейм</div>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  )
}