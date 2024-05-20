import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useState } from "react";
import { CiHeart } from "react-icons/ci";
import { FaVoteYea } from "react-icons/fa";
import { FaHashtag } from "react-icons/fa6";

export default function Vote({ polldata }: { polldata: { data: any } }) {
  const [loaded, setLoaded] = React.useState(false);
  const [votes, setVotes] = React.useState<any>([]);
  const supabase = createClientComponentClient();

  React.useEffect(() => {
    if (!loaded) {
      loadVotes();
      setLoaded(true);
    }
  });

  async function loadVotes() {
    const { data: data1 } = await supabase
      .from('votes')
      .select('*')
      .eq("pollid", polldata.data?.id);
    if (data1 != null) {
      setVotes(data1);
    }
  }

  return (
    <div className='flex flex-col bg-dark2 rounded-2xl'>
      {polldata.data?.important && <div className="bg-red-500 rounded-t-2xl px-4 py-2 font-bold text-center text-2xl">ВАЖНО</div>}
      <div className="flex flex-col px-4 md:px-8 py-4 md:py-6">
        <div className='text-xl font-bold mb-2'>{polldata.data?.name}</div>
        <div className="flex flex-wrap gap-1 mb-2 select-none">
          {polldata.data?.tags?.includes(0) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-red-600'>
              <div className='bg-red-800 p-1 rounded-md'><FaHashtag /></div>
              <div>Важное</div>
            </div>}
          {polldata.data?.tags?.includes(1) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-purple-500'>
              <div className='bg-purple-700 p-1 rounded-md'><FaHashtag /></div>
              <div>Выборы</div>
            </div>
          }
          {polldata.data?.tags?.includes(2) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-indigo-500'>
              <div className='bg-indigo-700 p-1 rounded-md'><FaHashtag /></div>
              <div>Собрания</div>
            </div>
          }
          {polldata.data?.tags?.includes(3) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-dark5'>
              <div className='bg-dark3 p-1 rounded-md'><FaHashtag /></div>
              <div>Опросы</div>
            </div>
          }
          {polldata.data?.tags?.includes(4) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-dark5'>
              <div className='bg-dark3 p-1 rounded-md'><FaHashtag /></div>
              <div>Народное мнение</div>
            </div>
          }
          {polldata.data?.tags?.includes(5) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-dark5'>
              <div className='bg-dark3 p-1 rounded-md'><FaHashtag /></div>
              <div>Рейтинги</div>
            </div>
          }
          {polldata.data?.tags?.includes(6) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-dark5'>
              <div className='bg-dark3 p-1 rounded-md'><FaHashtag /></div>
              <div>Метро</div>
            </div>
          }
          {polldata.data?.tags?.includes(7) &&
            <div className='flex items-center gap-1 rounded-2xl py-1 px-2 bg-dark5'>
              <div className='bg-dark3 p-1 rounded-md'><FaHashtag /></div>
              <div>Петиции</div>
            </div>
          }
        </div>
        <div className='text-lg mb-1'>{polldata.data?.desc}</div>
        <div className="flex flex-col gap-1 mb-4 text-lg">
          <div className="flex gap-2 items-center">
            {polldata.data?.author == "Авинесия Медиа" && <div className="w-4 h-4 bg-red-500 rounded-2xl"></div>}
            {polldata.data?.author == "Правительство Авинесии" && <div className="w-4 h-4 bg-red-800 rounded-2xl"></div>}
            {polldata.data?.author == "Народная коалиция" && <div className="w-4 h-4 bg-purple-500 rounded-2xl"></div>}
            {polldata.data?.author != "Авинесия Медиа" && polldata.data?.author != "Правительство Авинесии" && polldata.data?.author != "Народная коалиция" &&
              <div className="">
                <NextImage inAdmin={true} onError={(e: any) => {
                  e.currentTarget.srcset = "/Steve1.webp";
                }} width={32} height={32} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (polldata.data?.author)} />
              </div>}
            <div>{polldata.data?.author}</div>
          </div>
        </div>
        <div className='flex justify-between items-center'>
          <div onClick={() => {
            window.open("/vote/" + polldata.data?.id, "_self")
          }} className='p-2 rounded-2xl select-none bg-blue-500 hover:bg-blue-600 cursor-pointer'>{polldata.data?.status == 2 ? "Посмотреть результаты" : "Проголосовать"}</div>
          <div className='flex items-center gap-2 text-lg font-bold'><FaVoteYea size={28} /> {!loaded ? "..." : votes.length}</div>
        </div>
      </div>
    </div>
  )
}