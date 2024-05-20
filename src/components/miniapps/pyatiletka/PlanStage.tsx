import Passport from "@/components/Passport";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useEffect, useState } from "react"
import { CiPassport1 } from "react-icons/ci";
import { IoMdCloseCircle } from "react-icons/io";
import { TbProgress, TbProgressBolt, TbProgressCheck, TbProgressX } from "react-icons/tb";

export default function PyatiletkaApp({ passport }: { passport: { id: any, name: any, desc: any, status: any, authData: any, updatePage: any } }) {
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = useState(false);
  const [planSubStages, setPlanSubStages] = useState<any>([]);

  async function getPlan() {
    let { data: plan, error } = await supabase
      .from('plansubstages')
      .select('*')
      .eq('stageid', passport.id)
      .order('id', { ascending: true });
    setPlanSubStages(plan);
  }

  async function next(cs: any) {
    let ns = 0;
    if (cs == 0) {
      ns = 1;
    }
    if (cs == 1) {
      ns = 2;
    }
    if (cs == 2) {
      ns = 0;
    }
    let { data: plan, error } = await supabase
      .from('planstages')
      .update({ status: ns })
      .eq('id', passport.id)
    passport.updatePage();
  }

  async function nextSub(cs: any, id: any) {
    let ns = 0;
    if (cs == 0) {
      ns = 1;
    }
    if (cs == 1) {
      ns = 2;
    }
    if (cs == 2) {
      ns = 0;
    }
    let { data: plan, error } = await supabase
      .from('plansubstages')
      .update({ status: ns })
      .eq('id', id)
    getPlan();
  }

  React.useEffect(() => {
    if (!loaded) {
      getPlan()
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

  return (
    <>
      <div key={makeid(10)} className="flex flex-col">
        <div className="bg-dark4 rounded-l-2xl rounded-t-2xl">
          <div className="flex gap-2">
            {passport.status == 2 ? <div onClick={() => {
              if (passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2)) {
                next(passport.status);
              } else {
                alert("Нет прав!")
              }
            }} className="w-16 bg-green-500 rounded-2xl flex items-center justify-center cursor-pointer"><TbProgressCheck size={32} /></div> : null}
            {passport.status == 1 ? <div onClick={() => {
              if (passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2)) {
                next(passport.status);
              } else {
                alert("Нет прав!")
              }
            }} className="w-16 bg-yellow-500 rounded-2xl flex items-center justify-center cursor-pointer"><TbProgressBolt size={32} /></div> : null}
            {passport.status == 0 ? <div onClick={() => {
              if (passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2)) {
                next(passport.status);
              } else {
                alert("Нет прав!")
              }
            }} className="w-16 bg-dark3 rounded-2xl flex items-center justify-center cursor-pointer"><TbProgressX size={32} /></div> : null}
            <div className="flex gap-2 flex-col p-2">
              <h3>{passport.name}</h3>
              <p>{passport.desc}</p>
            </div>
          </div>
        </div>
        <div className="flex pl-16 w-full flex-col">
          {planSubStages?.map((e: any) =>
            <div key={makeid(10)} className="bg-dark3 rounded-l-2xl w-full">
              <div className="flex gap-2">
                {e?.status == 2 ? <div onClick={() => {
                  if (passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2)) {
                    nextSub(e?.status, e?.id);
                  } else {
                    alert("Нет прав!")
                  }
                }} className="w-16 bg-green-500 rounded-2xl flex items-center justify-center cursor-pointer"><TbProgressCheck size={32} /></div> : null}
                {e?.status == 1 ? <div onClick={() => {
                  if (passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2)) {
                    nextSub(e?.status, e?.id);
                  } else {
                    alert("Нет прав!")
                  }
                }} className="w-16 bg-yellow-500 rounded-2xl flex items-center justify-center cursor-pointer"><TbProgressBolt size={32} /></div> : null}
                {e?.status == 0 ? <div onClick={() => {
                  if (passport.authData?.roles?.includes(1) || passport.authData?.roles?.includes(2)) {
                    nextSub(e?.status, e?.id);
                  } else {
                    alert("Нет прав!")
                  }
                }} className="w-16 bg-dark4 rounded-2xl flex items-center justify-center cursor-pointer"><TbProgressX size={32} /></div> : null}
                <div className="flex gap-2 flex-col p-2">
                  <p>{e?.desc}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}