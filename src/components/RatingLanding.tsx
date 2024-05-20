import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useState } from "react"
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";
import { MdOutlinePolicy, MdOutlinePlayCircle, MdOutlinePauseCircle } from "react-icons/md";

export default function Passport() {
  const supabase = createClientComponentClient();

  return (
    <>
      <div className={'bg-dark2 shadow-inner shadow-dark3 rounded-2xl md:w-1/3 px-4 py-6 select-none'}>
        <div className='text-3xl font-bold'>Соц. рейтинг</div>
        <div className={'mt-2 text-lg text-start font-bold text-green-500'}>1000</div>
        <div className='flex w-full bg-dark4 rounded-2xl h-2'>
          <div className='flex w-full justify-start'><div className={'h-2 rounded-2xl w-[100%] bg-green-500'}></div></div>
        </div>
      </div>

    </>
  )
}