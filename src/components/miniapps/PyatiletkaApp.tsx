import Passport from "@/components/Passport";
import PlanStage from "@/components/miniapps/pyatiletka/PlanStage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useEffect, useState } from "react"
import { CiPassport1 } from "react-icons/ci";
import { IoMdCloseCircle } from "react-icons/io";
import { TbProgress } from "react-icons/tb";

export default function PyatiletkaApp({ passport }: { passport: { authData: any, userID: any, open: any, setOpen: any } }) {
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = useState(false);
  const [planStages, setPlanStages] = useState<any>([]);

  async function getPlan() {
    let { data: plan, error } = await supabase
      .from('planstages')
      .select('*')
      .order('id', { ascending: true });
    setPlanStages(plan);
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
      <section className={'absolute z-[70] bottom-0 left-0 text-white w-full flex items-end justify-center backdrop-blur-[4px] h-full' + (!open ? " hidden" : "")} onClick={() => passport.setOpen(false)}>
        <div className='relative bottom-0 left-0 w-full md:w-1/2 border p-2 rounded-t-2xl border-dark4 bg-dark h-fit' onClick={(e: any) => {
          e.stopPropagation();
        }}>
          <div className='flex w-full mb-2 justify-between px-4'>
            <div className='text-3xl font-bold'>Пятилетка</div>
            <div className='flex items-center justify-center'><IoMdCloseCircle size={24} className='hover:text-gray-200 cursor-pointer' onClick={() => {
              passport.setOpen(false)
            }} /></div>
          </div>
          <div className='mb-4 overflow-x-scroll rounded-2xl max-h-[70vh] gap-2 flex flex-col'>
            {planStages?.map((e: any) =>
              <PlanStage key={makeid(10)} passport={{ id: e?.id, name: e?.name, desc: e?.desc, status: e?.status, authData: passport.authData, updatePage: getPlan }} />
            )}
          </div>
        </div>
      </section>
    </>
  )
}