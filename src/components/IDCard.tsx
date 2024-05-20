import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useState } from "react"
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoCloseCircleOutline, IoHeartOutline } from "react-icons/io5";
import { MdOutlinePolicy, MdOutlinePlayCircle, MdOutlinePauseCircle, MdWork, MdOutlineContentCopy } from "react-icons/md";
import { CiHeart } from "react-icons/ci";
import dynamic from 'next/dynamic'
import { FaStar } from "react-icons/fa";
import { FaAnglesDown, FaAnglesUp, FaArrowTurnUp, FaArrowUp, FaBan, FaFire, FaStarOfDavid, FaTicketSimple } from "react-icons/fa6";
import useLocalStorage from "use-local-storage";
import { BiSolidCool } from "react-icons/bi";

const LikeCompoennt = dynamic(() => import('@/components/LikeComponent'), { ssr: false })

export default function Passport({ passport }: { passport: { authData: any, userID: any, subsData: any, updatePage: any } }) {
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState<any>({});
  const [rolesData, setRolesData] = React.useState<any>({});
  const [ratingData, setRatingData] = React.useState<any>([]);
  const currentYear = 2024;

  const [ratingOld, setRatingOld] = useLocalStorage<any>("ratingOld", 0);

  function getColor() {
    if (currentYear - userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) > 20) {
      return "bg-lime-600"
    }
    if (currentYear - userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) > 10) {
      return "bg-indigo-600"
    }
    if (currentYear - userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) > 5) {
      return "bg-amber-500"
    }
    if (currentYear - userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) > 3) {
      return "bg-teal-600"
    }
    if (currentYear - userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) > 1) {
      return "bg-cyan-600"
    }
    return "bg-dark4"
  }

  async function getUser(id: any) {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq("id", id)
      .single();
    setUserData(user);
    const { data: rating } = await supabase
      .from('rating')
      .select('*')
      .eq("passid", user?.passid)
      .order('created_at', { ascending: false })
    setRatingData(rating);
    if (rating != null && ratingOld == 0) {
      setRatingOld(rating[0]);
    }
  }

  async function getRolesData() {
    const { data: roles, error } = await supabase
      .from('roles')
      .select('*');
    setRolesData(roles);
  }

  useEffect(() => {
    if (loaded) return;
    getUser(passport.userID);
    getRolesData();
    if (userData?.id != null && rolesData?.length > 0) {
      setLoaded(true);
    }
  })

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

  function checkSub() {
    if (passport.subsData?.includes(userData?.passid)) {
      return true;
    }
    return false;
  }

  async function sub() {
    if (userData?.passid == "LGS-P7nX10" || userData?.passid == "LGS-49fb3e") {
      alert("Нет прав")
      return;
    }
    let { data: users1 } = await supabase
      .from('subs')
      .select()
      .eq('passid1', passport.authData?.passid);
    if (users1 != null) {
      for (let g1 = 0; g1 < users1?.length; g1++) {
        if (users1[g1]?.passid2 == userData?.passid) {
          let { data: users2 } = await supabase
            .from('subs')
            .delete()
            .eq('id', users1[g1]?.id);
          alert("Подписка отменена!")
          getUser(passport.userID);
          passport.updatePage();
          return;
        }
      }
      let { data: users } = await supabase
        .from('subs')
        .insert({ passid1: passport.authData?.passid, passid2: userData?.passid })
      alert("Подписка оформлена!")
      getUser(passport.userID);
      passport.updatePage();
    }

  }

  return (
    <>
      {!loaded ?
        <div className={'bg-dark2 h-fit rounded-2xl px-4 py-6 w-fit'}>
          <div className={'flex flex-col gap-2'}>
            <div className="flex justify-between flex-col md:flex-row">
              <div className='flex gap-2 md:gap-0 md:flex-col'>
                <div className={"relative w-fit rounded-2xl bg-dark4"}>
                  <div className="bg-dark2 animate-pulse w-[128px] h-[128px]"></div>
                </div>
                <div className='flex flex-col mt-2 gap-1'>
                  <div className='font-bold text-3xl text-transparent animate-pulse bg-dark4 rounded-2xl w-fit'>Displayname</div>
                  <div className='font-medium text-transparent animate-pulse bg-dark4 rounded-2xl text-xl w-fit'>Nickname</div>
                  <div className='text-transparent animate-pulse bg-dark4 rounded-2xl w-fit'>@userID</div>
                </div>
              </div>
              <div className="mt-1.5 md:mt-0 flex w-full gap-2 flex-col">
                <div className="flex justify-end w-full gap-2">
                  <div className={"flex select-none w-fit justify-center relative items-center pt-[1px] h-10 px-2 rounded-2xl bg-dark4 animate-pulse text-transparent"}>
                    <CiHeart size={32} className="relative text-dark3 cursor-pointer" />
                    <div>1</div>
                  </div>
                  <div className="flex md:hidden select-none bg-dark4 animate-pulse text-transparent p-2 rounded-2xl md:mt-4 flex justify-center text-lg font-bold w-full">Подписаться</div>
                </div>
              </div>
            </div>
            <div className='flex flex-wrap gap-1 select-none'>

              <div className={'rounded-md px-2 py-0.5 bg-dark3 animate-pulse text-transparent'}>Example role</div>
              <div className={'rounded-md px-2 py-0.5 bg-dark3 animate-pulse text-transparent'}>Example role</div>
              <div className={'rounded-md px-2 py-0.5 bg-dark3 animate-pulse text-transparent'}>Example role</div>
            </div>
            <div className="hidden md:flex select-none bg-dark4 animate-pulse text-transparent p-2 rounded-2xl md:mt-4 flex justify-center text-lg font-bold">Подписан</div>
          </div>
        </div>
        :
        <div className={'bg-dark5 h-fit rounded-2xl' + (userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" ? "" : "")}>
          <div className={'flex flex-col gap-2' + (userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" ? "" : "")}>

            {ratingOld?.id != ratingData[0]?.id && ratingData[0]?.new > ratingOld.new && passport.userID == passport.authData?.id && userData?.status != 5 ?
              <div onClick={(e) => {
                setRatingOld(ratingData[0])
              }} className="flex px-4 py-2 items-center justify-center gap-1 relative overflow-hidden rounded-t-2xl bg-green-500 hover:bg-green-600 cursor-pointer" title="Нажмите, чтобы скрыть">
                <div className="hidden scale-x-[-1]"><FaArrowTurnUp size={24} /></div>
                <div className="font-bold">Соц. рейтинг увеличился</div>
                <div className="hidden"><FaArrowTurnUp size={24} /></div>
                <div className="flex absolute">
                  <div className="grid grid-cols-4 opacity-40 text-green-200 w-32 rotate-45">
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                  </div>
                  <div className="grid grid-cols-4 opacity-40 text-green-200 w-32 rotate-45">
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                  </div>
                  <div className="grid grid-cols-4 opacity-40 text-green-200 w-32 rotate-45">
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                    <div className=""><FaAnglesUp size={24} /></div>
                  </div>
                </div>
                <div className="absolute top-[-16px] left-[-20px] cursor-pointer hover:bg-dark4 p-0.5 rounded-md" title="Отметить как прочитано"><IoCloseCircleOutline size={18} /></div>
              </div> : null
            }

            {ratingOld?.id != ratingData[0]?.id && ratingData[0]?.new < ratingOld.new && passport.userID == passport.authData?.id && userData?.status != 5 ?
              <div onClick={() => {
                setRatingOld(ratingData[0])
              }} className="flex px-4 py-2 items-center justify-center gap-1 relative overflow-hidden rounded-t-2xl bg-red-500 hover:bg-red-600 cursor-pointer" title="Нажмите, чтобы скрыть">
                <div className="hidden scale-x-[-1]"><FaArrowTurnUp size={24} /></div>
                <div className="font-bold">Соц. рейтинг уменьшился</div>
                <div className="hidden"><FaArrowTurnUp size={24} /></div>
                <div className="flex absolute">
                  <div className="grid grid-cols-4 opacity-40 text-red-200 w-32 rotate-45">
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                  </div>
                  <div className="grid grid-cols-4 opacity-40 text-red-200 w-32 rotate-45">
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                  </div>
                  <div className="grid grid-cols-4 opacity-40 text-red-200 w-32 rotate-45">
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                    <div className=""><FaAnglesDown size={24} /></div>
                  </div>
                </div>
                <div className="absolute top-[-16px] left-[-20px] cursor-pointer hover:bg-dark4 p-0.5 rounded-md" title="Отметить как прочитано"><IoCloseCircleOutline size={18} /></div>
              </div> : null
            }

            {userData?.status == 5 ?
              <div className="flex px-4 py-2 items-center justify-center gap-1 relative overflow-hidden rounded-t-2xl bg-red-500">
                <div className="font-bold">Въезд запрещен</div>
                <div className="hidden absolute">
                  <div className="grid grid-cols-4 opacity-40 text-red-200 w-32">
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                  </div>
                  <div className="grid grid-cols-4 opacity-40 text-red-200 w-32">
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                  </div>
                  <div className="grid grid-cols-4 opacity-40 text-red-200 w-32">
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                    <div className=""><FaBan size={24} /></div>
                  </div>
                </div>
                <div className="absolute top-[-16px] left-[-20px] cursor-pointer hover:bg-dark4 p-0.5 rounded-md" title="Отметить как прочитано"><IoCloseCircleOutline size={18} /></div>
              </div> : null
            }

            <div className={"flex justify-between flex-row px-4 " + (userData?.status != 5 || ratingData[0]?.new == ratingOld.new || passport.userID != passport.authData?.id ? "pt-6" : "pt-2")}>
              <div className={"relative w-fit rounded-2xl " + getColor()}>
                <NextImage onError={(e) => {
                  e.currentTarget.srcset = "/Steve.webp";
                }} width={128} height={128} alt='profile avatar' src={'https://avatar.spworlds.ru/bust/512/' + (userData?.nickname)} />
              </div>
              <div className="flex flex-col justify-between items-end">
                <LikeCompoennt passport={{ authData: passport.authData, userData: userData }} />
                <div className="flex gap-2 bg-dark2 rounded-2xl py-1 px-2">
                  {userData?.nickname == "Ligor4ik" ?
                    <div className="" title="Точно не еврей"><FaStarOfDavid className="text-red-500" /></div> : null}
                  {userData?.heromedal ?
                    <div className="" title="Герой Авинесии"><FaStar className="text-red-500" /></div> : null}
                  {userData?.activemedal ?
                    <div className="" title="Активный гражданин"><FaFire className="text-orange-500" /></div> : null}
                  {userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" && userData?.status == 1 ?
                    <div className="" title="Гражданин с 2021г."><FaStar className="text-yellow-500" /></div> : null}
                  {userData?.status == 4 ?
                    <div className="" title="Туристическая виза"><FaTicketSimple className="text-blue-500" /></div> : null}
                  {userData?.status == 0 ?
                    <div className="" title="Рассмотрение заявки на гражданство"><FaTicketSimple className="text-yellow-500" /></div> : null}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 bg-dark2 px-4 pt-2 pb-6 mt-2 rounded-b-2xl">
              <div className='flex flex-col'>
                <div className='font-bold text-2xl'>{userData?.surname}</div>
                <div className='font-medium text-zinc-400'>{userData?.nickname}</div>
                <div className='text-zinc-500 flex gap-2 items-center text-sm'>@user{passport.userID} <span className="cursor-pointer" onClick={() => {
                  navigator.clipboard.writeText("https://id.gooseland.cc/user/" + passport.userID);
                  alert("Ссылка скопирована!")
                }}><MdOutlineContentCopy /></span></div>
                <div className='flex flex-wrap gap-1 select-none mt-2'>
                  {userData?.roles?.map((e: any) =>
                    <div key={makeid(5)} className={'rounded-md text-sm px-2 py-0.5 bg-' + (rolesData[e - 1]?.color)}>{rolesData[e - 1]?.name}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      }

    </>
  )
}