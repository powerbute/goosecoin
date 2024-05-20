import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useEffect } from "react";
import { useState } from "react"
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";
import { MdOutlinePolicy, MdOutlinePlayCircle, MdOutlinePauseCircle } from "react-icons/md";

export default function Passport() {
  const supabase = createClientComponentClient();
  return (
    <>
      <div className="w-full wrapper">
        <div className={"rounded-2xl border-passport2021"}></div>
        <div className={'w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 shadow-inner shadow-dark3 bg-dark2 rounded-2xl main-element'}>
          <div className='flex justify-between items-center mb-4 select-none flex-col md:flex-row'>
            <div className='text-3xl font-bold flex items-center gap-2'>Паспортные данные <span className='rounded-md bg-green-500 text-base px-1 h-fit'>Активно</span></div>
          </div>
          <div className='grid grid-cols-2 mb-4'>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>Никнейм</div>
              <div className='text-xl md:text-2xl font-bold'>Miyaki_XD</div>
            </div>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>Псевдоним</div>
              <div className='text-xl md:text-2xl font-bold'>Мияки</div>
            </div>
          </div>
          <div className='grid grid-cols-2 mb-4'>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>Дата рождения</div>
              <div className='text-xl md:text-2xl font-bold'>17.11.2001</div>
            </div>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>Telegram</div>
              <div className='text-xl md:text-2xl font-bold hover:text-blue-500 cursor-pointer'>@miyaki_xd</div>
            </div>
          </div>
          <div className='grid grid-cols-2 mb-4'>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>ID</div>
              <div className='text-xl md:text-2xl font-bold uppercase'>LGS-U93K1R</div>
            </div>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>Выдан кем</div>
              <div className='text-xl md:text-2xl font-bold'>Правительство Авинесии</div>
            </div>
          </div>
          <div className='grid grid-cols-2'>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>Дата выдачи</div>
              <div className='text-xl md:text-2xl font-bold'>25.05.2021</div>
            </div>
            <div className='flex flex-col gap-0.5'>
              <div className='text-lg text-zinc-400'>Действителен до</div>
              <div className='text-xl md:text-2xl font-bold'>10.06.2027</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}