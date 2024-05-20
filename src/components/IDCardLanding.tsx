import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useState } from "react"
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoHeartOutline } from "react-icons/io5";
import { MdOutlinePolicy, MdOutlinePlayCircle, MdOutlinePauseCircle } from "react-icons/md";
import { CiHeart } from "react-icons/ci";

export default function Passport() {
  const supabase = createClientComponentClient();

  return (
    <>
      <div className={'bg-dark2 shadow-inner shadow-dark3 rounded-2xl md:w-1/3 px-4 py-6'}>
        <div className={'flex flex-col gap-2'}>
          <div className="flex justify-between flex-col md:flex-row">
            <div className='flex gap-2 md:gap-0 md:flex-col'>
              <div className="relative w-fit">
                <NextImage onError={(e) => {
                  e.currentTarget.srcset = "/Steve.webp";
                }} width={128} height={128} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/Miyaki_XD'} />
                <span className="absolute bottom-0 right-0 flex justify-center items-center rounded-full h-6 w-6 bg-dark2">
                  <span className="inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                </span>
              </div>
              <div className='flex flex-col mt-2'>
                <div className='font-bold text-3xl'>Мияки</div>
                <div className='font-medium text-zinc-400 text-xl'>Miyaki_XD</div>
                <div className='text-zinc-500'>@user4</div>
              </div>
            </div>
            <div className="mt-1.5 md:mt-0">
              <div className={"flex justify-center bg-white hover:bg-gray-200 cursor-pointer relative items-center pt-[1px] h-10 px-2 rounded-2xl "}>
                <CiHeart size={32} className="relative text-dark3" />
                <div></div>
              </div>
            </div>
          </div>
          <div className='flex flex-wrap gap-1 select-none'>
            <div className={'rounded-md px-2 py-0.5 bg-red-500'}>Администратор</div>
          </div>
        </div>
      </div>

    </>
  )
}