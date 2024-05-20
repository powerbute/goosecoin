import NextImage from "@/components/NextImage";
import Passport from "@/components/Passport";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react"
import { CiPassport1 } from "react-icons/ci";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdCloseCircle } from "react-icons/io";

export default function PassportApp({ passport }: { passport: { authData: any, userID: any, open: any, setOpen: any } }) {
  const supabase = createClientComponentClient();
  const [page, setPage] = useState<number>(1);
  const maxPage = 3;

  return (
    <>
      <section className={'fixed select-none z-[70] bottom-0 left-0 text-white w-full flex items-center justify-center backdrop-blur-[4px] h-full' + (!open ? " hidden" : "")} onClick={() => passport.setOpen(false)}>
        <div className='relative bottom-0 h-[80%] left-0 md:w-1/3 border pt-2 rounded-2xl border-dark4 bg-dark' onClick={(e: any) => {
          e.stopPropagation();
        }}>
          <div className='flex w-full mb-2 justify-between px-4'>
            <div className='text-3xl font-bold'>Просмотр документа</div>
            <div className='flex items-center justify-center'><IoMdCloseCircle size={24} className='hover:text-gray-200 cursor-pointer' onClick={() => {
              passport.setOpen(false)
            }} /></div>
          </div>
          {page > 1 ?
            <div className="absolute top-[-3.5rem] md:left-[-5rem] flex items-start md:items-center" onClick={() => {
              setPage(page - 1);
            }}>
              <div className="bg-dark2 rounded-2xl cursor-pointer hover:bg-dark4"><FaAngleLeft size={48} /></div>
            </div> : null}
          {page < maxPage ?
            <div className="absolute top-[-3.5rem] md:right-[-5rem] flex items-start justify-end w-full md:justify-start md:w-fit md:items-center" onClick={() => {
              setPage(page + 1);
            }}>
              <div className="bg-dark2 rounded-2xl cursor-pointer hover:bg-dark4"><FaAngleRight size={48} /></div>
            </div> : null}
          {page == 1 ?
            <div className="w-full rounded-2xl px-8 py-8 h-full bg-red-800 flex flex-col justify-around items-center">
              <div className=""><img src="Emblem_of_Avinesia.png" className="w-[300px]" /></div>
              <div className="font-bold text-3xl">
                Паспорт гражданина Авинесии
              </div>

            </div>
            : null}
          {page == 2 ?
            <div className="w-full rounded-2xl px-8 py-8 h-full bg-gray-300 text-black flex flex-col overflow-y-scroll overflow-x-hidden md:overflow-y-hidden">
              <div className="flex flex-col md:flex-row gap-6">
                <div className={"relative w-fit rounded-2xl bg-blue-200 pt-2"}>
                  <NextImage onError={(e) => {
                    e.currentTarget.srcset = "/Steve.webp";
                  }} width={256} height={256} alt='profile avatar' src={'https://avatar.spworlds.ru/front/512/' + (passport.authData?.nickname)} />
                </div>
                <div className="flex gap-4 flex-col w-full">
                  <div className="flex flex-col border-b border-black w-full">
                    <div>Никнейм</div>
                    <div className="text-xl">{passport.authData?.nickname}</div>
                  </div>
                  <div className="flex flex-col border-b border-black w-full">
                    <div>Псевдоним</div>
                    <div className="text-xl">{passport.authData?.surname}</div>
                  </div>
                  <div className="flex flex-col border-b border-black w-full">
                    <div>Выдано</div>
                    <div className="text-xl">{passport.authData?.dateofissue}</div>
                  </div>
                  <div className="flex flex-col border-b border-black w-full">
                    <div>Кем выдано</div>
                    <div className="text-xl">{passport.authData?.issuedby}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-end justify-between h-full w-full">
                <div className="text-2xl font-bold text-red-500">{passport.authData?.passid}</div>
                <div className="relative">
                  <div className="absolute text-blue-500 flex items-center justify-center z-[2] rotate-[-25deg] w-full h-full">Действительно до {passport.authData?.validuntil}</div>
                  <img src="AvinesiaVerify.png" className="w-[256px] rotate-[-45deg] z-[1]" /></div>
              </div>

            </div>
            : null}
          {page == 3 ?
            <div className="w-full rounded-2xl px-8 py-8 h-full bg-red-800 flex flex-col items-center justify-end">
              <div>Авинесия</div>

            </div>
            : null}
        </div>
      </section>
    </>
  )

  /*return (
    <>
      <section className={'absolute z-[70] bottom-0 left-0 text-white w-full flex items-end justify-center backdrop-blur-[4px] h-full' + (!open ? " hidden" : "")} onClick={() => passport.setOpen(false)}>
        <div className='relative bottom-0 left-0 w-full md:w-1/2 border p-2 rounded-t-2xl border-dark4 bg-dark h-fit' onClick={(e: any) => {
          e.stopPropagation();
        }}>
          <div className='flex w-full mb-2 justify-between px-4'>
            <div className='text-3xl font-bold'>Паспорт</div>
            <div className='flex items-center justify-center'><IoMdCloseCircle size={24} className='hover:text-gray-200 cursor-pointer' onClick={() => {
              passport.setOpen(false)
            }} /></div>
          </div>
          <div className='mb-4'><Passport passport={{ authData: passport.authData, userID: passport.userID }} /></div>
        </div>
      </section>
    </>
  )*/
}