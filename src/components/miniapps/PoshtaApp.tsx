import Passport from "@/components/Passport";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react"
import { CiDeliveryTruck } from "react-icons/ci";
import { IoMdCloseCircle } from "react-icons/io";

export default function PoshtaApp({ passport }: { passport: { authData: any, userID: any } }) {
  const [open, setOpen] = useState<any>(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    open
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
  }, [open]);

  return (
    <>
      <div className='flex gap-1 items-center bg-dark2 cursor-pointer p-2 rounded-2xl hover:bg-dark3' onClick={() => {
        setOpen(true)
        window.scrollTo(0, 0)
      }} >
        <CiDeliveryTruck size={24} />
        <div>Пошта</div>
      </div>
      <section className={'absolute z-[70] bottom-0 left-0 text-white w-full flex items-end justify-center backdrop-blur-[4px] h-screen' + (!open ? " hidden" : "")}>
        <div className='relative bottom-0 left-0 w-full md:w-1/2 border p-2 rounded-t-2xl border-dark4 bg-dark h-fit'>
          <div className='flex w-full mb-2 justify-between px-4'>
            <div className='text-3xl font-bold'>Паспорт</div>
            <div className='flex items-center justify-center'><IoMdCloseCircle size={24} className='hover:text-gray-200 cursor-pointer' onClick={() => {
              setOpen(false)
            }} /></div>
          </div>
          <div className='mb-4'><Passport passport={{ authData: passport.authData, userID: passport.userID }} /></div>
        </div>
      </section>
    </>
  )
}