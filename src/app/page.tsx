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
import Clicker from '@/app/Clicker';

export default function HomePage() {
  //const [authData, setAuthData] = useLocalStorage<any>("authdata", {});
  const [authData, setAuthData] = React.useState<any>();
  const [session, setSession] = useLocalStorage<any>("session", "");
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = React.useState(false);

  async function loadPolls(authData: any) {
    update(authData?.id);
    const { data, error } = await supabase
      .from('users')
      .select()
      .eq("deactive", false)
      .order("coins", { ascending: false })
    setUserRating(data);
    setLoaded(true)
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

  const [isClicked, setIsClicked] = React.useState(false);
  const [subPage, setSubPage] = React.useState(0);
  const [userData, setUserData] = React.useState<any>();
  const [userRating, setUserRating] = React.useState<any>([]);
  const [ratingMesto, setRatingMesto] = React.useState<any>(-1);

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
      <section className='z-[3] relative bg-dark flex flex-col justify-between min-w-screen h-full pt-2 pb-8 mx-auto text-white xl:w-[1280px]'>
        <LandingHeader passport={{ authData }} />
        <Clicker app={{ userData: userData, setUserData: setUserData, session: session, supabase: supabase, isClicked: isClicked, setIsClicked: setIsClicked, authData: authData, energy: energy, setEnergy: setEnergy, userRating: userRating, setUserRating: setUserRating, subPage: subPage, setSubPage: setSubPage, setRatingMesto: setRatingMesto, setLoaded: setLoaded, addFloatingNumber: addFloatingNumber }} />
      </section>
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