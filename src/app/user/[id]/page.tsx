'use client';

import Head from 'next/head';
import * as React from 'react';

import { IoMdSearch, IoMdNotificationsOutline, IoMdSend, IoMdCloseCircle } from "react-icons/io";
import { IoMedalSharp, IoSettingsOutline, IoStar } from "react-icons/io5";
import { CiPassport1, CiMedicalCross, CiDeliveryTruck } from "react-icons/ci";
import { FaArrowLeft, FaBook, FaCity, FaPeace } from "react-icons/fa";
import { MdOutlineWorkOutline, MdOutlinePolicy, MdOutlinePauseCircle, MdOutlinePlayCircle, MdOutlineAdminPanelSettings, MdLogout, MdWork, MdLocalPolice, MdEdit, MdCancel } from "react-icons/md";
import { AiOutlineHistory, AiOutlineLoading } from "react-icons/ai";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NextImage from '@/components/NextImage';
import useLocalStorage from "use-local-storage";
import dynamic from 'next/dynamic'
const PassportApp = dynamic(() => import('@/components/miniapps/PassportApp'));

import RealtimeStatus from '@/components/RealtimeStatus';
import Passport from '@/components/Passport';
import IDCard from '@/components/IDCard';
import Rating from '@/components/Rating';
import Header from '@/components/Header';
import LikeCompoennt from '@/components/LikeComponent';
import Post from '@/components/Post';
import { GiGrowth, GiTank } from "react-icons/gi";
import PyatiletkaApp from '@/components/miniapps/PyatiletkaApp';
import { CgUnavailable } from 'react-icons/cg';
import { FaMinus, FaPlus } from 'react-icons/fa6';
import moment from 'moment';


