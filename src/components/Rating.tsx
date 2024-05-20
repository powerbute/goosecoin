import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useState } from "react"
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";
import { FaArrowRightToBracket } from "react-icons/fa6";
import { MdOutlinePolicy, MdOutlinePlayCircle, MdOutlinePauseCircle } from "react-icons/md";

export default function Passport({ passport }: { passport: { authData: any, userID: any, setPage: any, ratingData: any } }) {
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = React.useState(false);
  const [userData, setUserData] = React.useState<any>({});
  const [ratingData, setRatingData] = React.useState<any>({});
  //let rating = (passport.ratingData.length == 0 ? 0 : passport.ratingData[passport.ratingData.length - 1]);

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
    if (rating != null) {
      setRatingData(rating[0]);
    } else {
      setRatingData({ old: 0, new: 0, by: "Admin", realson: "Стартовый социальный рейтинг" })
    }
  }

  useEffect(() => {
    if (loaded) return;
    getUser(passport.userID);
    if (userData?.id != null) {
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

  async function applyRating(rating1: any) {
    if (rating1 > 1000 || rating1 < -1000) {
      alert("Минимальный и максимальный рейтинг: -1000 и 1000!!")
      return;
    }
    const { error: a1 } = await supabase
      .from('users')
      .update({ rating: rating1 })
      .eq('id', userData?.id);
    getUser(passport.userID);
  }

  function renderRating(rating: any) {
    if (rating > 1000) return 100;
    if (rating < -1000) return 100;
    return rating
  }

  return (
    <>
      {!loaded ?
        <div className='bg-dark2 rounded-2xl px-4 py-6 select-none'>
          <div className='text-3xl font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'>Соц. рейтинг</div>
          <div className={'mt-2 text-lg mb-1 text-start font-bold text-transparent bg-dark4 animate-pulse rounded-2xl w-fit'}>1000</div>
          <div className='flex w-full bg-dark4 animate-pulse rounded-2xl h-2'>
          </div>
        </div>
        :
        <div className={'bg-dark2 rounded-2xl px-4 py-6 select-none' + (userData?.dateofissue?.substring(userData?.dateofissue?.length - 4) == "2021" ? "" : "")}>
          <div className='flex justify-between items-center'><div className="text-xl font-bold ">Соц. рейтинг</div><div onClick={() => {
            passport.setPage(2);
          }} className="hover:bg-dark4 cursor-pointer p-2 rounded-md"><FaArrowRightToBracket size={18} /></div></div>
          <div className={'mt-2 text-lg text-start font-bold' + (ratingData?.new > 0 ? " text-green-500" : " text-red-500")}>{ratingData?.new}</div>
          <div className='flex w-full bg-dark4 rounded-2xl h-2'>
            <div className='flex w-full justify-start'><div className={'h-2 rounded-2xl w-[' + (renderRating(Math.abs(ratingData?.new) / 10)) + "%] " + (ratingData?.new > 0 ? "bg-green-500" : "bg-red-500")}></div></div>
          </div>
        </div>
      }

    </>
  )
}