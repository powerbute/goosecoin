import moment from "moment";
import { FaDonate } from "react-icons/fa";
import { FaBoltLightning, FaAnglesUp, FaTrophy } from "react-icons/fa6";
import { GiGoose } from "react-icons/gi";
import { IoCloseCircle } from "react-icons/io5";

export default function Clicker({ app }: { app: { userData: any, setUserData: any, session: any, supabase: any, isClicked: any, setIsClicked: any, authData: any, energy: any, setEnergy: any, userRating: any, setUserRating: any, subPage: any, setSubPage: any, setRatingMesto: any, setLoaded: any, addFloatingNumber: any } }) {
  async function click() {
    if (app.isClicked && app.userData?.energy >= 0) return;
    //setCoins((prev) => prev + 1);
    const { data: userData1, error: userErr } = await app.supabase
      .from('users')
      .select()
      .eq("id", app.authData?.id)
      .single()
    if (userData1?.energy <= 0) return;
    app.setIsClicked(true);
    app.addFloatingNumber(app.userData?.multitaplvl + 1);
    const { error } = await app.supabase
      .from('users')
      .update({ coins: (Number.parseInt(userData1?.coins) + (app.userData?.multitaplvl + 1)), energy: (Number.parseInt(userData1?.energy) - 1) })
      .eq("id", app.authData?.id)
    app.setEnergy((prev: any) => prev - 1);
    setTimeout(() => {
      app.setIsClicked(false);
    }, 10)
  }

  function getMesto() {
    if (app.userRating == null) return;
    const userR = app.userRating;
    let r1 = -1;
    userR.forEach((element: any, index: any) => {
      if (element?.id == app.authData?.id) {
        r1 = index + 1;
      }
    });
    return r1;
  }

  function priceMultitapLVL() {
    if (app.userData?.multitaplvl == 0) {
      return 2000;
    }
    if (app.userData?.multitaplvl == 1) {
      return 3000;
    }
    if (app.userData?.multitaplvl == 2) {
      return 4500;
    }
    if (app.userData?.multitaplvl == 3) {
      return 6750;
    }
    if (app.userData?.multitaplvl == 4) {
      return 10125;
    }
    if (app.userData?.multitaplvl == 5) {
      return 15187;
    }
    if (app.userData?.multitaplvl == 6) {
      return 22781;
    }
    if (app.userData?.multitaplvl == 7) {
      return 34171;
    }
    if (app.userData?.multitaplvl == 8) {
      return 51256;
    }
    if (app.userData?.multitaplvl == 9) {
      return 76884;
    }
    if (app.userData?.multitaplvl == 10) {
      return 115326;
    }
    if (app.userData?.multitaplvl == 11) {
      return 172989;
    }
    if (app.userData?.multitaplvl == 12) {
      return 259483;
    }
    if (app.userData?.multitaplvl == 13) {
      return 300000;
    }
    if (app.userData?.multitaplvl == 14) {
      return 350000;
    }
    return 999999999999;
  }

  function priceRecovLVL() {
    if (app.userData?.recovlvl == 0) {
      return 2000;
    }
    if (app.userData?.recovlvl == 1) {
      return 4000;
    }
    if (app.userData?.recovlvl == 2) {
      return 6000;
    }
    if (app.userData?.recovlvl == 3) {
      return 10000;
    }
    if (app.userData?.recovlvl == 4) {
      return 15000;
    }
    if (app.userData?.recovlvl == 5) {
      return 20000;
    }
    if (app.userData?.recovlvl == 6) {
      return 30000;
    }
    if (app.userData?.recovlvl == 7) {
      return 40000;
    }
    if (app.userData?.recovlvl == 8) {
      return 50000;
    }
    if (app.userData?.recovlvl == 9) {
      return 100000;
    }
    return 999999999999;
  }

  async function upMultitap() {
    if (app.userData?.coins > priceMultitapLVL()) {
      //console.log("a")
      const { data: userData1, error: userErr } = await app.supabase
        .from('users')
        .select()
        .eq("id", app.authData?.id)
        .single()
      if ((Number.parseInt(userData1?.coins) - priceMultitapLVL()) < 0) return;
      const { error } = await app.supabase
        .from('users')
        .update({ coins: (Number.parseInt(userData1?.coins) - priceMultitapLVL()), multitaplvl: Number.parseInt(userData1?.multitaplvl) + 1 })
        .eq("id", app.authData?.id)
      app.setSubPage(0);
    }
  }

  async function upRecovLVL() {
    if (app.userData?.coins > priceRecovLVL()) {
      //console.log("a")
      const { data: userData1, error: userErr } = await app.supabase
        .from('users')
        .select()
        .eq("id", app.authData?.id)
        .single()
      if ((Number.parseInt(userData1?.coins) - priceRecovLVL()) < 0) return;
      const { error } = await app.supabase
        .from('users')
        .update({ coins: (Number.parseInt(userData1?.coins) - priceRecovLVL()), recovlvl: Number.parseInt(userData1?.recovlvl) + 1 })
        .eq("id", app.authData?.id)
      app.setSubPage(0);
    }
  }

  async function getReward() {
    if (moment(app.userData.rewardlvl).add(1, 'days').toDate() < new Date() || app.userData?.rewardlvl == null) {
      const { data: userData1, error: userErr } = await app.supabase
        .from('users')
        .select()
        .eq("id", app.authData?.id)
        .single()
      const { error } = await app.supabase
        .from('users')
        .update({ coins: (Number.parseInt(userData1?.coins) + 2000), rewardlvl: new Date() })
        .eq("id", app.authData?.id)
    } else {
      alert(moment(app.userData.rewardlvl).add(1, 'days').fromNow())
    }
  }

  app.supabase
    .channel('room1')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload: any) => {
      update(app.authData?.id);
    })
    .subscribe()

  async function update(userID: any) {
    const { data, error } = await app.supabase
      .from('users')
      .select()
      .eq('id', userID)
      .single()
    app.setUserData(data);
    const { data: a1 } = await app.supabase
      .from('users')
      .select()
      .eq('deactive', false)
      .order("coins", { ascending: false })
    app.setUserRating(a1);
    app.setRatingMesto(getMesto());
    app.setLoaded(true);
    //setCoins(data?.coins)
  }
  return (
    <>
      <section className='px-4 mt-4 flex flex-col justify-between h-full'>
        <div className='flex flex-col gap-4 items-center'>
          <div className='flex flex-col gap-3 items-center'>
            <div className='text-5xl font-black'>{new Intl.NumberFormat('en-US').format(app.userData?.coins)}</div>
            <div className='font-semibold text-lg'>{getMesto()} место</div>
          </div>
          <div onClick={() => click()} className={'flex items-center justify-center p-8 rounded-full ' + (app.isClicked ? "bg-blue-600 w-[16rem] h-[16rem]" : "bg-blue-500 w-[17rem] h-[17rem]")}>
            <div className={'flex items-center justify-center w-full h-full rounded-full ' + (app.isClicked ? "bg-blue-500" : "bg-blue-400")}>
              <div><GiGoose size={128} /></div>
            </div>
          </div>
        </div>
        <div className='flex flex-col gap-4'>
          <div className='flex items-center gap-2 text-lg font-bold'><FaBoltLightning color='gold' />{app.userData?.energy} / {1000}</div>
          <div className='w-full bg-dark4 p-2 rounded-2xl relative'>
            <div className='h-4 rounded-2xl bg-blue-500 absolute top-0 left-0' style={{ width: (app.userData?.energy / 1000) * 100 + "%" }}></div>
          </div>
          <div className='rounded-2xl flex w-full gap-2'>
            <div onClick={() => app.setSubPage(1)} className='bg-dark5 hover:bg-dark4 w-full cursor-pointer p-4 rounded-2xl flex items-center flex-col gap-1'>
              <div><FaAnglesUp size={24} /></div>
              <div className='font-bold'>Улучшения</div>
            </div>
            <div onClick={() => app.setSubPage(2)} className='bg-dark5 hover:bg-dark4 w-full cursor-pointer p-4 rounded-2xl flex items-center flex-col gap-1'>
              <div><FaTrophy size={24} /></div>
              <div className='font-bold'>Топ</div>
            </div>
            <div onClick={() => app.setSubPage(3)} className='bg-dark5 hover:bg-dark4 w-full cursor-pointer p-4 rounded-2xl flex items-center flex-col gap-1'>
              <div><FaDonate size={24} /></div>
              <div className='font-bold'>Пожертвования</div>
            </div>
          </div>
        </div>
      </section>
      {app.subPage == 1 &&
        <div className='absolute text-white h-3/4 w-full bottom-0 left-0 p-4 bg-dark2 border-t border-dark3 z-[7] flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-bold'>Улучшения</div>
            <div><IoCloseCircle onClick={() => app.setSubPage(0)} className='hover:text-gray-300 cursor-pointer' size={24} /></div>
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
              <div className='flex items-center gap-2 text-3xl font-black'>{app.userData?.multitaplvl} / 15</div>
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
              <div className='flex items-center gap-2 text-3xl font-black'>{app.userData?.recovlvl} / 10</div>
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
      {app.subPage == 2 &&
        <div className='absolute text-white h-3/4 w-full bottom-0 left-0 p-4 bg-dark2 border-t border-dark3 z-[7] flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-bold'>Топ</div>
            <div><IoCloseCircle onClick={() => app.setSubPage(0)} className='hover:text-gray-300 cursor-pointer' size={24} /></div>
          </div>
          <div className='flex flex-col mt-4 gap-2 overflow-y-scroll'>
            {app.userRating?.map((user: any) =>
              <div key={"userRating" + user?.id} className='flex text-lg justify-between'>
                <div className='font-bold'>{user?.nickname}</div>
                <div className='flex items-center gap-1'>{new Intl.NumberFormat('en-US').format(user?.coins)}</div>
              </div>
            )}
          </div>
        </div>
      }
      {app.subPage == 3 &&
        <div className='absolute text-white h-3/4 w-full bottom-0 left-0 p-4 bg-dark2 border-t border-dark3 z-[7] flex flex-col'>
          <div className='flex items-center justify-between'>
            <div className='text-lg font-bold'>Пожертвования</div>
            <div><IoCloseCircle onClick={() => app.setSubPage(0)} className='hover:text-gray-300 cursor-pointer' size={24} /></div>
          </div>
          <div className='flex flex-col mt-4 gap-2 overflow-y-scroll'>
            <div className='text-xl font-bold'>Скоро здесь можно будет пожертвовать гуськоины Правительству</div>
          </div>
        </div>
      }
    </>
  )
}