export default function HomePage({ params }: { params: { id: string } }) {
  const userID = params.id;
  const [authData, setAuthData] = useLocalStorage<any>("authdata", {});
  const [postInput, setPostInput] = React.useState("");
  const [posts, setPosts] = React.useState<any>([]);
  const [userData, setUserData] = React.useState<any>({});
  const [session, setSession] = useLocalStorage<any>("session", "");
  const [loaded, setLoaded] = React.useState(false);
  const [postLoaded, setPostLoaded] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const [miniapp, setMiniApp] = React.useState<any>();
  const [subsData, setSubsData] = React.useState<any>([]);

  const [page, setPage] = React.useState<any>(1);

  const [editRating, setEditRating] = React.useState<any>(false);
  const [eRatingMode, setERatingMode] = React.useState<any>(0);
  const [eRatingCost, setERatingCost] = React.useState<any>(0);
  const [eRatingRealson, setERatingRealson] = React.useState<any>();

  const [ratingData, setRatingData] = React.useState<any>([]);

  // Create a single supabase client for interacting with your database
  const supabase = createClientComponentClient();

  async function getPosts(id: any) {
    const { data: user } = await supabase
      .from('users')
      .select('*')
      .eq("id", id)
      .single();
    const { data: rating } = await supabase
      .from('rating')
      .select('*')
      .eq("passid", user?.passid)
      .order('created_at', { ascending: false })
    setRatingData(rating);
    const { data: posts, error } = await supabase
      .from('posts')
      .select('*')
      .eq("passid", user?.passid)
      .order('created_at', { ascending: false })
    setPosts(posts);
    setPostLoaded(true);
    const { data: subs } = await supabase
      .from('subs')
      .select('*')
      .eq("passid1", authData?.passid);
    const subsArray: any[] = [];
    if (subs != null) {
      for (let g3 = 0; g3 < subs?.length; g3++) {
        subsArray.push(subs[g3]?.passid2);
      }
      setSubsData(subsArray);
    }
    setUserData(user);
  }

  React.useEffect(() => {
    open
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
  }, [open]);

  async function getUserByPassID(passid: any) {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("passid", passid)
      .single();
    if (users?.id == null) {
      alert("Пользователь не найден!")
      window.open("/error", "_self")
    } else {
      setAuthData(users);
    }

  }

  async function createPost() {
    let { data: users, error } = await supabase
      .from('posts')
      .insert({ passid: authData?.passid, text: postInput })
    setPostInput("");
    alert("Опубликовано!")
    getPosts(userID)

  }

  async function applynRating() {
    let oldT = 0;
    let newT = 0;
    let { data: rating0 } = await supabase
      .from('rating')
      .select()
      .eq("passid", userData?.passid)
      .order('created_at', { ascending: false })
    if (rating0 != null) {
      oldT = parseInt(rating0[0]?.new);
    }
    //console.log(oldT);
    //console.log(oldT += eRatingCost);
    if (eRatingMode == 0) {
      newT = Number(oldT) + Number(eRatingCost);
      let { data: rating, error } = await supabase
        .from('rating')
        .insert({ passid: userData?.passid, old: oldT, new: newT, realson: eRatingRealson, by: authData?.nickname, type: 0 })
      setERatingCost("");
      setERatingRealson("");
      const { data: rating1 } = await supabase
        .from('rating')
        .select('*')
        .eq("passid", userData?.passid)
        .order('created_at', { ascending: false })
      setRatingData(rating1);
      alert("Успешно!")
    } else {
      newT = Number(oldT) - Number(eRatingCost);
      let { data: rating, error } = await supabase
        .from('rating')
        .insert({ passid: userData?.passid, old: oldT, new: newT, realson: eRatingRealson, by: authData?.nickname, type: 1 })
      setERatingCost("");
      setERatingRealson("");
      const { data: rating1 } = await supabase
        .from('rating')
        .select('*')
        .eq("passid", userData?.passid)
        .order('created_at', { ascending: false })
      setRatingData(rating1);
      alert("Успешно!")
    }

  }

  async function getUser(nickname: any) {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("nickname", nickname)
      .single();
    if (users?.id == null) {
      alert("Пользователь не найден!")
      return;
    }
    window.open("/user/" + users?.id, "_self")

  }

  React.useEffect(() => {
    if (!loaded) {
      getPosts(userID)
      setLoaded(true);
      /*roomOne.subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') { return }

        const presenceTrackStatus = await roomOne.track(userStatus)
      })*/
      getUserByPassID(authData?.passid);
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

  return (
    <main className='bg-dark'>
      <RealtimeStatus />
      <Head>
        <title>Hi</title>
      </Head>
      <div className='bg-red-500 bg-red-600 bg-green-800 bg-zinc-400 w-[0%] w-[0.1%] w-[0.2%] w-[0.3%] w-[0.4%] w-[0.5%] w-[0.6%] w-[0.7%] w-[0.8%] w-[0.9%] w-[1%] w-[1.1%] w-[1.2%] w-[1.3%] w-[1.4%] w-[1.5%] w-[1.6%] w-[1.7%] w-[1.8%] w-[1.9%] w-[2%] w-[2.1%] w-[2.2%] w-[2.3%] w-[2.4%] w-[2.5%] w-[2.6%] w-[2.7%] w-[2.8%] w-[2.9%] w-[3%] w-[3.1%] w-[3.2%] w-[3.3%] w-[3.4%] w-[3.5%] w-[3.6%] w-[3.7%] w-[3.8%] w-[3.9%] w-[4%] w-[4.1%] w-[4.2%] w-[4.3%] w-[4.4%] w-[4.5%] w-[4.6%] w-[4.7%] w-[4.8%] w-[4.9%] w-[5%] w-[5.1%] w-[5.2%] w-[5.3%] w-[5.4%] w-[5.5%] w-[5.6%] w-[5.7%] w-[5.8%] w-[5.9%] w-[6%] w-[6.1%] w-[6.2%] w-[6.3%] w-[6.4%] w-[6.5%] w-[6.6%] w-[6.7%] w-[6.8%] w-[6.9%] w-[7%] w-[7.1%] w-[7.2%] w-[7.3%] w-[7.4%] w-[7.5%] w-[7.6%] w-[7.7%] w-[7.8%] w-[7.9%] w-[8%] w-[8.1%] w-[8.2%] w-[8.3%] w-[8.4%] w-[8.5%] w-[8.6%] w-[8.7%] w-[8.8%] w-[8.9%] w-[9%] w-[9.1%] w-[9.2%] w-[9.3%] w-[9.4%] w-[9.5%] w-[9.6%] w-[9.7%] w-[9.8%] w-[9.9%] w-[10%] w-[10.1%] w-[10.2%] w-[10.3%] w-[10.4%] w-[10.5%] w-[10.6%] w-[10.7%] w-[10.8%] w-[10.9%] w-[11%] w-[11.1%] w-[11.2%] w-[11.3%] w-[11.4%] w-[11.5%] w-[11.6%] w-[11.7%] w-[11.8%] w-[11.9%] w-[12%] w-[12.1%] w-[12.2%] w-[12.3%] w-[12.4%] w-[12.5%] w-[12.6%] w-[12.7%] w-[12.8%] w-[12.9%] w-[13%] w-[13.1%] w-[13.2%] w-[13.3%] w-[13.4%] w-[13.5%] w-[13.6%] w-[13.7%] w-[13.8%] w-[13.9%] w-[14%] w-[14.1%] w-[14.2%] w-[14.3%] w-[14.4%] w-[14.5%] w-[14.6%] w-[14.7%] w-[14.8%] w-[14.9%] w-[15%] w-[15.1%] w-[15.2%] w-[15.3%] w-[15.4%] w-[15.5%] w-[15.6%] w-[15.7%] w-[15.8%] w-[15.9%] w-[16%] w-[16.1%] w-[16.2%] w-[16.3%] w-[16.4%] w-[16.5%] w-[16.6%] w-[16.7%] w-[16.8%] w-[16.9%] w-[17%] w-[17.1%] w-[17.2%] w-[17.3%] w-[17.4%] w-[17.5%] w-[17.6%] w-[17.7%] w-[17.8%] w-[17.9%] w-[18%] w-[18.1%] w-[18.2%] w-[18.3%] w-[18.4%] w-[18.5%] w-[18.6%] w-[18.7%] w-[18.8%] w-[18.9%] w-[19%] w-[19.1%] w-[19.2%] w-[19.3%] w-[19.4%] w-[19.5%] w-[19.6%] w-[19.7%] w-[19.8%] w-[19.9%] w-[20%] w-[20.1%] w-[20.2%] w-[20.3%] w-[20.4%] w-[20.5%] w-[20.6%] w-[20.7%] w-[20.8%] w-[20.9%] w-[21%] w-[21.1%] w-[21.2%] w-[21.3%] w-[21.4%] w-[21.5%] w-[21.6%] w-[21.7%] w-[21.8%] w-[21.9%] w-[22%] w-[22.1%] w-[22.2%] w-[22.3%] w-[22.4%] w-[22.5%] w-[22.6%] w-[22.7%] w-[22.8%] w-[22.9%] w-[23%] w-[23.1%] w-[23.2%] w-[23.3%] w-[23.4%] w-[23.5%] w-[23.6%] w-[23.7%] w-[23.8%] w-[23.9%] w-[24%] w-[24.1%] w-[24.2%] w-[24.3%] w-[24.4%] w-[24.5%] w-[24.6%] w-[24.7%] w-[24.8%] w-[24.9%] w-[25%] w-[25.1%] w-[25.2%] w-[25.3%] w-[25.4%] w-[25.5%] w-[25.6%] w-[25.7%] w-[25.8%] w-[25.9%] w-[26%] w-[26.1%] w-[26.2%] w-[26.3%] w-[26.4%] w-[26.5%] w-[26.6%] w-[26.7%] w-[26.8%] w-[26.9%] w-[27%] w-[27.1%] w-[27.2%] w-[27.3%] w-[27.4%] w-[27.5%] w-[27.6%] w-[27.7%] w-[27.8%] w-[27.9%] w-[28%] w-[28.1%] w-[28.2%] w-[28.3%] w-[28.4%] w-[28.5%] w-[28.6%] w-[28.7%] w-[28.8%] w-[28.9%] w-[29%] w-[29.1%] w-[29.2%] w-[29.3%] w-[29.4%] w-[29.5%] w-[29.6%] w-[29.7%] w-[29.8%] w-[29.9%] w-[30%] w-[30.1%] w-[30.2%] w-[30.3%] w-[30.4%] w-[30.5%] w-[30.6%] w-[30.7%] w-[30.8%] w-[30.9%] w-[31%] w-[31.1%] w-[31.2%] w-[31.3%] w-[31.4%] w-[31.5%] w-[31.6%] w-[31.7%] w-[31.8%] w-[31.9%] w-[32%] w-[32.1%] w-[32.2%] w-[32.3%] w-[32.4%] w-[32.5%] w-[32.6%] w-[32.7%] w-[32.8%] w-[32.9%] w-[33%] w-[33.1%] w-[33.2%] w-[33.3%] w-[33.4%] w-[33.5%] w-[33.6%] w-[33.7%] w-[33.8%] w-[33.9%] w-[34%] w-[34.1%] w-[34.2%] w-[34.3%] w-[34.4%] w-[34.5%] w-[34.6%] w-[34.7%] w-[34.8%] w-[34.9%] w-[35%] w-[35.1%] w-[35.2%] w-[35.3%] w-[35.4%] w-[35.5%] w-[35.6%] w-[35.7%] w-[35.8%] w-[35.9%] w-[36%] w-[36.1%] w-[36.2%] w-[36.3%] w-[36.4%] w-[36.5%] w-[36.6%] w-[36.7%] w-[36.8%] w-[36.9%] w-[37%] w-[37.1%] w-[37.2%] w-[37.3%] w-[37.4%] w-[37.5%] w-[37.6%] w-[37.7%] w-[37.8%] w-[37.9%] w-[38%] w-[38.1%] w-[38.2%] w-[38.3%] w-[38.4%] w-[38.5%] w-[38.6%] w-[38.7%] w-[38.8%] w-[38.9%] w-[39%] w-[39.1%] w-[39.2%] w-[39.3%] w-[39.4%] w-[39.5%] w-[39.6%] w-[39.7%] w-[39.8%] w-[39.9%] w-[40%] w-[40.1%] w-[40.2%] w-[40.3%] w-[40.4%] w-[40.5%] w-[40.6%] w-[40.7%] w-[40.8%] w-[40.9%] w-[41%] w-[41.1%] w-[41.2%] w-[41.3%] w-[41.4%] w-[41.5%] w-[41.6%] w-[41.7%] w-[41.8%] w-[41.9%] w-[42%] w-[42.1%] w-[42.2%] w-[42.3%] w-[42.4%] w-[42.5%] w-[42.6%] w-[42.7%] w-[42.8%] w-[42.9%] w-[43%] w-[43.1%] w-[43.2%] w-[43.3%] w-[43.4%] w-[43.5%] w-[43.6%] w-[43.7%] w-[43.8%] w-[43.9%] w-[44%] w-[44.1%] w-[44.2%] w-[44.3%] w-[44.4%] w-[44.5%] w-[44.6%] w-[44.7%] w-[44.8%] w-[44.9%] w-[45%] w-[45.1%] w-[45.2%] w-[45.3%] w-[45.4%] w-[45.5%] w-[45.6%] w-[45.7%] w-[45.8%] w-[45.9%] w-[46%] w-[46.1%] w-[46.2%] w-[46.3%] w-[46.4%] w-[46.5%] w-[46.6%] w-[46.7%] w-[46.8%] w-[46.9%] w-[47%] w-[47.1%] w-[47.2%] w-[47.3%] w-[47.4%] w-[47.5%] w-[47.6%] w-[47.7%] w-[47.8%] w-[47.9%] w-[48%] w-[48.1%] w-[48.2%] w-[48.3%] w-[48.4%] w-[48.5%] w-[48.6%] w-[48.7%] w-[48.8%] w-[48.9%] w-[49%] w-[49.1%] w-[49.2%] w-[49.3%] w-[49.4%] w-[49.5%] w-[49.6%] w-[49.7%] w-[49.8%] w-[49.9%] w-[50%] w-[50.1%] w-[50.2%] w-[50.3%] w-[50.4%] w-[50.5%] w-[50.6%] w-[50.7%] w-[50.8%] w-[50.9%] w-[51%] w-[51.1%] w-[51.2%] w-[51.3%] w-[51.4%] w-[51.5%] w-[51.6%] w-[51.7%] w-[51.8%] w-[51.9%] w-[52%] w-[52.1%] w-[52.2%] w-[52.3%] w-[52.4%] w-[52.5%] w-[52.6%] w-[52.7%] w-[52.8%] w-[52.9%] w-[53%] w-[53.1%] w-[53.2%] w-[53.3%] w-[53.4%] w-[53.5%] w-[53.6%] w-[53.7%] w-[53.8%] w-[53.9%] w-[54%] w-[54.1%] w-[54.2%] w-[54.3%] w-[54.4%] w-[54.5%] w-[54.6%] w-[54.7%] w-[54.8%] w-[54.9%] w-[55%] w-[55.1%] w-[55.2%] w-[55.3%] w-[55.4%] w-[55.5%] w-[55.6%] w-[55.7%] w-[55.8%] w-[55.9%] w-[56%] w-[56.1%] w-[56.2%] w-[56.3%] w-[56.4%] w-[56.5%] w-[56.6%] w-[56.7%] w-[56.8%] w-[56.9%] w-[57%] w-[57.1%] w-[57.2%] w-[57.3%] w-[57.4%] w-[57.5%] w-[57.6%] w-[57.7%] w-[57.8%] w-[57.9%] w-[58%] w-[58.1%] w-[58.2%] w-[58.3%] w-[58.4%] w-[58.5%] w-[58.6%] w-[58.7%] w-[58.8%] w-[58.9%] w-[59%] w-[59.1%] w-[59.2%] w-[59.3%] w-[59.4%] w-[59.5%] w-[59.6%] w-[59.7%] w-[59.8%] w-[59.9%] w-[60%] w-[60.1%] w-[60.2%] w-[60.3%] w-[60.4%] w-[60.5%] w-[60.6%] w-[60.7%] w-[60.8%] w-[60.9%] w-[61%] w-[61.1%] w-[61.2%] w-[61.3%] w-[61.4%] w-[61.5%] w-[61.6%] w-[61.7%] w-[61.8%] w-[61.9%] w-[62%] w-[62.1%] w-[62.2%] w-[62.3%] w-[62.4%] w-[62.5%] w-[62.6%] w-[62.7%] w-[62.8%] w-[62.9%] w-[63%] w-[63.1%] w-[63.2%] w-[63.3%] w-[63.4%] w-[63.5%] w-[63.6%] w-[63.7%] w-[63.8%] w-[63.9%] w-[64%] w-[64.1%] w-[64.2%] w-[64.3%] w-[64.4%] w-[64.5%] w-[64.6%] w-[64.7%] w-[64.8%] w-[64.9%] w-[65%] w-[65.1%] w-[65.2%] w-[65.3%] w-[65.4%] w-[65.5%] w-[65.6%] w-[65.7%] w-[65.8%] w-[65.9%] w-[66%] w-[66.1%] w-[66.2%] w-[66.3%] w-[66.4%] w-[66.5%] w-[66.6%] w-[66.7%] w-[66.8%] w-[66.9%] w-[67%] w-[67.1%] w-[67.2%] w-[67.3%] w-[67.4%] w-[67.5%] w-[67.6%] w-[67.7%] w-[67.8%] w-[67.9%] w-[68%] w-[68.1%] w-[68.2%] w-[68.3%] w-[68.4%] w-[68.5%] w-[68.6%] w-[68.7%] w-[68.8%] w-[68.9%] w-[69%] w-[69.1%] w-[69.2%] w-[69.3%] w-[69.4%] w-[69.5%] w-[69.6%] w-[69.7%] w-[69.8%] w-[69.9%] w-[70%] w-[70.1%] w-[70.2%] w-[70.3%] w-[70.4%] w-[70.5%] w-[70.6%] w-[70.7%] w-[70.8%] w-[70.9%] w-[71%] w-[71.1%] w-[71.2%] w-[71.3%] w-[71.4%] w-[71.5%] w-[71.6%] w-[71.7%] w-[71.8%] w-[71.9%] w-[72%] w-[72.1%] w-[72.2%] w-[72.3%] w-[72.4%] w-[72.5%] w-[72.6%] w-[72.7%] w-[72.8%] w-[72.9%] w-[73%] w-[73.1%] w-[73.2%] w-[73.3%] w-[73.4%] w-[73.5%] w-[73.6%] w-[73.7%] w-[73.8%] w-[73.9%] w-[74%] w-[74.1%] w-[74.2%] w-[74.3%] w-[74.4%] w-[74.5%] w-[74.6%] w-[74.7%] w-[74.8%] w-[74.9%] w-[75%] w-[75.1%] w-[75.2%] w-[75.3%] w-[75.4%] w-[75.5%] w-[75.6%] w-[75.7%] w-[75.8%] w-[75.9%] w-[76%] w-[76.1%] w-[76.2%] w-[76.3%] w-[76.4%] w-[76.5%] w-[76.6%] w-[76.7%] w-[76.8%] w-[76.9%] w-[77%] w-[77.1%] w-[77.2%] w-[77.3%] w-[77.4%] w-[77.5%] w-[77.6%] w-[77.7%] w-[77.8%] w-[77.9%] w-[78%] w-[78.1%] w-[78.2%] w-[78.3%] w-[78.4%] w-[78.5%] w-[78.6%] w-[78.7%] w-[78.8%] w-[78.9%] w-[79%] w-[79.1%] w-[79.2%] w-[79.3%] w-[79.4%] w-[79.5%] w-[79.6%] w-[79.7%] w-[79.8%] w-[79.9%] w-[80%] w-[80.1%] w-[80.2%] w-[80.3%] w-[80.4%] w-[80.5%] w-[80.6%] w-[80.7%] w-[80.8%] w-[80.9%] w-[81%] w-[81.1%] w-[81.2%] w-[81.3%] w-[81.4%] w-[81.5%] w-[81.6%] w-[81.7%] w-[81.8%] w-[81.9%] w-[82%] w-[82.1%] w-[82.2%] w-[82.3%] w-[82.4%] w-[82.5%] w-[82.6%] w-[82.7%] w-[82.8%] w-[82.9%] w-[83%] w-[83.1%] w-[83.2%] w-[83.3%] w-[83.4%] w-[83.5%] w-[83.6%] w-[83.7%] w-[83.8%] w-[83.9%] w-[84%] w-[84.1%] w-[84.2%] w-[84.3%] w-[84.4%] w-[84.5%] w-[84.6%] w-[84.7%] w-[84.8%] w-[84.9%] w-[85%] w-[85.1%] w-[85.2%] w-[85.3%] w-[85.4%] w-[85.5%] w-[85.6%] w-[85.7%] w-[85.8%] w-[85.9%] w-[86%] w-[86.1%] w-[86.2%] w-[86.3%] w-[86.4%] w-[86.5%] w-[86.6%] w-[86.7%] w-[86.8%] w-[86.9%] w-[87%] w-[87.1%] w-[87.2%] w-[87.3%] w-[87.4%] w-[87.5%] w-[87.6%] w-[87.7%] w-[87.8%] w-[87.9%] w-[88%] w-[88.1%] w-[88.2%] w-[88.3%] w-[88.4%] w-[88.5%] w-[88.6%] w-[88.7%] w-[88.8%] w-[88.9%] w-[89%] w-[89.1%] w-[89.2%] w-[89.3%] w-[89.4%] w-[89.5%] w-[89.6%] w-[89.7%] w-[89.8%] w-[89.9%] w-[90%] w-[90.1%] w-[90.2%] w-[90.3%] w-[90.4%] w-[90.5%] w-[90.6%] w-[90.7%] w-[90.8%] w-[90.9%] w-[91%] w-[91.1%] w-[91.2%] w-[91.3%] w-[91.4%] w-[91.5%] w-[91.6%] w-[91.7%] w-[91.8%] w-[91.9%] w-[92%] w-[92.1%] w-[92.2%] w-[92.3%] w-[92.4%] w-[92.5%] w-[92.6%] w-[92.7%] w-[92.8%] w-[92.9%] w-[93%] w-[93.1%] w-[93.2%] w-[93.3%] w-[93.4%] w-[93.5%] w-[93.6%] w-[93.7%] w-[93.8%] w-[93.9%] w-[94%] w-[94.1%] w-[94.2%] w-[94.3%] w-[94.4%] w-[94.5%] w-[94.6%] w-[94.7%] w-[94.8%] w-[94.9%] w-[95%] w-[95.1%] w-[95.2%] w-[95.3%] w-[95.4%] w-[95.5%] w-[95.6%] w-[95.7%] w-[95.8%] w-[95.9%] w-[96%] w-[96.1%] w-[96.2%] w-[96.3%] w-[96.4%] w-[96.5%] w-[96.6%] w-[96.7%] w-[96.8%] w-[96.9%] w-[97%] w-[97.1%] w-[97.2%] w-[97.3%] w-[97.4%] w-[97.5%] w-[97.6%] w-[97.7%] w-[97.8%] w-[97.9%] w-[98%] w-[98.1%] w-[98.2%] w-[98.3%] w-[98.4%] w-[98.5%] w-[98.6%] w-[98.7%] w-[98.8%] w-[98.9%] w-[99%] w-[99.1%] w-[99.2%] w-[99.3%] w-[99.4%] w-[99.5%] w-[99.6%] w-[99.7%] w-[99.8%] w-[99.9%] w-[100%] '></div>
      <section className='bg-dark min-w-screen min-h-screen py-4 mx-auto text-white xl:w-[1280px]'>
        <Header passport={{ userID: userID, authData: authData }} />
        <section className='bg-transparent text-transparent select-none rounded-2xl px-4 py-4 mx-4 mt-4 hidden'>
          <div className='text-lg'><span className='uppercase font-black'>Внимание!</span> Для безопасности и быстрого входа, привяжите свой Telegram, <span className='cursor-pointer'>инструкция</span></div>
        </section>
        {userData?.inoagent ?
          <section className='select-none bg-gradient-to-br from-rose-400 to-red-600 rounded-2xl px-4 py-4 mx-4 mt-4 hidden sm:block'>
            <div className='text-lg'>ДАННЫЙ МАТЕРИАЛ СОЗДАН И РАСПРОСТРАНЕН ЛИЦОМ, ВКЛЮЧЕННЫМ В РЕЕСТР ИНОСТРАННЫХ СРЕДСТВ МАССОВОЙ ИНФОРМАЦИИ, ВЫПОЛНЯЮЩИХ ФУНКЦИИ ИНОСТРАННОГО АГЕНТА</div>
          </section>
          : null}
        <section className='px-4 mt-4'>
          <div className='flex gap-4 flex-col md:flex-row'>
            <div className='flex gap-4 flex-col md:w-1/3'>
              <IDCard passport={{ authData: authData, userID: userID, subsData: subsData, updatePage: getPosts }} />
              <Rating passport={{ authData: authData, userID: userID, setPage: setPage, ratingData: ratingData }} />
            </div>
            {page == 1 ?
              <div className='flex gap-4 flex-col w-full'>
                <div className='w-full'>
                  {(userData?.about != null) && loaded ?
                    <div className='mb-4 bg-dark2 rounded-2xl px-4 py-6'>
                      {userData?.about}</div>
                    : null}
                  <div className='h-32 flex flex-col gap-4 justify-center items-center h-full'>
                    <CgUnavailable size={32} />
                    <div className='font-bold'>Посты в данный момент недоступны, попробуйте позже</div>
                  </div>
                </div>
              </div> : null}
            {page == 2 ?
              <div className='flex gap-4 flex-col w-full'>
                <div className='w-full select-none'>
                  <div className='mb-4 bg-dark2 rounded-2xl flex items-center justify-between gap-4 px-4 py-6'>
                    <div className='flex items-center gap-4'>
                      <div className='p-2 cursor-pointer hover:bg-dark4 rounded-md' onClick={() => { setPage(1) }}><FaArrowLeft size={18} /></div>
                      <div className='text-xl font-bold'>Социальный рейтинг</div></div>
                    <div className='flex gap-2 items-center'>
                      {editRating && authData?.roles?.includes(1) ?
                        <div className='p-2 cursor-pointer hover:bg-dark4 rounded-md' onClick={() => { setEditRating(false) }}><MdCancel size={18} /></div> :
                        <div className='p-2 cursor-pointer hover:bg-dark4 rounded-md' onClick={() => { setEditRating(true) }}><MdEdit size={18} /></div>}
                    </div>
                  </div>
                  {editRating ?
                    <div className='mb-4 bg-dark2 rounded-2xl flex flex-col px-4 py-6'>
                      <div className='grid grid-cols-3 items-center'>
                        <div className='flex gap-2'>
                          <div className={'p-2 border h-fit hover:bg-dark4 cursor-pointer rounded-md ' + (eRatingMode == 0 ? "border-blue-500" : "border-dark4")} onClick={() => { setERatingMode(0) }}><FaPlus size={18} /></div>
                          <div className={'p-2 border h-fit hover:bg-dark4 cursor-pointer rounded-md ' + (eRatingMode == 1 ? "border-blue-500" : "border-dark4")} onClick={() => { setERatingMode(1) }}><FaMinus size={18} /></div>
                        </div>
                        <div className='flex gap-2'>
                          <div><input onChange={(e: any) => {
                            setERatingCost(e.target.value)
                          }} value={eRatingCost} type='number' className='rounded-2xl bg-dark4 border-none' placeholder='Укажите сколько соц рейтинга надо изменить' /></div>
                        </div>
                        <div className='flex gap-2'>
                          <div><input onChange={(e: any) => {
                            setERatingRealson(e.target.value)
                          }} value={eRatingRealson} className='rounded-2xl bg-dark4 border-none' placeholder='Укажите причину' /></div>
                        </div>
                      </div>
                      <div className='flex justify-end mt-4'>
                        <div className='bg-blue-500 cursor-pointer hover:bg-blue-600 p-2 rounded-2xl' onClick={() => { applynRating() }}>Применить</div>
                      </div>
                    </div> : null}
                  <div className='mb-4 bg-dark2 rounded-2xl w-full text-center grid grid-cols-4 md:grid-cols-5 md:px-4 py-6'>
                    <div className='font-bold text-lg'>Было</div>
                    <div className='font-bold text-lg mb-4'>Причина</div>
                    <div className='font-bold text-lg'>Стало</div>
                    <div className='font-bold text-lg'>Изменено</div>
                    <div className='hidden md:block font-bold text-lg'>Дата</div>
                    {ratingData?.map((e: any) =>
                      <>
                        {e?.type == 1 ?
                          <>
                            <div className='text-green-500'>{e?.old}</div>
                            <div className='text-start'>{e?.realson}</div>
                            <div className='text-red-500'>{e?.new}</div>
                            <div className=''>{e?.by}</div>
                            <div className='hidden md:block'>{moment(e?.created_at).format("DD.MM.YYYY H:mm")}</div>
                          </> : <>
                            <div className='text-red-500'>{e?.old}</div>
                            <div className='text-start'>{e?.realson}</div>
                            <div className='text-green-500'>{e?.new}</div>
                            <div className=''>{e?.by}</div>
                            <div className='hidden md:block'>{moment(e?.created_at).format("DD.MM.YYYY H:mm")}</div>
                          </>}
                      </>
                    )}
                  </div>
                </div>
              </div> : null}
          </div>
        </section>
      </section>
      {open ? miniapp : null}
    </main>
  );
}
