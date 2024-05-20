'use client';

import Head from 'next/head';
import * as React from 'react';

import useLocalStorage from "use-local-storage";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NextImage from '@/components/NextImage';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { FaCircleCheck, FaCrown, FaLink, FaStar, FaTicketSimple, FaUser } from 'react-icons/fa6';
import { MdPublic } from 'react-icons/md';
import { AVauthC } from '@/components/SecurityAuth';

export default function HomePage({ params }: { params: { id: string } }) {
  const pollId = params.id;
  const [session, setSession] = useLocalStorage("session", "");
  const [authData, setAuthData] = useLocalStorage<any>("authdata", {});
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = React.useState(false);

  const [vote, setVote] = React.useState<any>(-1);
  const [voteData, setVoteData] = React.useState<any>([]);
  const [pollData, setPollData] = React.useState<any>({ id: 0 });

  const [voteSend, setVoteSend] = React.useState<any>(false);

  React.useEffect(() => {
    if (!loaded) {
      loadAllData();
      setLoaded(true);
    }
  })

  async function loadAllData() {
    const { data: data1 } = await supabase
      .from('polls')
      .select('*')
      .eq("id", pollId)
      .single();
    if (data1 != null) {
      setPollData(data1);
    }
    const { data: data2 } = await supabase
      .from('votes')
      .select('*')
      .eq("pollid", pollId)
      .eq("passid", authData?.passid)
      .single();
    if (data2 != null) {
      setVote(data2?.option);
      setVoteSend(true);
    } else {
      setVote(0);
    }

    if (data1?.status == 2) {
      let voteDataT: any = [];
      for (let a = 0; a < data1?.options?.length; a++) {
        const { data: data3 } = await supabase
          .from('votes')
          .select('pollid, option, options')
          .eq("pollid", pollId)
          .eq('option', a + 1);
        if (data3 != null) {
          voteDataT.push(data3.length);
        } else {
          voteDataT.push(0);
        }
      }
      setVoteData(voteDataT);
      console.log(voteDataT);
    }
  }

  async function voteF(optionP: any) {
    if (!loaded) return;
    const tempAuth = await AVauthC(session);
    if (tempAuth?.deactive) {
      alert("Ваш аккаунт деактивирован, вы не можете выполнить это действие!")
      return;
    };
    const { data: data1 } = await supabase
      .from('polls')
      .select('*')
      .eq("id", pollId)
      .single();
    const { data: data2 } = await supabase
      .from('sessions')
      .select('*')
      .eq("session", session)
      .single();
    const { data: data3 } = await supabase
      .from('users')
      .select('*')
      .eq("passid", data2?.passid)
      .single();
    if (data1?.reg1 == 1) {
      if (data3?.passid.slice(0, 3) != "LGS") {
        alert("Голосование доступно только тем, кто был зарегистрирован в Лигорщине")
        return;
      }
    }
    if (data1?.reg1 == 2) {
      if (data3?.passid.slice(0, 3) != "HST") {
        alert("Голосование доступно только тем, кто был зарегистрирован в Хаустонии")
        return;
      }
    }
    if (data1?.reg2 == 1) {
      if (data3?.residenceregion != "LGS") {
        alert("Голосование доступно только жителям Лигорщины")
        return;
      }
    }
    if (data1?.reg2 == 2) {
      if (data3?.residenceregion != "HST") {
        alert("Голосование доступно только жителям Хаустонии")
        return;
      }
    }
    if (data1?.status == 2) {
      alert("Голосование уже закончилось!")
      return;
    }
    if (data1?.status < 1) {
      alert("Голосование еще не началось!")
      return;
    }
    if (data1?.access?.includes(0)) {
      if (data3?.status != 1) {
        alert("Голосование доступно только для граждан Авинесии")
        return;
      }
    }
    if (data1?.access?.includes(4) || data1?.access?.includes(7)) {
      if (tempAuth.status == null) {
        alert("Голосование доступно только для авторизованных пользователей")
        return;
      }
    }
    if (data1?.access?.includes(5)) {
      if (!data3?.roles?.includes(1) || !data3?.roles?.includes(2)) {
        alert("Голосование доступно только для Правительства")
        return;
      }
    }
    if (data1?.access?.includes(1)) {
      if (!data3?.heromedal) {
        alert("Голосование доступно только для Героев Авинесии")
        return;
      }
    }
    if (data1?.access?.includes(2)) {
      if (!(data3?.dateofissue?.substring(data3?.dateofissue?.length - 4) == "2021")) {
        alert("Голосование доступно только для граждан с 2021г.")
        return;
      }
    }
    if (data1?.access?.includes(3)) {
      if (data3?.status != 4) {
        alert("Голосование доступно только для лиц с турвизой")
        return;
      }
    }
    if (data1?.access?.includes(3)) {
      if (data3?.status != 4) {
        alert("Голосование доступно только для лиц с турвизой")
        return;
      }
    }
    if (data1?.access?.includes(6)) {
      if (data3?.roles?.includes(7)) {
        alert("Голосование доступно только для участников Народной Коалиции")
        return;
      }
    }
    const { error: a1 } = await supabase
      .from('votes')
      .delete()
      .eq('passid', tempAuth?.passid)
      .eq('pollid', pollId)
    const { error } = await supabase
      .from('votes')
      .insert({ pollid: pollId, passid: tempAuth?.passid, option: optionP })
    setVote(optionP);
    setVoteSend(true);
  }

  async function voteF2() {
    if (!loaded) return;
    const tempAuth = await AVauthC(session);
    if (tempAuth?.deactive) {
      alert("Ваш аккаунт деактивирован, вы не можете выполнить это действие!")
      return;
    };
    const { data: data1 } = await supabase
      .from('polls')
      .select('*')
      .eq("id", pollId)
      .single();
    if (data1?.status == 2) {
      alert("Голосование уже закончилось!")
      return;
    }
    if (data1?.status < 1) {
      alert("Голосование еще не началось!")
      return;
    }
    const { error: a1 } = await supabase
      .from('votes')
      .delete()
      .eq('passid', tempAuth?.passid)
      .eq('pollid', pollId)
    setVote(0);
  }

  function renderResult(index: any) {
    if (voteData.length == 0) {
      return 0;
    }
    const sumOfNumbers = voteData.reduce((acc: any, number: any) => acc + number);
    return (voteData[index] / sumOfNumbers) * 100 + "%";
  }

  function renderResult2(index: any) {
    if (voteData.length == 0) {
      return 0;
    }
    const sumOfNumbers = voteData.reduce((acc: any, number: any) => acc + number);
    return (voteData[index] / sumOfNumbers) * 100;
  }

  async function openPoll() {
    if (!loaded) return;
    const tempAuth = await AVauthC(session);
    if (tempAuth?.deactive) {
      alert("Ваш аккаунт деактивирован, вы не можете выполнить это действие!")
      return;
    };
    const { error } = await supabase
      .from('polls')
      .update({ status: 1 })
      .eq('id', pollId)
    loadAllData();
  }

  async function closePoll() {
    if (!loaded) return;
    const tempAuth = await AVauthC(session);
    if (tempAuth?.deactive) {
      alert("Ваш аккаунт деактивирован, вы не можете выполнить это действие!")
      return;
    };
    const { error } = await supabase
      .from('polls')
      .update({ status: 2 })
      .eq('id', pollId)
    loadAllData();
  }



  return (
    <main className='bg-dark'>
      <Head>
        <title>Hi</title>
      </Head>
      {(!loaded) ? <div className='flex justify-center items-center overflow-hidden text-white h-screen text-2xl font-bold'>Загрузка голосования...</div> :
        <section className='overflow-x-hidden bg-dark w-screen md:h-screen flex flex-col gap-4 justify-center text-white items-center'>
          <div className='flex flex-col bg-dark2 rounded-2xl px-6 py-4 md:w-1/3'>
            <div className='flex gap-2 bg-dark4 items-center p-2 rounded-2xl justify-between select-none mb-2'>
              {authData.status != null ?
                <>
                  <div className=''>Вы голосуете от лица <span className='font-bold'>{loaded ? authData?.nickname : "..."}</span></div>
                  <div className='bg-red-500 hover:bg-red-600 px-2 py-1 rounded-2xl cursor-pointer' onClick={() => {
                    setSession("");
                    setAuthData({});
                    alert("Выход успешно выполнен!")
                    window.open("/", "_self")
                  }}>Выйти</div></> :
                <><div className='bg-red-500 px-2 py-1 rounded-2xl'>Вы не авторизованы!</div>
                  <div className='bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded-2xl cursor-pointer' onClick={() => {
                    window.open("https://id.gooseland.cc/authinapp?app=vote.gooseland.cc&vote=" + pollId, "_self")
                  }}>Войти</div></>}
            </div>
            {pollData?.status == 0 && <div className='bg-yellow-500 p-2 rounded-2xl text-center font-bold mb-2'>Голосование еще не началось</div>}
            {pollData?.status == 2 && <div className='bg-red-500 p-2 rounded-2xl text-center font-bold mb-2'>Голосование закончилось</div>}
            {(authData?.roles?.includes(1) || authData?.roles?.includes(2)) && loaded && <div className='flex select-none justify-between gap-2 mb-2'>
              {(pollData?.status == 2 || pollData?.status == 0) && <div onClick={() => { openPoll() }} className='bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-2xl p-2 w-full text-center'>Открыть</div>}
              {pollData?.status == 1 && <div onClick={() => { closePoll() }} className='bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-2xl p-2 w-full text-center'>Закрыть</div>}
            </div>}
            <div className='text-2xl font-bold mb-2'>{pollData?.name}</div>
            <div className='text-lg mb-6'>{pollData?.desc}</div>
            <div className='flex flex-col gap-1 mb-2'>
              {pollData?.type == 1 &&
                <div>· Проголосовать можно только за один вариант</div>}
              {pollData?.type == 3 &&
                <div>· Проголосовать можно только за один вариант</div>}
              {pollData?.type == 2 &&
                <div>· Проголосовать можно за несколько вариантов</div>}
              {pollData?.type == 3 &&
                <div>· Переголосовать нельзя</div>}
              <div>· Результаты будут опубликованы после заверешния голосования</div>
              <div>· Ваш голос не будет опубликован</div>
            </div>
            <div className='flex flex-col gap-1'>
              {pollData?.access?.includes(0) && <div className='flex items-center gap-2'><FaUser />Доступен только для граждан</div>}
              <div className='hidden items-center gap-2'><FaStar className='text-red-500' />Доступен только для героев Авинесии</div>
              <div className='hidden items-center gap-2'><FaStar className='text-yellow-500' />Доступен только для граждан с 2021г.</div>
              <div className='hidden items-center gap-2'><FaTicketSimple className='text-blue-500' />Доступен только для лиц с турвизой</div>
              {pollData?.access?.includes(4) && <div className='flex items-center gap-2'><MdPublic />Доступен для всех</div>}
              {pollData?.access?.includes(5) && <div className='flex items-center gap-2'><FaCrown color='gold' />Доступен только для Правительства</div>}
              <div className='hidden items-center gap-2'><FaCrown color='silver' />Доступен только для Народной коалиции</div>
              <div className='hidden items-center gap-2'><FaLink />Доступен только по ссылке</div>
            </div>
            {(pollData?.reg1 > 0 || pollData?.reg2 > 0) &&
              <div className={'grid grid-cols-1 gap-2 rounded-2xl pt-2 ' + (pollData?.reg2 > 0 ? "md:grid-cols-2" : "")}>
                <div className='bg-dark4 rounded-2xl p-2 flex flex-col gap-2'>
                  <div className='text-sm'>Доступен для тех кто зарегистрирован</div>
                  <div className='text-xl font-bold'>{pollData?.reg1 == 1 && "Лигорщина"}{pollData?.reg1 == 2 && "Хаустония"}</div>
                </div>
                {pollData?.reg2 > 0 &&
                  <div className='bg-dark4 rounded-2xl p-2 flex flex-col gap-2'>
                    <div className='text-sm'>Доступен для тех кто проживает</div>
                    <div className='text-xl font-bold'>{pollData?.reg2 == 1 && "Лигорщина"}{pollData?.reg2 == 2 && "Хаустония"}</div>
                  </div>
                }
              </div>}
            <div className={'grid grid-cols-1 gap-2 rounded-2xl py-2 ' + (pollData?.sent != null ? "md:grid-cols-2" : "")}>
              <div className='grid grid-rows-2 bg-dark4 p-2 rounded-2xl gap-2'>
                <div className='font-bold'>Автор</div>
                <div className='flex gap-2 items-center'>
                  {pollData?.author == "Авинесия Медиа" && <div className="w-4 h-4 bg-red-500 rounded-2xl"></div>}
                  {pollData?.author == "Правительство Авинесии" && <div className="w-4 h-4 bg-red-800 rounded-2xl"></div>}
                  {pollData?.author == "Народная коалиция" && <div className="w-4 h-4 bg-purple-500 rounded-2xl"></div>}
                  {pollData?.author != "Авинесия Медиа" && pollData?.author != "Правительство Авинесии" && pollData?.author != "Народная коалиция" &&
                    <div className="">
                      <NextImage inAdmin={true} onError={(e: any) => {
                        e.currentTarget.srcset = "/Steve1.webp";
                      }} width={32} height={32} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (pollData?.author)} />
                    </div>}
                  <div>{pollData?.author}</div>
                </div>
              </div>
              {pollData?.sent != null &&
                <div className='grid grid-rows-2 bg-dark4 p-2 rounded-2xl gap-2'>
                  <div className='font-bold'>Направлено</div>
                  <div className='flex gap-2 items-center'>
                    {pollData?.sent == "Авинесия Медиа" && <div className="w-4 h-4 bg-red-500 rounded-2xl"></div>}
                    {pollData?.sent == "Правительство Авинесии" && <div className="w-4 h-4 bg-red-800 rounded-2xl"></div>}
                    {pollData?.sent == "Народная коалиция" && <div className="w-4 h-4 bg-purple-500 rounded-2xl"></div>}
                    {pollData?.sent != "Авинесия Медиа" && pollData?.sent != "Правительство Авинесии" && pollData?.sent != "Народная коалиция" &&
                      <div className="">
                        <NextImage inAdmin={true} onError={(e: any) => {
                          e.currentTarget.srcset = "/Steve1.webp";
                        }} width={32} height={32} alt='profile avatar' src={'https://avatar.spworlds.ru/face/512/' + (pollData?.sent)} />
                      </div>}
                    <div>{pollData?.sent}</div>
                  </div>
                </div>
              }
            </div>
          </div>
          {pollData?.status < 2 &&
            <div className='flex flex-col bg-dark2 rounded-2xl w-full md:w-1/3 p-4 gap-2 select-none'>
              {pollData?.id == 0 ?
                <div className='flex justify-center w-full font-bold text-xl'>Загрузка голосов...</div> :
                <>
                  {(pollData?.type == 1 || pollData?.type == 2) && <>
                    {pollData?.options?.map((e: any, index: any) =>
                      <>
                        {
                          vote == (index + 1) ?
                            <div onClick={() => {
                              voteF2();
                            }} className='px-6 py-4 hover:bg-green-600 bg-green-500 cursor-pointer border border-dark4 rounded-2xl w-full flex justify-between items-center'>
                              <div className='text-xl font-semibold'>{e}</div>
                              <div className=''><FaCircleCheck size={24} /></div>
                            </div> : <div onClick={() => {
                              voteF((index + 1));
                            }} className='px-6 py-4 hover:bg-dark4 cursor-pointer border border-dark4 rounded-2xl w-full flex justify-between items-center'>
                              <div className='text-xl font-semibold'>{e}</div>
                            </div>
                        }
                      </>
                    )}
                  </>}
                  {pollData?.type == 3 && <>
                    {voteSend ? <div className='flex flex-col items-center w-full font-bold text-xl'>
                      <div>Вы уже проголосовали!</div>
                      <div>Ваш голос: {pollData?.options[vote - 1]}</div>
                    </div>
                      :
                      <>
                        {pollData?.options?.map((e: any, index: any) =>
                          <>
                            {
                              vote == (index + 1) ?
                                <div onClick={() => {
                                  setVote(-1);
                                }} className='px-6 py-4 hover:bg-green-600 bg-green-500 cursor-pointer border border-dark4 rounded-2xl w-full flex justify-between items-center'>
                                  <div className='text-xl font-semibold'>{e}</div>
                                  <div className=''><FaCircleCheck size={24} /></div>
                                </div> : <div onClick={() => {
                                  setVote(index + 1);
                                }} className='px-6 py-4 hover:bg-dark4 cursor-pointer border border-dark4 rounded-2xl w-full flex justify-between items-center'>
                                  <div className='text-xl font-semibold'>{e}</div>
                                </div>
                            }
                          </>
                        )}
                        <div onClick={() => {
                          if (vote == -1) {
                            alert("Выберите один из вариантов!")
                            return;
                          }
                          voteF(vote)
                        }} className='bg-blue-500 text-center hover:bg-blue-600 cursor-pointer rounded-2xl select-none p-4'>Проголосовать</div>
                      </>
                    }
                  </>}
                </>}
            </div>
          }
          {pollData?.status == 2 &&
            <div className='flex flex-col bg-dark2 rounded-2xl w-full md:w-1/3 p-4 gap-2 select-none'>
              {pollData?.id == 0 ?
                <div className='flex justify-center w-full font-bold text-xl'>Загрузка голосов...</div> :
                <>
                  {pollData?.options?.map((e: any, index: any) =>
                    <>
                      <div title={"Проголосовало: " + voteData[index]} className='px-6 py-4 bg-green-500 bg-opacity-20 relative border border-dark4 rounded-2xl w-full flex justify-between items-center'>
                        <div className='z-[2] text-xl font-semibold'>{e}</div>
                        {vote == index + 1 ? <div className='z-[2] flex items-center gap-2 text-lg font-bold'><FaCircleCheck size={24} /> {Math.round(renderResult2(index))}%</div> : <div className='z-[2] text-lg font-bold flex justify-center'>{Math.round(renderResult2(index))}%</div>}
                        <div style={{ width: renderResult(index) }} className='absolute left-0 top-0 h-full bg-green-500 rounded-2xl z-[1]'></div>
                      </div>
                    </>
                  )}
                </>}
            </div>
          }
        </section>
      }
    </main >
  );
}