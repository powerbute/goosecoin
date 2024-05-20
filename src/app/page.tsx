'use client';

import Head from 'next/head';
import * as React from 'react';
import dynamic from 'next/dynamic';
import useLocalStorage from 'use-local-storage';
import RealtimeStatus from '../components/RealtimeStatus';
import IDCardLanding from '@/components/IDCardLanding';
import PassportLanding from '@/components/PassportLanding';
import RatingLanding from '@/components/RatingLanding';
import LandingHeader from '@/components/LandingHeader';
import { FaCoins, FaCrown, FaDonate, FaLink, FaQuestion, FaStar, FaUser, FaVoteYea } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Vote from '@/components/Vote';
import { MdAdd, MdCancel, MdPublic } from 'react-icons/md';
import { FaAnglesUp, FaBoltLightning, FaHashtag, FaTicketSimple, FaTrophy } from 'react-icons/fa6';
import SecurityAuth, { AVauthC } from '@/components/SecurityAuth';
import GroshCoin from "../../public/groshcoin.svg";
import { GiGoose } from 'react-icons/gi';
import { IoCloseCircle } from 'react-icons/io5';
import moment from 'moment';

export default function HomePage() {
  //const [authData, setAuthData] = useLocalStorage<any>("authdata", {});
  const [authData, setAuthData] = React.useState<any>();
  const [session, setSession] = useLocalStorage<any>("session", "");
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = React.useState(false);

  async function loadPolls(authData: any) {
    supabase
      .channel('room1')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, payload => {
        update(authData?.id);
      })
      .subscribe()
    update(authData?.id);
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq("deactive", false)
      .order("coins", { ascending: false })
    setUserRating(data);
    setLoaded(true)
  }

  const [isClicked, setIsClicked] = React.useState(false);
  const [subPage, setSubPage] = React.useState(0);
  const [userData, setUserData] = React.useState<any>();
  const [userRating, setUserRating] = React.useState<any>([]);
  const [ratingMesto, setRatingMesto] = React.useState<any>(-1);

  async function click() {
    if (isClicked && userData?.energy >= 0) return;
    //setCoins((prev) => prev + 1);
    const { data: userData1, error: userErr } = await supabase
      .from('users')
      .select()
      .eq("id", authData?.id)
      .single()
    if (userData1?.energy <= 0) return;
    setIsClicked(true);
    addFloatingNumber(userData?.multitaplvl + 1);
    const { error } = await supabase
      .from('users')
      .update({ coins: (Number.parseInt(userData1?.coins) + (userData?.multitaplvl + 1)), energy: (Number.parseInt(userData1?.energy) - 1) })
      .eq("id", authData?.id)
    setEnergy((prev) => prev - 1);
    setTimeout(() => {
      setIsClicked(false);
    }, 10)
  }

  function getMesto() {
    if (userRating == null) return;
    const userR = userRating;
    let r1 = -1;
    userR.forEach((element: any, index: any) => {
      if (element?.id == authData?.id) {
        r1 = index + 1;
      }
    });
    return r1;
  }

  function priceMultitapLVL() {
    if (userData?.multitaplvl == 0) {
      return 2000;
    }
    if (userData?.multitaplvl == 1) {
      return 3000;
    }
    if (userData?.multitaplvl == 2) {
      return 4500;
    }
    if (userData?.multitaplvl == 3) {
      return 6750;
    }
    if (userData?.multitaplvl == 4) {
      return 10125;
    }
    if (userData?.multitaplvl == 5) {
      return 15187;
    }
    if (userData?.multitaplvl == 6) {
      return 22781;
    }
    if (userData?.multitaplvl == 7) {
      return 34171;
    }
    if (userData?.multitaplvl == 8) {
      return 51256;
    }
    if (userData?.multitaplvl == 9) {
      return 76884;
    }
    if (userData?.multitaplvl == 10) {
      return 115326;
    }
    if (userData?.multitaplvl == 11) {
      return 172989;
    }
    if (userData?.multitaplvl == 12) {
      return 259483;
    }
    if (userData?.multitaplvl == 13) {
      return 300000;
    }
    if (userData?.multitaplvl == 14) {
      return 350000;
    }
    return 999999999999;
  }

  function priceRecovLVL() {
    if (userData?.recovlvl == 0) {
      return 2000;
    }
    if (userData?.recovlvl == 1) {
      return 4000;
    }
    if (userData?.recovlvl == 2) {
      return 6000;
    }
    if (userData?.recovlvl == 3) {
      return 10000;
    }
    if (userData?.recovlvl == 4) {
      return 15000;
    }
    if (userData?.recovlvl == 5) {
      return 20000;
    }
    if (userData?.recovlvl == 6) {
      return 30000;
    }
    if (userData?.recovlvl == 7) {
      return 40000;
    }
    if (userData?.recovlvl == 8) {
      return 50000;
    }
    if (userData?.recovlvl == 9) {
      return 100000;
    }
    return 999999999999;
  }

  async function upMultitap() {
    if (userData?.coins > priceMultitapLVL()) {
      //console.log("a")
      const { data: userData1, error: userErr } = await supabase
        .from('users')
        .select()
        .eq("id", authData?.id)
        .single()
      if ((Number.parseInt(userData1?.coins) - priceMultitapLVL()) < 0) return;
      const { error } = await supabase
        .from('users')
        .update({ coins: (Number.parseInt(userData1?.coins) - priceMultitapLVL()), multitaplvl: Number.parseInt(userData1?.multitaplvl) + 1 })
        .eq("id", authData?.id)
      setSubPage(0);
    }
  }

  async function upRecovLVL() {
    if (userData?.coins > priceRecovLVL()) {
      //console.log("a")
      const { data: userData1, error: userErr } = await supabase
        .from('users')
        .select()
        .eq("id", authData?.id)
        .single()
      if ((Number.parseInt(userData1?.coins) - priceRecovLVL()) < 0) return;
      const { error } = await supabase
        .from('users')
        .update({ coins: (Number.parseInt(userData1?.coins) - priceRecovLVL()), recovlvl: Number.parseInt(userData1?.recovlvl) + 1 })
        .eq("id", authData?.id)
      setSubPage(0);
    }
  }

  async function getReward() {
    if (moment(userData.rewardlvl).add(1, 'days').toDate() < new Date() || userData?.rewardlvl == null) {
      const { data: userData1, error: userErr } = await supabase
        .from('users')
        .select()
        .eq("id", authData?.id)
        .single()
      const { error } = await supabase
        .from('users')
        .update({ coins: (Number.parseInt(userData1?.coins) + 2000), rewardlvl: new Date() })
        .eq("id", authData?.id)
    } else {
      alert(moment(userData.rewardlvl).add(1, 'days').fromNow())
    }
  }

  async function update(userID: any) {
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq('id', userID)
      .single()
    setUserData(data);
    const { data: a1 } = await supabase
      .from('users')
      .select()
      .eq('deactive', false)
      .order("coins", { ascending: false })
    setUserRating(a1);
    setRatingMesto(getMesto());
    setLoaded(true);
    //setCoins(data?.coins)
  }

  const [numbers, setNumbers] = React.useState<any>([]);

  const [coins, setCoins] = React.useState(0);
  const [energy, setEnergy] = React.useState(100);
  const [maxEnergy, setMaxEnergy] = React.useState(100);

  const addFloatingNumber = (number: any) => {
    const newNumber = <FloatingNumber number={{ number: number }} key={numbers.length} />;
    setNumbers([...numbers, newNumber]);

    setTimeout(() => {
      setNumbers(numbers.filter((number: any) => number.key !== newNumber.key));
    }, 5000); // Удаление числа через 5 секунд
  };

  function getMaxEnergy() {
    return 1000;
  }

  return (
    <main className='bg-dark h-screen overflow-hidden'>
      {!loaded &&
        <div className='w-screen h-screen bg-dark z-[10] text-white flex flex-col justify-center items-center gap-4 px-8'>
          <div className='animate-pulse'><GiGoose size={256} /></div>
        </div>
      }
      <SecurityAuth authData={{ data: authData, setData: setAuthData, authCallback: loadPolls }} />
      <Head>
        <title>Hi</title>
      </Head>
      <div className='hidden text-white z-[2] bg-gradient-to-b from-dark3 from-70% to-transparent absolute top-0 left-0 w-full h-96'>
      </div>
      {numbers.map((num: any) => num)}
      <section className='z-[3] relative bg-dark flex flex-col justify-between min-w-screen h-full pt-8 pb-4 mx-auto text-white xl:w-[1280px]'>
        <LandingHeader passport={{ authData }} />
        <section className='px-4 mt-16 flex flex-col justify-between h-full'>
          <div className='flex flex-col gap-8 items-center'>
            <div className='flex flex-col gap-3 items-center'>
              <div className='text-5xl font-black'>{new Intl.NumberFormat('en-US').format(userData?.coins)}</div>
              <div className='font-semibold text-lg'>{getMesto()} место</div>
            </div>
            <div onClick={() => click()} className={'flex items-center justify-center p-8 rounded-full ' + (isClicked ? "bg-blue-600 w-[23.5rem] h-[23.5rem]" : "bg-blue-500 w-96 h-96")}>
              <div className={'flex items-center justify-center w-full h-full rounded-full ' + (isClicked ? "bg-blue-500" : "bg-blue-400")}>
                <div className='hidden w-48 pl-2'><GroshCoin /></div>
                <div><GiGoose size={200} /></div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-4'>
            <div className='flex items-center gap-2 text-lg font-bold'><FaBoltLightning color='gold' />{userData?.energy} / {getMaxEnergy()}</div>
            <div className='w-full bg-dark4 p-2 rounded-2xl relative'>
              <div className='h-4 rounded-2xl bg-blue-500 absolute top-0 left-0' style={{ width: (userData?.energy / getMaxEnergy()) * 100 + "%" }}></div>
            </div>
            <div className='rounded-2xl flex w-full gap-2'>
              <div onClick={() => setSubPage(1)} className='bg-dark5 hover:bg-dark4 w-full cursor-pointer p-4 rounded-2xl flex items-center flex-col gap-1'>
                <div><FaAnglesUp size={24} /></div>
                <div className='font-bold'>Улучшения</div>
              </div>
              <div onClick={() => setSubPage(2)} className='bg-dark5 hover:bg-dark4 w-full cursor-pointer p-4 rounded-2xl flex items-center flex-col gap-1'>
                <div><FaTrophy size={24} /></div>
                <div className='font-bold'>Топ</div>
              </div>
              <div onClick={() => setSubPage(3)} className='bg-dark5 hover:bg-dark4 w-full cursor-pointer p-4 rounded-2xl flex items-center flex-col gap-1'>
                <div><FaDonate size={24} /></div>
                <div className='font-bold'>Пожертвования</div>
              </div>
            </div>
          </div>
        </section>
      </section>
      {subPage == 1 &&
        <div className='absolute text-white h-3/4 w-full bottom-0 left-0 p-4 bg-dark2 border-t border-dark3 z-[7] flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-bold'>Улучшения</div>
            <div><IoCloseCircle onClick={() => setSubPage(0)} className='hover:text-gray-300 cursor-pointer' size={24} /></div>
          </div>
          <div className='flex flex-col mt-4 gap-2'>
            <div onClick={() => upMultitap()} className='bg-dark5 flex justify-between hover:bg-dark4 cursor-pointer rounded-2xl p-4 select-none'>
              <div className='flex flex-col'>
                <div className='text-xl font-bold'>Мультитап</div>
                <div className='flex gap-2 text-lg items-center'>
                  <div className='flex gap-1 items-center'>
                    <div>{priceMultitapLVL()}</div>
                    <div className='w-4 h-4 rounded-full bg-blue-500'></div>
                  </div>
                  <div>+1 к клику</div>
                </div>
              </div>
              <div className='flex items-center gap-2 text-3xl font-black'>{userData?.multitaplvl} / 15</div>
            </div>
            <div onClick={() => upRecovLVL()} className='bg-dark5 flex justify-between hover:bg-dark4 cursor-pointer rounded-2xl p-4 select-none'>
              <div className='flex flex-col'>
                <div className='text-xl font-bold'>Восстановление</div>
                <div className='flex gap-2 text-lg items-center'>
                  <div className='flex gap-1 items-center'>
                    <div>{priceRecovLVL()}</div>
                    <div className='w-4 h-4 rounded-full bg-blue-500'></div>
                  </div>
                  <div>+1 в секунду</div>
                </div>
              </div>
              <div className='flex items-center gap-2 text-3xl font-black'>{userData?.recovlvl} / 10</div>
            </div>
            <div onClick={() => getReward()} className='bg-dark5 flex justify-between hover:bg-dark4 cursor-pointer rounded-2xl p-4 select-none'>
              <div className='flex flex-col'>
                <div className='text-xl font-bold'>Ежедневная награда</div>
                <div className='flex gap-2 text-lg items-center'>
                  <div className='flex gap-1 items-center'>
                    <div>+2000</div>
                    <div className='w-4 h-4 rounded-full bg-blue-500'></div>
                  </div>
                </div>
              </div>
              <div className='flex items-center gap-2 text-3xl font-black'></div>
            </div>
          </div>
        </div>
      }
      {subPage == 2 &&
        <div className='absolute text-white h-3/4 w-full bottom-0 left-0 p-4 bg-dark2 border-t border-dark3 z-[7] flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-bold'>Топ</div>
            <div><IoCloseCircle onClick={() => setSubPage(0)} className='hover:text-gray-300 cursor-pointer' size={24} /></div>
          </div>
          <div className='flex flex-col mt-4 gap-2 overflow-y-scroll'>
            {userRating?.map((user: any) =>
              <div key={"userRating" + user?.id} className='flex text-lg justify-between'>
                <div className='font-bold'>{user?.nickname}</div>
                <div className='flex items-center gap-1'>{new Intl.NumberFormat('en-US').format(user?.coins)}</div>
              </div>
            )}
          </div>
        </div>
      }
      {subPage == 3 &&
        <div className='absolute text-white h-3/4 w-full bottom-0 left-0 p-4 bg-dark2 border-t border-dark3 z-[7] flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-bold'>Пожертвования</div>
            <div><IoCloseCircle onClick={() => setSubPage(0)} className='hover:text-gray-300 cursor-pointer' size={24} /></div>
          </div>
          <div className='flex flex-col mt-4 gap-2 overflow-y-scroll'>
            <div className='text-xl font-bold'>Скоро здесь можно будет пожертвовать гуськоины Правительству</div>
          </div>
        </div>
      }
    </main>
  );
}

const FloatingNumber = ({ number }: { number: { number: any } }) => {
  const [x, setX] = React.useState(Math.random() * (window.innerWidth));
  const [y, setY] = React.useState(window.innerHeight / 2);

  React.useEffect(() => {
    const updatePosition = () => {
      setY((prevY) => prevY - 1);
    };

    const timer = setInterval(updatePosition, 0.5);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div style={{ position: 'absolute', left: x, top: y }} className='font-semibold z-[4] text-2xl text-white'>
      +{number.number}
    </div>
  );
};