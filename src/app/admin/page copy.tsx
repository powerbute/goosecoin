'use client';

import Head from 'next/head';
import * as React from 'react';

import { IoMdSearch, IoMdNotificationsOutline, IoMdCheckmarkCircleOutline } from "react-icons/io";
import { IoArrowBack, IoSettingsOutline } from "react-icons/io5";
import { CiPassport1, CiMedicalCross } from "react-icons/ci";
import { FaCity } from "react-icons/fa";
import { MdOutlineWorkOutline, MdOutlinePolicy, MdOutlinePauseCircle, MdOutlinePlayCircle, MdOutlineAdminPanelSettings, MdLogout } from "react-icons/md";
import { AiOutlineHistory } from "react-icons/ai";

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NextImage from '@/components/NextImage';
import useLocalStorage from "use-local-storage";
import dynamic from 'next/dynamic'
import RealtimeStatus from '@/components/RealtimeStatus';

const AdminList = dynamic(() => import('@/components/AdminList'), { ssr: false })
const Header = dynamic(() => import('@/components/AdminHeader'), { ssr: false })


export default function HomePage({ params }: { params: { id: string } }) {
  const userID = params.id;
  const [userData, setUserData] = React.useState<any>({});
  const [users, setUsers] = React.useState<any>([]);
  const [activeUsers, setActiveUsers] = React.useState<any>([]);
  const [passid, setPassid] = React.useState<any>();
  const [authData, setAuthData] = useLocalStorage<any>("authdata", {});
  const [session, setSession] = useLocalStorage("session", "");
  const [input1, setInput1] = React.useState<any>();
  const [input2, setInput2] = React.useState<any>();
  const [input3, setInput3] = React.useState<any>();
  const [input4, setInput4] = React.useState<any>();
  const [input5, setInput5] = React.useState<any>();
  const [input6, setInput6] = React.useState<any>();
  const [input7, setInput7] = React.useState<any>();
  const [input8, setInput8] = React.useState<any>();
  const [input9, setInput9] = React.useState<any>();
  const [currentID, setCurrentID] = React.useState<any>();
  const [menu1, setMenu1] = React.useState(true);
  const [loaded, setLoaded] = React.useState(false);

  const [inoagent, setInoagent] = React.useState<any>(false);
  const [hero, setHero] = React.useState<any>(false);
  const [work, setWork] = React.useState<any>(false);
  const [culture, setCulture] = React.useState<any>(false);
  const [peace, setPeace] = React.useState<any>(false);
  const [donos, setDonos] = React.useState<any>(false);
  const [activer, setActiver] = React.useState<any>(false);
  const [warrior, setWarrior] = React.useState<any>(false);
  const [wanted, setWanted] = React.useState<any>(false);
  const [job, setJob] = React.useState<any>("");

  const [iUsers, setIUsers] = React.useState<any>([]);

  const [jUsers, setJUsers] = React.useState<any>([]);

  // Create a single supabase client for interacting with your database
  const supabase = createClientComponentClient();

  async function setUserByPassID(passid: any) {
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq("passid", passid)
      .single();
    if (user?.id == null) {
      alert("Пользователь не найден!")
    } else {
      setUserData(user);
      let { data: users, error: a1 } = await supabase
        .from('users')
        .select('nickname, invitedby')
        .eq("invitedby", user?.passid);
      setInoagent(user?.inoagent);
      setWork(user?.jobmedal);
      setCulture(user?.culturemedal);
      setPeace(user?.peacemedal);
      setDonos(user?.policemedal);
      setActiver(user?.activemedal);
      setWarrior(user?.warmedal);
      setHero(user?.heromedal);
      setWanted(user?.wanted);
      setJob(user?.job);
      setIUsers(users);
    }

  }

  async function getUser(nickname: any) {
    let { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq("nickname", nickname)
      .single();
    setUserData(user);
    setInoagent(user?.inoagent);
    setWork(user?.jobmedal);
    setCulture(user?.culturemedal);
    setPeace(user?.peacemedal);
    setDonos(user?.policemedal);
    setActiver(user?.activemedal);
    setWarrior(user?.warmedal);
    setHero(user?.heromedal);
    setWanted(user?.wanted);
    setJob(user?.job);

    let { data: users, error: a1 } = await supabase
      .from('users')
      .select('nickname, invitedby')
      .eq("invitedby", user?.passid);
    setIUsers(users);
  }

  const dateByWeekNumber = (week: any) => {
    // Cоздаём дату, гарантированно входящую в первую неделю.
    const date = new Date(2023, 0, 7);
    // Откатываемся до первого четверга года
    // По ГОСТ ИСО 8601-2001 первая неделя года должна содержать четверг
    date.setDate(date.getDate() - (date.getDay() + 10) % 7);
    // Переходим в нужную неделю
    date.setDate(date.getDate() + (week - 1) * 7);
    // Откатываемся до понедельника
    date.setDate(date.getDate() - 3);
    return date;
  };

  function getWeekDay(date: any) {
    let days = ['ВС', 'ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ'];

    return days[date.getDay()];
  }

  async function getStats() {
    let { data: users, error } = await supabase
      .from('users')
      .select('id, status')
      .lt('status', 2);
    setActiveUsers(users);

    let { data: users1, error: a1 } = await supabase
      .from('users')
      .select('*')
      .neq("job", null);
    setJUsers(users1);

    const date = new Date();
    const sDay = date.getDate() - date.getDay() + 1;
    let { data: sUsers, error: a } = await supabase
      .from('users')
      .select('id, dateofissue')


  }

  React.useEffect(() => {
    if (!(authData?.roles?.includes(1) || authData?.roles?.includes(2) || authData?.roles?.includes(6))) {
      window.open("/home", "_self")
    }
    if (!loaded) {
      getStats();
      setLoaded(true);
    }
  })

  async function getUser2(nickname: any) {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("nickname", nickname)
      .single();
    if (users?.id == null) {
      alert("Пользователь не найден!")
    }
    location.replace("/user/" + users.id)

  }

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

  function makeid2(length: any) {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  const [gID, setGID] = React.useState<any>();

  function makeAuthCode() {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < 6) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  async function applyInput1() {
    let { error } = await supabase
      .from('users')
      .update({ nickname: input1 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput1("");
  }

  async function applyInput2() {
    let { error } = await supabase
      .from('users')
      .update({ surname: input2 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput2("");
  }

  async function applyInput3() {
    let { error } = await supabase
      .from('users')
      .update({ birthdate: input3 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput3("");
  }


  async function applyInput4() {
    let { error } = await supabase
      .from('users')
      .update({ tg: input4 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput4("");
  }


  async function applyInput5() {
    let { error } = await supabase
      .from('users')
      .update({ issuedby: input5 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    // getUserData();
    setInput5("");
  }


  async function applyInput6() {
    let { error } = await supabase
      .from('users')
      .update({ dateofissue: input6 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput6("");
  }

  async function applyInput7() {
    let { error } = await supabase
      .from('users')
      .update({ validuntil: input7 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput7("");
  }

  async function applyInput8() {
    let { error } = await supabase
      .from('users')
      .update({ wantedcost: input8 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput8("");
  }

  async function applyInput9() {
    let { error } = await supabase
      .from('users')
      .update({ job: input9 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
    setInput9("");
  }

  async function applyStatus(status1: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ status: status1 })
      .eq('id', userData?.id);
    if (status1 == 2) {
      let { error: a2 } = await supabase
        .from('users')
        .update({ preStatus: status1 })
        .eq('id', userData?.id);
    } else {
      let { error: a2 } = await supabase
        .from('users')
        .update({ preStatus: null })
        .eq('id', userData?.id);
    }
    alert("Успех!")
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyRating(rating1: any) {
    if (rating1 > 1000 && rating1 < 1000) {
      alert("Минимальный и максимальный рейтинг: -1000 и 1000!!")
    }
    let { error: a1 } = await supabase
      .from('users')
      .update({ rating: rating1 })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyInoagent(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ inoagent: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyHero(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ heromedal: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyWork(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ jobmedal: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyCulture(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ culturemedal: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyPeace(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ peacemedal: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyDonos(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ policemedal: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyActiver(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ activemedal: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyWarrior(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ warmedal: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyWanted(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ wanted: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function applyJob(value: any) {
    let { error: a1 } = await supabase
      .from('users')
      .update({ job: value })
      .eq('id', userData?.id);
    setUserByPassID(userData?.passid);
    //getUserData();
  }

  async function createAccount() {
    const passIDt = "LGS-" + gID;
    let { error: a1 } = await supabase
      .from('users')
      .insert({ tg: input4, passid: passIDt, nickname: input1, rating: 0, surname: input2, issuedby: input5, dateofissue: input6, validuntil: "10.06.2025", status: 0, birthdate: input3 })
    setInput1("");
    setInput2("");
    setInput3("");
    setInput4("");
    setInput5("");
    setInput6("");
    setInput7("");
    //getUserData();
    setGID(makeid2(6))
  }

  async function genUrl() {
    let authcode = makeAuthCode();
    let { error: a1 } = await supabase
      .from('authcodes')
      .insert({ passid: userData?.passid, code: authcode })
    navigator.clipboard.writeText("https://id.gooseland.cc/auth/" + authcode);
    //alert("Скопировано!")
  }

  async function handleSearch(event: any) {
    if (event.key === 'Enter') {
      getUser(event.target.value)
    }
  }

  function search_array(array: any, valuetofind: any) {
    for (let i = 0; i < array.length; i++) {
      if (array[i]['passid'] === valuetofind) {
        return array[i];
      }
    }
    return -1;
  }


  return (
    <main className='bg-dark'>
      <RealtimeStatus />
      <Head>
        <title>Hi</title>
      </Head>
      <div className='bg-red-500 bg-red-600 bg-green-800 bg-zinc-400 w-[0%] w-[0.1%] w-[0.2%] w-[0.3%] w-[0.4%] w-[0.5%] w-[0.6%] w-[0.7%] w-[0.8%] w-[0.9%] w-[1%] w-[1.1%] w-[1.2%] w-[1.3%] w-[1.4%] w-[1.5%] w-[1.6%] w-[1.7%] w-[1.8%] w-[1.9%] w-[2%] w-[2.1%] w-[2.2%] w-[2.3%] w-[2.4%] w-[2.5%] w-[2.6%] w-[2.7%] w-[2.8%] w-[2.9%] w-[3%] w-[3.1%] w-[3.2%] w-[3.3%] w-[3.4%] w-[3.5%] w-[3.6%] w-[3.7%] w-[3.8%] w-[3.9%] w-[4%] w-[4.1%] w-[4.2%] w-[4.3%] w-[4.4%] w-[4.5%] w-[4.6%] w-[4.7%] w-[4.8%] w-[4.9%] w-[5%] w-[5.1%] w-[5.2%] w-[5.3%] w-[5.4%] w-[5.5%] w-[5.6%] w-[5.7%] w-[5.8%] w-[5.9%] w-[6%] w-[6.1%] w-[6.2%] w-[6.3%] w-[6.4%] w-[6.5%] w-[6.6%] w-[6.7%] w-[6.8%] w-[6.9%] w-[7%] w-[7.1%] w-[7.2%] w-[7.3%] w-[7.4%] w-[7.5%] w-[7.6%] w-[7.7%] w-[7.8%] w-[7.9%] w-[8%] w-[8.1%] w-[8.2%] w-[8.3%] w-[8.4%] w-[8.5%] w-[8.6%] w-[8.7%] w-[8.8%] w-[8.9%] w-[9%] w-[9.1%] w-[9.2%] w-[9.3%] w-[9.4%] w-[9.5%] w-[9.6%] w-[9.7%] w-[9.8%] w-[9.9%] w-[10%] w-[10.1%] w-[10.2%] w-[10.3%] w-[10.4%] w-[10.5%] w-[10.6%] w-[10.7%] w-[10.8%] w-[10.9%] w-[11%] w-[11.1%] w-[11.2%] w-[11.3%] w-[11.4%] w-[11.5%] w-[11.6%] w-[11.7%] w-[11.8%] w-[11.9%] w-[12%] w-[12.1%] w-[12.2%] w-[12.3%] w-[12.4%] w-[12.5%] w-[12.6%] w-[12.7%] w-[12.8%] w-[12.9%] w-[13%] w-[13.1%] w-[13.2%] w-[13.3%] w-[13.4%] w-[13.5%] w-[13.6%] w-[13.7%] w-[13.8%] w-[13.9%] w-[14%] w-[14.1%] w-[14.2%] w-[14.3%] w-[14.4%] w-[14.5%] w-[14.6%] w-[14.7%] w-[14.8%] w-[14.9%] w-[15%] w-[15.1%] w-[15.2%] w-[15.3%] w-[15.4%] w-[15.5%] w-[15.6%] w-[15.7%] w-[15.8%] w-[15.9%] w-[16%] w-[16.1%] w-[16.2%] w-[16.3%] w-[16.4%] w-[16.5%] w-[16.6%] w-[16.7%] w-[16.8%] w-[16.9%] w-[17%] w-[17.1%] w-[17.2%] w-[17.3%] w-[17.4%] w-[17.5%] w-[17.6%] w-[17.7%] w-[17.8%] w-[17.9%] w-[18%] w-[18.1%] w-[18.2%] w-[18.3%] w-[18.4%] w-[18.5%] w-[18.6%] w-[18.7%] w-[18.8%] w-[18.9%] w-[19%] w-[19.1%] w-[19.2%] w-[19.3%] w-[19.4%] w-[19.5%] w-[19.6%] w-[19.7%] w-[19.8%] w-[19.9%] w-[20%] w-[20.1%] w-[20.2%] w-[20.3%] w-[20.4%] w-[20.5%] w-[20.6%] w-[20.7%] w-[20.8%] w-[20.9%] w-[21%] w-[21.1%] w-[21.2%] w-[21.3%] w-[21.4%] w-[21.5%] w-[21.6%] w-[21.7%] w-[21.8%] w-[21.9%] w-[22%] w-[22.1%] w-[22.2%] w-[22.3%] w-[22.4%] w-[22.5%] w-[22.6%] w-[22.7%] w-[22.8%] w-[22.9%] w-[23%] w-[23.1%] w-[23.2%] w-[23.3%] w-[23.4%] w-[23.5%] w-[23.6%] w-[23.7%] w-[23.8%] w-[23.9%] w-[24%] w-[24.1%] w-[24.2%] w-[24.3%] w-[24.4%] w-[24.5%] w-[24.6%] w-[24.7%] w-[24.8%] w-[24.9%] w-[25%] w-[25.1%] w-[25.2%] w-[25.3%] w-[25.4%] w-[25.5%] w-[25.6%] w-[25.7%] w-[25.8%] w-[25.9%] w-[26%] w-[26.1%] w-[26.2%] w-[26.3%] w-[26.4%] w-[26.5%] w-[26.6%] w-[26.7%] w-[26.8%] w-[26.9%] w-[27%] w-[27.1%] w-[27.2%] w-[27.3%] w-[27.4%] w-[27.5%] w-[27.6%] w-[27.7%] w-[27.8%] w-[27.9%] w-[28%] w-[28.1%] w-[28.2%] w-[28.3%] w-[28.4%] w-[28.5%] w-[28.6%] w-[28.7%] w-[28.8%] w-[28.9%] w-[29%] w-[29.1%] w-[29.2%] w-[29.3%] w-[29.4%] w-[29.5%] w-[29.6%] w-[29.7%] w-[29.8%] w-[29.9%] w-[30%] w-[30.1%] w-[30.2%] w-[30.3%] w-[30.4%] w-[30.5%] w-[30.6%] w-[30.7%] w-[30.8%] w-[30.9%] w-[31%] w-[31.1%] w-[31.2%] w-[31.3%] w-[31.4%] w-[31.5%] w-[31.6%] w-[31.7%] w-[31.8%] w-[31.9%] w-[32%] w-[32.1%] w-[32.2%] w-[32.3%] w-[32.4%] w-[32.5%] w-[32.6%] w-[32.7%] w-[32.8%] w-[32.9%] w-[33%] w-[33.1%] w-[33.2%] w-[33.3%] w-[33.4%] w-[33.5%] w-[33.6%] w-[33.7%] w-[33.8%] w-[33.9%] w-[34%] w-[34.1%] w-[34.2%] w-[34.3%] w-[34.4%] w-[34.5%] w-[34.6%] w-[34.7%] w-[34.8%] w-[34.9%] w-[35%] w-[35.1%] w-[35.2%] w-[35.3%] w-[35.4%] w-[35.5%] w-[35.6%] w-[35.7%] w-[35.8%] w-[35.9%] w-[36%] w-[36.1%] w-[36.2%] w-[36.3%] w-[36.4%] w-[36.5%] w-[36.6%] w-[36.7%] w-[36.8%] w-[36.9%] w-[37%] w-[37.1%] w-[37.2%] w-[37.3%] w-[37.4%] w-[37.5%] w-[37.6%] w-[37.7%] w-[37.8%] w-[37.9%] w-[38%] w-[38.1%] w-[38.2%] w-[38.3%] w-[38.4%] w-[38.5%] w-[38.6%] w-[38.7%] w-[38.8%] w-[38.9%] w-[39%] w-[39.1%] w-[39.2%] w-[39.3%] w-[39.4%] w-[39.5%] w-[39.6%] w-[39.7%] w-[39.8%] w-[39.9%] w-[40%] w-[40.1%] w-[40.2%] w-[40.3%] w-[40.4%] w-[40.5%] w-[40.6%] w-[40.7%] w-[40.8%] w-[40.9%] w-[41%] w-[41.1%] w-[41.2%] w-[41.3%] w-[41.4%] w-[41.5%] w-[41.6%] w-[41.7%] w-[41.8%] w-[41.9%] w-[42%] w-[42.1%] w-[42.2%] w-[42.3%] w-[42.4%] w-[42.5%] w-[42.6%] w-[42.7%] w-[42.8%] w-[42.9%] w-[43%] w-[43.1%] w-[43.2%] w-[43.3%] w-[43.4%] w-[43.5%] w-[43.6%] w-[43.7%] w-[43.8%] w-[43.9%] w-[44%] w-[44.1%] w-[44.2%] w-[44.3%] w-[44.4%] w-[44.5%] w-[44.6%] w-[44.7%] w-[44.8%] w-[44.9%] w-[45%] w-[45.1%] w-[45.2%] w-[45.3%] w-[45.4%] w-[45.5%] w-[45.6%] w-[45.7%] w-[45.8%] w-[45.9%] w-[46%] w-[46.1%] w-[46.2%] w-[46.3%] w-[46.4%] w-[46.5%] w-[46.6%] w-[46.7%] w-[46.8%] w-[46.9%] w-[47%] w-[47.1%] w-[47.2%] w-[47.3%] w-[47.4%] w-[47.5%] w-[47.6%] w-[47.7%] w-[47.8%] w-[47.9%] w-[48%] w-[48.1%] w-[48.2%] w-[48.3%] w-[48.4%] w-[48.5%] w-[48.6%] w-[48.7%] w-[48.8%] w-[48.9%] w-[49%] w-[49.1%] w-[49.2%] w-[49.3%] w-[49.4%] w-[49.5%] w-[49.6%] w-[49.7%] w-[49.8%] w-[49.9%] w-[50%] w-[50.1%] w-[50.2%] w-[50.3%] w-[50.4%] w-[50.5%] w-[50.6%] w-[50.7%] w-[50.8%] w-[50.9%] w-[51%] w-[51.1%] w-[51.2%] w-[51.3%] w-[51.4%] w-[51.5%] w-[51.6%] w-[51.7%] w-[51.8%] w-[51.9%] w-[52%] w-[52.1%] w-[52.2%] w-[52.3%] w-[52.4%] w-[52.5%] w-[52.6%] w-[52.7%] w-[52.8%] w-[52.9%] w-[53%] w-[53.1%] w-[53.2%] w-[53.3%] w-[53.4%] w-[53.5%] w-[53.6%] w-[53.7%] w-[53.8%] w-[53.9%] w-[54%] w-[54.1%] w-[54.2%] w-[54.3%] w-[54.4%] w-[54.5%] w-[54.6%] w-[54.7%] w-[54.8%] w-[54.9%] w-[55%] w-[55.1%] w-[55.2%] w-[55.3%] w-[55.4%] w-[55.5%] w-[55.6%] w-[55.7%] w-[55.8%] w-[55.9%] w-[56%] w-[56.1%] w-[56.2%] w-[56.3%] w-[56.4%] w-[56.5%] w-[56.6%] w-[56.7%] w-[56.8%] w-[56.9%] w-[57%] w-[57.1%] w-[57.2%] w-[57.3%] w-[57.4%] w-[57.5%] w-[57.6%] w-[57.7%] w-[57.8%] w-[57.9%] w-[58%] w-[58.1%] w-[58.2%] w-[58.3%] w-[58.4%] w-[58.5%] w-[58.6%] w-[58.7%] w-[58.8%] w-[58.9%] w-[59%] w-[59.1%] w-[59.2%] w-[59.3%] w-[59.4%] w-[59.5%] w-[59.6%] w-[59.7%] w-[59.8%] w-[59.9%] w-[60%] w-[60.1%] w-[60.2%] w-[60.3%] w-[60.4%] w-[60.5%] w-[60.6%] w-[60.7%] w-[60.8%] w-[60.9%] w-[61%] w-[61.1%] w-[61.2%] w-[61.3%] w-[61.4%] w-[61.5%] w-[61.6%] w-[61.7%] w-[61.8%] w-[61.9%] w-[62%] w-[62.1%] w-[62.2%] w-[62.3%] w-[62.4%] w-[62.5%] w-[62.6%] w-[62.7%] w-[62.8%] w-[62.9%] w-[63%] w-[63.1%] w-[63.2%] w-[63.3%] w-[63.4%] w-[63.5%] w-[63.6%] w-[63.7%] w-[63.8%] w-[63.9%] w-[64%] w-[64.1%] w-[64.2%] w-[64.3%] w-[64.4%] w-[64.5%] w-[64.6%] w-[64.7%] w-[64.8%] w-[64.9%] w-[65%] w-[65.1%] w-[65.2%] w-[65.3%] w-[65.4%] w-[65.5%] w-[65.6%] w-[65.7%] w-[65.8%] w-[65.9%] w-[66%] w-[66.1%] w-[66.2%] w-[66.3%] w-[66.4%] w-[66.5%] w-[66.6%] w-[66.7%] w-[66.8%] w-[66.9%] w-[67%] w-[67.1%] w-[67.2%] w-[67.3%] w-[67.4%] w-[67.5%] w-[67.6%] w-[67.7%] w-[67.8%] w-[67.9%] w-[68%] w-[68.1%] w-[68.2%] w-[68.3%] w-[68.4%] w-[68.5%] w-[68.6%] w-[68.7%] w-[68.8%] w-[68.9%] w-[69%] w-[69.1%] w-[69.2%] w-[69.3%] w-[69.4%] w-[69.5%] w-[69.6%] w-[69.7%] w-[69.8%] w-[69.9%] w-[70%] w-[70.1%] w-[70.2%] w-[70.3%] w-[70.4%] w-[70.5%] w-[70.6%] w-[70.7%] w-[70.8%] w-[70.9%] w-[71%] w-[71.1%] w-[71.2%] w-[71.3%] w-[71.4%] w-[71.5%] w-[71.6%] w-[71.7%] w-[71.8%] w-[71.9%] w-[72%] w-[72.1%] w-[72.2%] w-[72.3%] w-[72.4%] w-[72.5%] w-[72.6%] w-[72.7%] w-[72.8%] w-[72.9%] w-[73%] w-[73.1%] w-[73.2%] w-[73.3%] w-[73.4%] w-[73.5%] w-[73.6%] w-[73.7%] w-[73.8%] w-[73.9%] w-[74%] w-[74.1%] w-[74.2%] w-[74.3%] w-[74.4%] w-[74.5%] w-[74.6%] w-[74.7%] w-[74.8%] w-[74.9%] w-[75%] w-[75.1%] w-[75.2%] w-[75.3%] w-[75.4%] w-[75.5%] w-[75.6%] w-[75.7%] w-[75.8%] w-[75.9%] w-[76%] w-[76.1%] w-[76.2%] w-[76.3%] w-[76.4%] w-[76.5%] w-[76.6%] w-[76.7%] w-[76.8%] w-[76.9%] w-[77%] w-[77.1%] w-[77.2%] w-[77.3%] w-[77.4%] w-[77.5%] w-[77.6%] w-[77.7%] w-[77.8%] w-[77.9%] w-[78%] w-[78.1%] w-[78.2%] w-[78.3%] w-[78.4%] w-[78.5%] w-[78.6%] w-[78.7%] w-[78.8%] w-[78.9%] w-[79%] w-[79.1%] w-[79.2%] w-[79.3%] w-[79.4%] w-[79.5%] w-[79.6%] w-[79.7%] w-[79.8%] w-[79.9%] w-[80%] w-[80.1%] w-[80.2%] w-[80.3%] w-[80.4%] w-[80.5%] w-[80.6%] w-[80.7%] w-[80.8%] w-[80.9%] w-[81%] w-[81.1%] w-[81.2%] w-[81.3%] w-[81.4%] w-[81.5%] w-[81.6%] w-[81.7%] w-[81.8%] w-[81.9%] w-[82%] w-[82.1%] w-[82.2%] w-[82.3%] w-[82.4%] w-[82.5%] w-[82.6%] w-[82.7%] w-[82.8%] w-[82.9%] w-[83%] w-[83.1%] w-[83.2%] w-[83.3%] w-[83.4%] w-[83.5%] w-[83.6%] w-[83.7%] w-[83.8%] w-[83.9%] w-[84%] w-[84.1%] w-[84.2%] w-[84.3%] w-[84.4%] w-[84.5%] w-[84.6%] w-[84.7%] w-[84.8%] w-[84.9%] w-[85%] w-[85.1%] w-[85.2%] w-[85.3%] w-[85.4%] w-[85.5%] w-[85.6%] w-[85.7%] w-[85.8%] w-[85.9%] w-[86%] w-[86.1%] w-[86.2%] w-[86.3%] w-[86.4%] w-[86.5%] w-[86.6%] w-[86.7%] w-[86.8%] w-[86.9%] w-[87%] w-[87.1%] w-[87.2%] w-[87.3%] w-[87.4%] w-[87.5%] w-[87.6%] w-[87.7%] w-[87.8%] w-[87.9%] w-[88%] w-[88.1%] w-[88.2%] w-[88.3%] w-[88.4%] w-[88.5%] w-[88.6%] w-[88.7%] w-[88.8%] w-[88.9%] w-[89%] w-[89.1%] w-[89.2%] w-[89.3%] w-[89.4%] w-[89.5%] w-[89.6%] w-[89.7%] w-[89.8%] w-[89.9%] w-[90%] w-[90.1%] w-[90.2%] w-[90.3%] w-[90.4%] w-[90.5%] w-[90.6%] w-[90.7%] w-[90.8%] w-[90.9%] w-[91%] w-[91.1%] w-[91.2%] w-[91.3%] w-[91.4%] w-[91.5%] w-[91.6%] w-[91.7%] w-[91.8%] w-[91.9%] w-[92%] w-[92.1%] w-[92.2%] w-[92.3%] w-[92.4%] w-[92.5%] w-[92.6%] w-[92.7%] w-[92.8%] w-[92.9%] w-[93%] w-[93.1%] w-[93.2%] w-[93.3%] w-[93.4%] w-[93.5%] w-[93.6%] w-[93.7%] w-[93.8%] w-[93.9%] w-[94%] w-[94.1%] w-[94.2%] w-[94.3%] w-[94.4%] w-[94.5%] w-[94.6%] w-[94.7%] w-[94.8%] w-[94.9%] w-[95%] w-[95.1%] w-[95.2%] w-[95.3%] w-[95.4%] w-[95.5%] w-[95.6%] w-[95.7%] w-[95.8%] w-[95.9%] w-[96%] w-[96.1%] w-[96.2%] w-[96.3%] w-[96.4%] w-[96.5%] w-[96.6%] w-[96.7%] w-[96.8%] w-[96.9%] w-[97%] w-[97.1%] w-[97.2%] w-[97.3%] w-[97.4%] w-[97.5%] w-[97.6%] w-[97.7%] w-[97.8%] w-[97.9%] w-[98%] w-[98.1%] w-[98.2%] w-[98.3%] w-[98.4%] w-[98.5%] w-[98.6%] w-[98.7%] w-[98.8%] w-[98.9%] w-[99%] w-[99.1%] w-[99.2%] w-[99.3%] w-[99.4%] w-[99.5%] w-[99.6%] w-[99.7%] w-[99.8%] w-[99.9%] w-[100%] '></div>
      <div className='h-[0%] h-[0.1%] h-[0.2%] h-[0.3%] h-[0.4%] h-[0.5%] h-[0.6%] h-[0.7%] h-[0.8%] h-[0.9%] h-[1%] h-[1.1%] h-[1.2%] h-[1.3%] h-[1.4%] h-[1.5%] h-[1.6%] h-[1.7%] h-[1.8%] h-[1.9%] h-[2%] h-[2.1%] h-[2.2%] h-[2.3%] h-[2.4%] h-[2.5%] h-[2.6%] h-[2.7%] h-[2.8%] h-[2.9%] h-[3%] h-[3.1%] h-[3.2%] h-[3.3%] h-[3.4%] h-[3.5%] h-[3.6%] h-[3.7%] h-[3.8%] h-[3.9%] h-[4%] h-[4.1%] h-[4.2%] h-[4.3%] h-[4.4%] h-[4.5%] h-[4.6%] h-[4.7%] h-[4.8%] h-[4.9%] h-[5%] h-[5.1%] h-[5.2%] h-[5.3%] h-[5.4%] h-[5.5%] h-[5.6%] h-[5.7%] h-[5.8%] h-[5.9%] h-[6%] h-[6.1%] h-[6.2%] h-[6.3%] h-[6.4%] h-[6.5%] h-[6.6%] h-[6.7%] h-[6.8%] h-[6.9%] h-[7%] h-[7.1%] h-[7.2%] h-[7.3%] h-[7.4%] h-[7.5%] h-[7.6%] h-[7.7%] h-[7.8%] h-[7.9%] h-[8%] h-[8.1%] h-[8.2%] h-[8.3%] h-[8.4%] h-[8.5%] h-[8.6%] h-[8.7%] h-[8.8%] h-[8.9%] h-[9%] h-[9.1%] h-[9.2%] h-[9.3%] h-[9.4%] h-[9.5%] h-[9.6%] h-[9.7%] h-[9.8%] h-[9.9%] h-[10%] h-[10.1%] h-[10.2%] h-[10.3%] h-[10.4%] h-[10.5%] h-[10.6%] h-[10.7%] h-[10.8%] h-[10.9%] h-[11%] h-[11.1%] h-[11.2%] h-[11.3%] h-[11.4%] h-[11.5%] h-[11.6%] h-[11.7%] h-[11.8%] h-[11.9%] h-[12%] h-[12.1%] h-[12.2%] h-[12.3%] h-[12.4%] h-[12.5%] h-[12.6%] h-[12.7%] h-[12.8%] h-[12.9%] h-[13%] h-[13.1%] h-[13.2%] h-[13.3%] h-[13.4%] h-[13.5%] h-[13.6%] h-[13.7%] h-[13.8%] h-[13.9%] h-[14%] h-[14.1%] h-[14.2%] h-[14.3%] h-[14.4%] h-[14.5%] h-[14.6%] h-[14.7%] h-[14.8%] h-[14.9%] h-[15%] h-[15.1%] h-[15.2%] h-[15.3%] h-[15.4%] h-[15.5%] h-[15.6%] h-[15.7%] h-[15.8%] h-[15.9%] h-[16%] h-[16.1%] h-[16.2%] h-[16.3%] h-[16.4%] h-[16.5%] h-[16.6%] h-[16.7%] h-[16.8%] h-[16.9%] h-[17%] h-[17.1%] h-[17.2%] h-[17.3%] h-[17.4%] h-[17.5%] h-[17.6%] h-[17.7%] h-[17.8%] h-[17.9%] h-[18%] h-[18.1%] h-[18.2%] h-[18.3%] h-[18.4%] h-[18.5%] h-[18.6%] h-[18.7%] h-[18.8%] h-[18.9%] h-[19%] h-[19.1%] h-[19.2%] h-[19.3%] h-[19.4%] h-[19.5%] h-[19.6%] h-[19.7%] h-[19.8%] h-[19.9%] h-[20%] h-[20.1%] h-[20.2%] h-[20.3%] h-[20.4%] h-[20.5%] h-[20.6%] h-[20.7%] h-[20.8%] h-[20.9%] h-[21%] h-[21.1%] h-[21.2%] h-[21.3%] h-[21.4%] h-[21.5%] h-[21.6%] h-[21.7%] h-[21.8%] h-[21.9%] h-[22%] h-[22.1%] h-[22.2%] h-[22.3%] h-[22.4%] h-[22.5%] h-[22.6%] h-[22.7%] h-[22.8%] h-[22.9%] h-[23%] h-[23.1%] h-[23.2%] h-[23.3%] h-[23.4%] h-[23.5%] h-[23.6%] h-[23.7%] h-[23.8%] h-[23.9%] h-[24%] h-[24.1%] h-[24.2%] h-[24.3%] h-[24.4%] h-[24.5%] h-[24.6%] h-[24.7%] h-[24.8%] h-[24.9%] h-[25%] h-[25.1%] h-[25.2%] h-[25.3%] h-[25.4%] h-[25.5%] h-[25.6%] h-[25.7%] h-[25.8%] h-[25.9%] h-[26%] h-[26.1%] h-[26.2%] h-[26.3%] h-[26.4%] h-[26.5%] h-[26.6%] h-[26.7%] h-[26.8%] h-[26.9%] h-[27%] h-[27.1%] h-[27.2%] h-[27.3%] h-[27.4%] h-[27.5%] h-[27.6%] h-[27.7%] h-[27.8%] h-[27.9%] h-[28%] h-[28.1%] h-[28.2%] h-[28.3%] h-[28.4%] h-[28.5%] h-[28.6%] h-[28.7%] h-[28.8%] h-[28.9%] h-[29%] h-[29.1%] h-[29.2%] h-[29.3%] h-[29.4%] h-[29.5%] h-[29.6%] h-[29.7%] h-[29.8%] h-[29.9%] h-[30%] h-[30.1%] h-[30.2%] h-[30.3%] h-[30.4%] h-[30.5%] h-[30.6%] h-[30.7%] h-[30.8%] h-[30.9%] h-[31%] h-[31.1%] h-[31.2%] h-[31.3%] h-[31.4%] h-[31.5%] h-[31.6%] h-[31.7%] h-[31.8%] h-[31.9%] h-[32%] h-[32.1%] h-[32.2%] h-[32.3%] h-[32.4%] h-[32.5%] h-[32.6%] h-[32.7%] h-[32.8%] h-[32.9%] h-[33%] h-[33.1%] h-[33.2%] h-[33.3%] h-[33.4%] h-[33.5%] h-[33.6%] h-[33.7%] h-[33.8%] h-[33.9%] h-[34%] h-[34.1%] h-[34.2%] h-[34.3%] h-[34.4%] h-[34.5%] h-[34.6%] h-[34.7%] h-[34.8%] h-[34.9%] h-[35%] h-[35.1%] h-[35.2%] h-[35.3%] h-[35.4%] h-[35.5%] h-[35.6%] h-[35.7%] h-[35.8%] h-[35.9%] h-[36%] h-[36.1%] h-[36.2%] h-[36.3%] h-[36.4%] h-[36.5%] h-[36.6%] h-[36.7%] h-[36.8%] h-[36.9%] h-[37%] h-[37.1%] h-[37.2%] h-[37.3%] h-[37.4%] h-[37.5%] h-[37.6%] h-[37.7%] h-[37.8%] h-[37.9%] h-[38%] h-[38.1%] h-[38.2%] h-[38.3%] h-[38.4%] h-[38.5%] h-[38.6%] h-[38.7%] h-[38.8%] h-[38.9%] h-[39%] h-[39.1%] h-[39.2%] h-[39.3%] h-[39.4%] h-[39.5%] h-[39.6%] h-[39.7%] h-[39.8%] h-[39.9%] h-[40%] h-[40.1%] h-[40.2%] h-[40.3%] h-[40.4%] h-[40.5%] h-[40.6%] h-[40.7%] h-[40.8%] h-[40.9%] h-[41%] h-[41.1%] h-[41.2%] h-[41.3%] h-[41.4%] h-[41.5%] h-[41.6%] h-[41.7%] h-[41.8%] h-[41.9%] h-[42%] h-[42.1%] h-[42.2%] h-[42.3%] h-[42.4%] h-[42.5%] h-[42.6%] h-[42.7%] h-[42.8%] h-[42.9%] h-[43%] h-[43.1%] h-[43.2%] h-[43.3%] h-[43.4%] h-[43.5%] h-[43.6%] h-[43.7%] h-[43.8%] h-[43.9%] h-[44%] h-[44.1%] h-[44.2%] h-[44.3%] h-[44.4%] h-[44.5%] h-[44.6%] h-[44.7%] h-[44.8%] h-[44.9%] h-[45%] h-[45.1%] h-[45.2%] h-[45.3%] h-[45.4%] h-[45.5%] h-[45.6%] h-[45.7%] h-[45.8%] h-[45.9%] h-[46%] h-[46.1%] h-[46.2%] h-[46.3%] h-[46.4%] h-[46.5%] h-[46.6%] h-[46.7%] h-[46.8%] h-[46.9%] h-[47%] h-[47.1%] h-[47.2%] h-[47.3%] h-[47.4%] h-[47.5%] h-[47.6%] h-[47.7%] h-[47.8%] h-[47.9%] h-[48%] h-[48.1%] h-[48.2%] h-[48.3%] h-[48.4%] h-[48.5%] h-[48.6%] h-[48.7%] h-[48.8%] h-[48.9%] h-[49%] h-[49.1%] h-[49.2%] h-[49.3%] h-[49.4%] h-[49.5%] h-[49.6%] h-[49.7%] h-[49.8%] h-[49.9%] h-[50%] h-[50.1%] h-[50.2%] h-[50.3%] h-[50.4%] h-[50.5%] h-[50.6%] h-[50.7%] h-[50.8%] h-[50.9%] h-[51%] h-[51.1%] h-[51.2%] h-[51.3%] h-[51.4%] h-[51.5%] h-[51.6%] h-[51.7%] h-[51.8%] h-[51.9%] h-[52%] h-[52.1%] h-[52.2%] h-[52.3%] h-[52.4%] h-[52.5%] h-[52.6%] h-[52.7%] h-[52.8%] h-[52.9%] h-[53%] h-[53.1%] h-[53.2%] h-[53.3%] h-[53.4%] h-[53.5%] h-[53.6%] h-[53.7%] h-[53.8%] h-[53.9%] h-[54%] h-[54.1%] h-[54.2%] h-[54.3%] h-[54.4%] h-[54.5%] h-[54.6%] h-[54.7%] h-[54.8%] h-[54.9%] h-[55%] h-[55.1%] h-[55.2%] h-[55.3%] h-[55.4%] h-[55.5%] h-[55.6%] h-[55.7%] h-[55.8%] h-[55.9%] h-[56%] h-[56.1%] h-[56.2%] h-[56.3%] h-[56.4%] h-[56.5%] h-[56.6%] h-[56.7%] h-[56.8%] h-[56.9%] h-[57%] h-[57.1%] h-[57.2%] h-[57.3%] h-[57.4%] h-[57.5%] h-[57.6%] h-[57.7%] h-[57.8%] h-[57.9%] h-[58%] h-[58.1%] h-[58.2%] h-[58.3%] h-[58.4%] h-[58.5%] h-[58.6%] h-[58.7%] h-[58.8%] h-[58.9%] h-[59%] h-[59.1%] h-[59.2%] h-[59.3%] h-[59.4%] h-[59.5%] h-[59.6%] h-[59.7%] h-[59.8%] h-[59.9%] h-[60%] h-[60.1%] h-[60.2%] h-[60.3%] h-[60.4%] h-[60.5%] h-[60.6%] h-[60.7%] h-[60.8%] h-[60.9%] h-[61%] h-[61.1%] h-[61.2%] h-[61.3%] h-[61.4%] h-[61.5%] h-[61.6%] h-[61.7%] h-[61.8%] h-[61.9%] h-[62%] h-[62.1%] h-[62.2%] h-[62.3%] h-[62.4%] h-[62.5%] h-[62.6%] h-[62.7%] h-[62.8%] h-[62.9%] h-[63%] h-[63.1%] h-[63.2%] h-[63.3%] h-[63.4%] h-[63.5%] h-[63.6%] h-[63.7%] h-[63.8%] h-[63.9%] h-[64%] h-[64.1%] h-[64.2%] h-[64.3%] h-[64.4%] h-[64.5%] h-[64.6%] h-[64.7%] h-[64.8%] h-[64.9%] h-[65%] h-[65.1%] h-[65.2%] h-[65.3%] h-[65.4%] h-[65.5%] h-[65.6%] h-[65.7%] h-[65.8%] h-[65.9%] h-[66%] h-[66.1%] h-[66.2%] h-[66.3%] h-[66.4%] h-[66.5%] h-[66.6%] h-[66.7%] h-[66.8%] h-[66.9%] h-[67%] h-[67.1%] h-[67.2%] h-[67.3%] h-[67.4%] h-[67.5%] h-[67.6%] h-[67.7%] h-[67.8%] h-[67.9%] h-[68%] h-[68.1%] h-[68.2%] h-[68.3%] h-[68.4%] h-[68.5%] h-[68.6%] h-[68.7%] h-[68.8%] h-[68.9%] h-[69%] h-[69.1%] h-[69.2%] h-[69.3%] h-[69.4%] h-[69.5%] h-[69.6%] h-[69.7%] h-[69.8%] h-[69.9%] h-[70%] h-[70.1%] h-[70.2%] h-[70.3%] h-[70.4%] h-[70.5%] h-[70.6%] h-[70.7%] h-[70.8%] h-[70.9%] h-[71%] h-[71.1%] h-[71.2%] h-[71.3%] h-[71.4%] h-[71.5%] h-[71.6%] h-[71.7%] h-[71.8%] h-[71.9%] h-[72%] h-[72.1%] h-[72.2%] h-[72.3%] h-[72.4%] h-[72.5%] h-[72.6%] h-[72.7%] h-[72.8%] h-[72.9%] h-[73%] h-[73.1%] h-[73.2%] h-[73.3%] h-[73.4%] h-[73.5%] h-[73.6%] h-[73.7%] h-[73.8%] h-[73.9%] h-[74%] h-[74.1%] h-[74.2%] h-[74.3%] h-[74.4%] h-[74.5%] h-[74.6%] h-[74.7%] h-[74.8%] h-[74.9%] h-[75%] h-[75.1%] h-[75.2%] h-[75.3%] h-[75.4%] h-[75.5%] h-[75.6%] h-[75.7%] h-[75.8%] h-[75.9%] h-[76%] h-[76.1%] h-[76.2%] h-[76.3%] h-[76.4%] h-[76.5%] h-[76.6%] h-[76.7%] h-[76.8%] h-[76.9%] h-[77%] h-[77.1%] h-[77.2%] h-[77.3%] h-[77.4%] h-[77.5%] h-[77.6%] h-[77.7%] h-[77.8%] h-[77.9%] h-[78%] h-[78.1%] h-[78.2%] h-[78.3%] h-[78.4%] h-[78.5%] h-[78.6%] h-[78.7%] h-[78.8%] h-[78.9%] h-[79%] h-[79.1%] h-[79.2%] h-[79.3%] h-[79.4%] h-[79.5%] h-[79.6%] h-[79.7%] h-[79.8%] h-[79.9%] h-[80%] h-[80.1%] h-[80.2%] h-[80.3%] h-[80.4%] h-[80.5%] h-[80.6%] h-[80.7%] h-[80.8%] h-[80.9%] h-[81%] h-[81.1%] h-[81.2%] h-[81.3%] h-[81.4%] h-[81.5%] h-[81.6%] h-[81.7%] h-[81.8%] h-[81.9%] h-[82%] h-[82.1%] h-[82.2%] h-[82.3%] h-[82.4%] h-[82.5%] h-[82.6%] h-[82.7%] h-[82.8%] h-[82.9%] h-[83%] h-[83.1%] h-[83.2%] h-[83.3%] h-[83.4%] h-[83.5%] h-[83.6%] h-[83.7%] h-[83.8%] h-[83.9%] h-[84%] h-[84.1%] h-[84.2%] h-[84.3%] h-[84.4%] h-[84.5%] h-[84.6%] h-[84.7%] h-[84.8%] h-[84.9%] h-[85%] h-[85.1%] h-[85.2%] h-[85.3%] h-[85.4%] h-[85.5%] h-[85.6%] h-[85.7%] h-[85.8%] h-[85.9%] h-[86%] h-[86.1%] h-[86.2%] h-[86.3%] h-[86.4%] h-[86.5%] h-[86.6%] h-[86.7%] h-[86.8%] h-[86.9%] h-[87%] h-[87.1%] h-[87.2%] h-[87.3%] h-[87.4%] h-[87.5%] h-[87.6%] h-[87.7%] h-[87.8%] h-[87.9%] h-[88%] h-[88.1%] h-[88.2%] h-[88.3%] h-[88.4%] h-[88.5%] h-[88.6%] h-[88.7%] h-[88.8%] h-[88.9%] h-[89%] h-[89.1%] h-[89.2%] h-[89.3%] h-[89.4%] h-[89.5%] h-[89.6%] h-[89.7%] h-[89.8%] h-[89.9%] h-[90%] h-[90.1%] h-[90.2%] h-[90.3%] h-[90.4%] h-[90.5%] h-[90.6%] h-[90.7%] h-[90.8%] h-[90.9%] h-[91%] h-[91.1%] h-[91.2%] h-[91.3%] h-[91.4%] h-[91.5%] h-[91.6%] h-[91.7%] h-[91.8%] h-[91.9%] h-[92%] h-[92.1%] h-[92.2%] h-[92.3%] h-[92.4%] h-[92.5%] h-[92.6%] h-[92.7%] h-[92.8%] h-[92.9%] h-[93%] h-[93.1%] h-[93.2%] h-[93.3%] h-[93.4%] h-[93.5%] h-[93.6%] h-[93.7%] h-[93.8%] h-[93.9%] h-[94%] h-[94.1%] h-[94.2%] h-[94.3%] h-[94.4%] h-[94.5%] h-[94.6%] h-[94.7%] h-[94.8%] h-[94.9%] h-[95%] h-[95.1%] h-[95.2%] h-[95.3%] h-[95.4%] h-[95.5%] h-[95.6%] h-[95.7%] h-[95.8%] h-[95.9%] h-[96%] h-[96.1%] h-[96.2%] h-[96.3%] h-[96.4%] h-[96.5%] h-[96.6%] h-[96.7%] h-[96.8%] h-[96.9%] h-[97%] h-[97.1%] h-[97.2%] h-[97.3%] h-[97.4%] h-[97.5%] h-[97.6%] h-[97.7%] h-[97.8%] h-[97.9%] h-[98%] h-[98.1%] h-[98.2%] h-[98.3%] h-[98.4%] h-[98.5%] h-[98.6%] h-[98.7%] h-[98.8%] h-[98.9%] h-[99%] h-[99.1%] h-[99.2%] h-[99.3%] h-[99.4%] h-[99.5%] h-[99.6%] h-[99.7%] h-[99.8%] h-[99.9%] h-[100%] '></div>
      <section className='bg-dark min-w-screen min-h-screen py-4 mx-auto text-white xl:w-[1280px]'>
        <Header passport={{ authData: authData, setUser: handleSearch }} />
        <section className='w-full mt-4 px-4'>
          <div className='w-full rounded-2xl bg-dark2 px-4 sm:px-8 py-4 sm:py-6'>
            <div className='text-3xl font-bold'>Статистика</div>
            <div className='flex gap-2 mt-2 justify-center'>
              <div className='flex flex-col bg-dark4 rounded-2xl p-2'>
                <p>Безработица</p>
                <div className='flex h-[200px] items-end gap-2'>
                  <div className={'px-4 rounded-2xl flex items-end bg-green-500 h-[' + Math.round(((activeUsers?.length - jUsers?.length) / activeUsers?.length) * 100) + "%]"}>{(((activeUsers?.length - jUsers?.length) / activeUsers?.length) * 100).toFixed(2)}%</div>
                  <div className='h-[6%] px-4 rounded-2xl flex items-end bg-yellow-500 cursor-pointer'>6%</div>
                </div>
              </div>
              <div className='flex flex-col bg-dark4 rounded-2xl p-2'>
                <p>Количество граждан (по годам)</p>
                <div className='flex h-[200px] items-end gap-2'>
                  <div className='h-[100%] px-4 rounded-2xl flex items-end bg-green-500 cursor-pointer' title='2021 год (реальные показатели)'>57</div>
                  <div className='h-[87%] px-4 rounded-2xl flex items-end bg-yellow-500 cursor-pointer' title='2021 год (ожидаемые показатели)'>50</div>
                  <div className='h-[30%] px-4 rounded-2xl flex items-end bg-red-500 cursor-pointer' title='2022 год (реальные показатели)'>15</div>
                  <div className='h-[100%] px-4 rounded-2xl flex items-end bg-yellow-500 cursor-pointer' title='2022 год (ожидаемые показатели)'>50</div>
                  <div className={'px-4 rounded-2xl flex items-end cursor-pointer h-[' + (Math.round(activeUsers?.length / 40 * 100)) + "%] " + (activeUsers?.length > 50 ? "bg-green-500" : "bg-red-500")} title='2023 год (реальные показатели)'>{activeUsers?.length}</div>
                  <div className='h-[100%] px-4 rounded-2xl flex items-end bg-yellow-500 cursor-pointer' title='2023 год (ожидаемые показатели)'>40</div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className='px-4 mt-4'>
          <div className='flex gap-4 mt-4 flex-col md:flex-row'>
            <AdminList passport={{ authData: authData, menu: menu1, setMenu: setMenu1, setUserData: setUserData, setCurrentID: setCurrentID, setUserByPassID: setUserByPassID }} />
            {userData?.id == null && !(authData?.roles?.includes(6)) && loaded ? <div className='w-full hidden md:flex gap-4 flex-col'>
              <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                <div className='flex justify-between items-center mb-4 select-none flex-col md:flex-row'>
                  <div className='text-3xl font-bold flex items-center gap-2'>Паспортные данные {userData?.status == 1 && userData?.preStatus == null ? <span className='rounded-md bg-green-500 text-base px-1 h-fit'>Активно</span> : null}{userData?.status == 1 && userData?.preStatus == 1 ? <span className='rounded-md bg-green-500 text-base px-1 h-fit bg-opacity-50 text-opacity-50'>Активно</span> : null}{userData?.status == 0 || (userData?.status == 2 && userData?.preStatus == null) ? <span className='rounded-md bg-yellow-500 text-base px-1 h-fit'>На рассмотрении</span> : null}{userData?.status == 2 && userData?.preStatus != null ? <span className='rounded-md bg-purple-500 text-base px-1 h-fit'>Приостановлено</span> : null}{userData?.status == 3 ? <span className='rounded-md bg-red-500 text-base px-1 h-fit'>Изъято</span> : null}</div>
                </div>
                <div className='grid grid-cols-2 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Никнейм</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input1} onChange={(e) => {
                        setInput1(e.target.value)
                      }} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Псевдоним</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input2} onChange={(e) => {
                        setInput2(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-2 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Дата рождения</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input3} onChange={(e) => {
                        setInput3(e.target.value)
                      }} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Telegram</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input4} onChange={(e) => {
                        setInput4(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-2 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>ID <span className='cursor-pointer bg-dark4 p-1 rounded-md select-none' onClick={() => setGID(makeid2(6))}>REGEN</span></div>
                    {gID == null ? <div className='p-2 font-bold bg-dark4 hover:bg-dark3 cursor-pointer rounded-2xl w-fit' onClick={() => {
                      setGID(makeid2(6))
                    }}>Сгенерировать</div> : <div className='text-xl md:text-2xl font-bold uppercase'>LGS-{gID}</div>}
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Выдан кем</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input5} onChange={(e) => {
                        setInput5(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-2 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Дата выдачи</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input6} onChange={(e) => {
                        setInput6(e.target.value)
                      }} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Действителен до</div>
                    <div className='flex gap-2'>
                      <input defaultValue={"10.06.2025"} className='bg-dark2 border-dark3 border rounded-2xl' value={input7} onChange={(e) => {
                        setInput7(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                    createAccount();
                    alert("Успех!")
                  }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                </div>
              </div>
            </div> : null}
            {userData?.id != null ? <div className='w-full hidden md:flex gap-4 flex-col'>
              {!(authData?.roles?.includes(6)) ?
                <>
                  <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                    <div className='flex justify-between items-center mb-4 select-none flex-col md:flex-row'>
                      <div className='text-3xl font-bold flex items-center gap-2'>Паспортные данные {userData?.status == 1 && userData?.preStatus == null ? <span className='rounded-md bg-green-500 text-base px-1 h-fit'>Активно</span> : null}{userData?.status == 1 && userData?.preStatus == 1 ? <span className='rounded-md bg-green-500 text-base px-1 h-fit bg-opacity-50 text-opacity-50'>Активно</span> : null}{userData?.status == 0 || (userData?.status == 2 && userData?.preStatus == null) ? <span className='rounded-md bg-yellow-500 text-base px-1 h-fit'>На рассмотрении</span> : null}{userData?.status == 2 && userData?.preStatus != null ? <span className='rounded-md bg-purple-500 text-base px-1 h-fit'>Приостановлено</span> : null}{userData?.status == 3 ? <span className='rounded-md bg-red-500 text-base px-1 h-fit'>Изъято</span> : null}</div>
                    </div>
                    <div className='flex justify-center w-full'>
                      <div className='mb-4 flex justify-center gap-2 bg-dark4 rounded-2xl w-fit p-2 items-center'>
                        <div className={'bg-green-500 hover:bg-green-600 cursor-pointer rounded-md h-fit px-1 hover:py-1' + (userData?.status == 1 ? " py-1" : null)} onClick={() => {
                          applyStatus(1);
                        }}>Активно</div>
                        <div className={'bg-purple-500 hover:bg-purple-600 cursor-pointer rounded-md h-fit px-1 hover:py-1' + (userData?.status == 2 ? " py-1" : null)} onClick={() => {
                          applyStatus(2);
                        }}>Приостановлено</div>
                        <div className={'bg-red-500 hover:bg-red-600 cursor-pointer rounded-md h-fit px-1 hover:py-1' + (userData?.status == 3 ? " py-1" : null)} onClick={() => {
                          applyStatus(3);
                        }}>Изъято</div>
                        <div className={'bg-yellow-500 hover:bg-yellow-600 cursor-pointer rounded-md h-fit px-1 hover:py-1' + (userData?.status == 0 ? " py-1" : null)} onClick={() => {
                          applyStatus(0);
                        }}>На рассмотрении</div>
                        <div className={'bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-md h-fit px-1 hover:py-1' + (userData?.status == 4 ? " py-1" : null)} onClick={() => {
                          applyStatus(4);
                        }}>Турвиза</div>
                        <div className={'bg-red-800 hover:bg-red-900 cursor-pointer rounded-md h-fit px-1 hover:py-1' + (userData?.status == 5 ? " py-1" : null)} onClick={() => {
                          applyStatus(5);
                        }}>Запрет на въезд</div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 mb-4'>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Никнейм</div>
                        <div className='flex gap-2'>
                          <input placeholder={userData?.nickname} className='bg-dark2 border-dark3 border rounded-2xl' value={input1} onChange={(e) => {
                            setInput1(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput1();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Псевдоним</div>
                        <div className='flex gap-2'>
                          <input placeholder={userData?.surname} className='bg-dark2 border-dark3 border rounded-2xl' value={input2} onChange={(e) => {
                            setInput2(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput2();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 mb-4'>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Дата рождения</div>
                        <div className='flex gap-2'>
                          <input placeholder={userData?.birthdate} className='bg-dark2 border-dark3 border rounded-2xl' value={input3} onChange={(e) => {
                            setInput3(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput3();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Telegram</div>
                        <div className='flex gap-2'>
                          <input placeholder={userData?.tg} className='bg-dark2 border-dark3 border rounded-2xl' value={input4} onChange={(e) => {
                            setInput4(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput4();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2 mb-4'>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>ID</div>
                        <div className='text-xl md:text-2xl font-bold uppercase'>{userData?.passid}</div>
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Выдан кем</div>
                        <div className='flex gap-2'>
                          <input placeholder={userData?.issuedby} className='bg-dark2 border-dark3 border rounded-2xl' value={input5} onChange={(e) => {
                            setInput5(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput5();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-cols-2'>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Дата выдачи</div>
                        <div className='flex gap-2'>
                          <input placeholder={userData?.dateofissue} className='bg-dark2 border-dark3 border rounded-2xl' value={input6} onChange={(e) => {
                            setInput6(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput6();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Действителен до</div>
                        <div className='flex gap-2'>
                          <input placeholder={userData?.validuntil} className='bg-dark2 border-dark3 border rounded-2xl' value={input7} onChange={(e) => {
                            setInput7(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput7();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                    <div className='text-3xl font-bold flex items-center gap-2'>Социальный рейтинг</div>
                    <div className={'mt-2 text-lg text-start font-bold' + (userData?.rating > 0 ? " text-green-500" : " text-red-500")}>{userData?.rating}</div>
                    <div className='flex w-full bg-zinc-400 rounded-2xl bg-opacity-20'>
                      <div className='flex w-full justify-start'><div className={'h-2 rounded-l-2xl w-[' + (Math.abs(userData?.rating) / 10) + "%] " + (userData?.rating > 0 ? "bg-green-500" : "bg-red-500")}></div></div>
                    </div>
                    <div className='grid grid-cols-6 w-full gap-2 mt-2'>
                      <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating + 1)
                      }}>+1</div>
                      <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating + 5)
                      }}>+5</div>
                      <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating + 10)
                      }}>+10</div>
                      <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating + 20)
                      }}>+20</div>
                      <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating + 50)
                      }}>+50</div>
                      <div className='bg-green-500 rounded-md py-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating + 100)
                      }}>+100</div>
                    </div>
                    <div className='grid grid-cols-6 w-full gap-2 mt-2'>
                      <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating - 1)
                      }}>-1</div>
                      <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating - 5)
                      }}>-5</div>
                      <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating - 10)
                      }}>-10</div>
                      <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating - 20)
                      }}>-20</div>
                      <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating - 50)
                      }}>-50</div>
                      <div className='bg-red-500 rounded-md py-1 cursor-pointer flex justify-center' onClick={() => {
                        applyRating(userData?.rating - 100)
                      }}>-100</div>
                    </div>
                  </div>
                  <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                    <div className='text-3xl font-bold flex items-center gap-2'>Лайки</div>
                    <div className=''>{userData?.likes?.map((e: any) => e + " ")}</div>
                  </div>
                  <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                    <div className='text-3xl font-bold flex items-center gap-2 mb-4'>Приглашения</div>
                    <div className='flex flex-col gap-2'>
                      {iUsers?.map((e: any) =>
                        <div key={makeid(10)} className='flex gap-2 items-center hover:bg-dark3 rounded-2xl cursor-pointer' onClick={() => {
                          setCurrentID(e?.id)
                          setUserByPassID(e?.passid)
                        }}>
                          <NextImage alt='profile avatar' width={48} height={48} onError={(e) => {
                            e.currentTarget.srcset = "/Steve.webp";
                          }} src={'https://avatar.spworlds.ru/face/512/' + (e?.nickname)} />
                          <div className='text-xl font-bold'>{e?.nickname}</div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                    <div className='text-3xl font-bold flex items-center gap-2 mb-4'>Розыск</div>
                    <div className='flex flex-col gap-2'>
                      <div className='flex justify-between'>
                        <div className='text-lg'>В розыске</div>
                        <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (wanted ? " bg-green-500" : " bg-dark4")} onClick={() => {
                          applyWanted(!wanted);
                        }}></div>
                      </div>
                      <div className='flex flex-col gap-0.5'>
                        <div className='text-lg text-zinc-400'>Цена головы))</div>
                        <div className='flex gap-2'>
                          <input className='bg-dark2 border-dark3 border rounded-2xl' value={input8} onChange={(e) => {
                            setInput8(e.target.value)
                          }} />
                          <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                            applyInput8();
                          }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </> : null}
              <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                <div className='text-3xl font-bold flex items-center gap-2 mb-4'>Труд</div>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between'>
                    <div className='text-lg'>Статус разнорабочего</div>
                    <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (job == "Разнорабочий" ? " bg-green-500" : " bg-dark4")} onClick={() => {
                      applyJob(job == "Разнорабочий" ? null : "Разнорабочий");
                    }}></div>
                  </div>
                  <div className='text-lg p-2 bg-blue-500 hover:bg-blue-600 cursor-pointer rounded-2xl w-fit select-none'>Подтвердить</div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Профессия</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input9} onChange={(e) => {
                        setInput9(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput9();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                      <div className='ml-8 flex items-center'>Профессия: {userData?.job}</div>
                    </div>
                  </div>
                </div>
              </div>
              {!(authData?.roles?.includes(6)) ?
                <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                  <div className='text-3xl font-bold flex items-center gap-2'>Управление</div>
                  <div className='flex flex-col gap-2 px-8 py-6 bg-dark rounded-2xl mt-2'>
                    <div className='text-xl font-bold mb-2'>Управление наградами</div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Иноагент</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (inoagent ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyInoagent(!inoagent);
                      }}></div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Герой Авинесии</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (hero ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyHero(!hero);
                      }}></div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Герой труда</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (work ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyWork(!work);
                      }}></div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Культура и образование</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (culture ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyCulture(!culture);
                      }}></div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Мир</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (peace ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyPeace(!peace);
                      }}></div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Агент в народе</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (donos ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyDonos(!donos);
                      }}></div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Активный челик</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (activer ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyActiver(!activer);
                      }}></div>
                    </div>
                    <div className='flex justify-between'>
                      <div className='text-lg'>Военная награда</div>
                      <div className={'w-4 h-4 cursor-pointer rounded-2xl' + (warrior ? " bg-green-500" : " bg-dark4")} onClick={() => {
                        applyWarrior(!warrior);
                      }}></div>
                    </div>
                  </div>
                  <div>Приглашен: {userData?.invitedby != null ? userData?.invitedby : "-"}</div>
                  <div className='mt-4 text-lg text-blue-500 hover:text-blue-600 cursor-pointer' onClick={() => {
                    genUrl();
                  }}>Сгенерировать и скопировать ссылку для входа</div>
                </div>
                : null}
            </div> : null}
            {userData?.id == null && !menu1 && !(authData?.roles?.includes(6)) && loaded ? <div className='w-full flex md:hidden gap-4 flex-col'>
              <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                <div className='flex items-center justify-between gap-2 mb-4 select-none'>
                  <div className='flex'>
                    <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                      setUserData({});
                      setMenu1(true);
                    }}><IoArrowBack color='black' size={28} /></div>
                  </div>
                  <div className='text-3xl font-bold flex items-center gap-2'>Паспортные данные {userData?.status == 1 && userData?.preStatus == null ? <span className='rounded-md bg-green-500 text-base px-1 h-fit'>Активно</span> : null}{userData?.status == 1 && userData?.preStatus == 1 ? <span className='rounded-md bg-green-500 text-base px-1 h-fit bg-opacity-50 text-opacity-50'>Активно</span> : null}{userData?.status == 0 || (userData?.status == 2 && userData?.preStatus == null) ? <span className='rounded-md bg-yellow-500 text-base px-1 h-fit'>На рассмотрении</span> : null}{userData?.status == 2 && userData?.preStatus != null ? <span className='rounded-md bg-purple-500 text-base px-1 h-fit'>Приостановлено</span> : null}{userData?.status == 3 ? <span className='rounded-md bg-red-500 text-base px-1 h-fit'>Изъято</span> : null}</div>
                </div>
                <div className='grid grid-cols-1 gap-4 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Никнейм</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input1} onChange={(e) => {
                        setInput1(e.target.value)
                      }} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Псевдоним</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input2} onChange={(e) => {
                        setInput2(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Дата рождения</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input3} onChange={(e) => {
                        setInput3(e.target.value)
                      }} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Telegram</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input4} onChange={(e) => {
                        setInput4(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>ID</div>
                    <div className='text-xl md:text-2xl font-bold uppercase'>LGS-{gID}</div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Выдан кем</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input5} onChange={(e) => {
                        setInput5(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Дата выдачи</div>
                    <div className='flex gap-2'>
                      <input className='bg-dark2 border-dark3 border rounded-2xl' value={input6} onChange={(e) => {
                        setInput6(e.target.value)
                      }} />
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Действителен до</div>
                    <div className='flex gap-2'>
                      <input defaultValue={"10.06.2025"} className='bg-dark2 border-dark3 border rounded-2xl' value={input7} onChange={(e) => {
                        setInput7(e.target.value)
                      }} />
                    </div>
                  </div>
                </div>
                <div className='flex justify-end'>
                  <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                    createAccount();
                    alert("Успех!")
                  }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                </div>
              </div>
            </div> : null}
            {userData?.id != null && !menu1 && !(authData?.roles?.includes(6)) && loaded ? <div className='w-full flex md:hidden gap-4 flex-col'>
              <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                <div className='flex items-center justify-between gap-2 mb-4 select-none'>
                  <div className='flex'>
                    <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                      setUserData({});
                      setMenu1(true);
                    }}><IoArrowBack color='black' size={28} /></div>
                  </div>
                  <div className='text-3xl font-bold flex items-center gap-2'>Паспортные данные {userData?.status == 1 && userData?.preStatus == null ? <span className='rounded-md bg-green-500 text-base px-1 h-fit'>Активно</span> : null}{userData?.status == 1 && userData?.preStatus == 1 ? <span className='rounded-md bg-green-500 text-base px-1 h-fit bg-opacity-50 text-opacity-50'>Активно</span> : null}{userData?.status == 0 || (userData?.status == 2 && userData?.preStatus == null) ? <span className='rounded-md bg-yellow-500 text-base px-1 h-fit'>На рассмотрении</span> : null}{userData?.status == 2 && userData?.preStatus != null ? <span className='rounded-md bg-purple-500 text-base px-1 h-fit'>Приостановлено</span> : null}{userData?.status == 3 ? <span className='rounded-md bg-red-500 text-base px-1 h-fit'>Изъято</span> : null}</div>
                </div>
                <div className='flex justify-center w-full'>
                  <div className='mb-4 flex justify-center flex-wrap gap-2 bg-dark4 rounded-2xl w-fit p-2 items-center'>
                    <div className={'bg-green-500 text-sm  hover:bg-green-600 cursor-pointer rounded-md p-1'} onClick={() => {
                      applyStatus(1);
                    }}>Активно</div>
                    <div className={'bg-purple-500 text-sm hover:bg-purple-600 cursor-pointer rounded-md p-1'} onClick={() => {
                      applyStatus(2);
                    }}>Приостановлено</div>
                    <div className={'bg-red-500 text-sm hover:bg-red-600 cursor-pointer rounded-md p-1'} onClick={() => {
                      applyStatus(3);
                    }}>Изъято</div>
                    <div className={'bg-yellow-500 text-sm hover:bg-yellow-600 cursor-pointer rounded-md p-1 text-center md:text-start'} onClick={() => {
                      applyStatus(0);
                    }}>На рассмотрении</div>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Никнейм</div>
                    <div className='flex gap-2'>
                      <input placeholder={userData?.nickname} className='bg-dark2 border-dark3 border rounded-2xl' value={input1} onChange={(e) => {
                        setInput1(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput1();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Псевдоним</div>
                    <div className='flex gap-2'>
                      <input placeholder={userData?.surname} className='bg-dark2 border-dark3 border rounded-2xl' value={input2} onChange={(e) => {
                        setInput2(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput2();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Дата рождения</div>
                    <div className='flex gap-2'>
                      <input placeholder={userData?.birthdate} className='bg-dark2 border-dark3 border rounded-2xl' value={input3} onChange={(e) => {
                        setInput3(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput3();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Telegram</div>
                    <div className='flex gap-2'>
                      <input placeholder={userData?.tg} className='bg-dark2 border-dark3 border rounded-2xl' value={input4} onChange={(e) => {
                        setInput4(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput4();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4 mb-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>ID</div>
                    <div className='text-xl md:text-2xl font-bold uppercase'>{userData?.passid}</div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Выдан кем</div>
                    <div className='flex gap-2'>
                      <input placeholder={userData?.issuedby} className='bg-dark2 border-dark3 border rounded-2xl' value={input5} onChange={(e) => {
                        setInput5(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput5();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-1 gap-4'>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Дата выдачи</div>
                    <div className='flex gap-2'>
                      <input placeholder={userData?.dateofissue} className='bg-dark2 border-dark3 border rounded-2xl' value={input6} onChange={(e) => {
                        setInput6(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput6();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                    </div>
                  </div>
                  <div className='flex flex-col gap-0.5'>
                    <div className='text-lg text-zinc-400'>Действителен до</div>
                    <div className='flex gap-2'>
                      <input placeholder={userData?.validuntil} className='bg-dark2 border-dark3 border rounded-2xl' value={input7} onChange={(e) => {
                        setInput7(e.target.value)
                      }} />
                      <div className='w-10 h-10 bg-white rounded-2xl flex justify-center items-center hover:bg-gray-200 cursor-pointer' onClick={() => {
                        applyInput7();
                      }}><IoMdCheckmarkCircleOutline color='black' size={28} /></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                <div className='text-3xl font-bold flex items-center gap-2'>Социальный рейтинг</div>
                <div className={'mt-2 text-lg text-start font-bold' + (userData?.rating > 0 ? " text-green-500" : " text-red-500")}>{userData?.rating}</div>
                <div className='flex w-full bg-zinc-400 rounded-2xl bg-opacity-20'>
                  <div className='flex w-full justify-start'><div className={'h-2 rounded-l-2xl w-[' + (Math.abs(userData?.rating) / 10) + "%] " + (userData?.rating > 0 ? "bg-green-500" : "bg-red-500")}></div></div>
                </div>
                <div className='grid grid-cols-6 w-full gap-2 mt-2'>
                  <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating + 1)
                  }}>+1</div>
                  <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating + 5)
                  }}>+5</div>
                  <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating + 10)
                  }}>+10</div>
                  <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating + 20)
                  }}>+20</div>
                  <div className='bg-green-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating + 50)
                  }}>+50</div>
                  <div className='bg-green-500 rounded-md py-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating + 100)
                  }}>+100</div>
                </div>
                <div className='grid grid-cols-6 w-full gap-2 mt-2'>
                  <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating - 1)
                  }}>-1</div>
                  <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating - 5)
                  }}>-5</div>
                  <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating - 10)
                  }}>-10</div>
                  <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating - 20)
                  }}>-20</div>
                  <div className='bg-red-500 rounded-md p-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating - 50)
                  }}>-50</div>
                  <div className='bg-red-500 rounded-md py-1 cursor-pointer flex justify-center' onClick={() => {
                    applyRating(userData?.rating - 100)
                  }}>-100</div>
                </div>
              </div>
              <div className='w-full flex flex-col px-4 sm:px-8 py-4 sm:py-6 bg-dark2 rounded-2xl h-fit'>
                <div className='text-3xl font-bold flex items-center gap-2'>Управление</div>
                <div className='mt-4 text-lg text-blue-500 hover:text-blue-600 cursor-pointer' onClick={() => {
                  genUrl();
                }}>Сгенерировать и скопировать ссылку для входа</div>
              </div>
            </div> : null}
          </div>
        </section>
      </section>
    </main>
  );
}
