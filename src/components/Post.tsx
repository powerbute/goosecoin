import LikeCompoennt from "@/components/PostLikeComponent";
import NextImage from "@/components/NextImage";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React from "react";
import { useState } from "react"
import moment from "moment";
import 'moment/locale/ru'
import { MdDelete, MdVerified } from "react-icons/md";
import { IoWarning } from "react-icons/io5";

export default function Post({ post }: { post: { authdata: any, passid: any, text: any, date: any, postData: any, updatePosts: any, userID: any, subsData: any, subEn: any } }) {
  const supabase = createClientComponentClient();
  const [user, setUser] = React.useState<any>({});
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => {
    if (!loaded) {
      postGetUser(post.passid);
      setLoaded(true);
    }
  })
  moment.locale('ru')

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

  async function postGetUser(passid: any) {
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq("passid", passid)
      .single();
    setUser(users);

  }

  async function deletePost(id: any) {
    let { error } = await supabase
      .from('posts')
      .delete()
      .eq("id", id)
    post.updatePosts(post.userID);

  }

  function checkSub() {
    if (post.subsData?.includes(post.passid)) {
      return true;
    }
    return false;
  }

  async function sub() {
    if (post.passid == "LGS-P7nX10" || post.passid == "LGS-49fb3e") {
      alert("Нет прав")
      return;
    }
    let { data: users1 } = await supabase
      .from('subs')
      .select()
      .eq('passid1', post.authdata?.passid);
    if (users1 != null) {
      for (let g1 = 0; g1 < users1?.length; g1++) {
        if (users1[g1]?.passid2 == post.passid) {
          let { data: users2 } = await supabase
            .from('subs')
            .delete()
            .eq('id', users1[g1]?.id);
          alert("Подписка отменена!")
          post.updatePosts()
          return;
        }
      }
      let { data: users } = await supabase
        .from('subs')
        .insert({ passid1: post.authdata?.passid, passid2: post.passid })
      alert("Подписка оформлена!")
      post.updatePosts();
    }

  }

  return (
    <div key={makeid(10)} className='flex gap-4 flex-col bg-dark2 p-4 rounded-2xl relative'>
      <div className="flex justify-between items-start">
        <div className='flex gap-2 select-none'>
          <NextImage onError={(e) => {
            e.currentTarget.srcset = "/Steve.webp";
          }} onClick={() => {
            window.open("/user/" + post.userID, "_self")
          }} width={48} height={48} alt='profile avatar' className="cursor-pointer" src={'https://avatar.spworlds.ru/face/512/' + user?.nickname} />
          <div className='flex flex-col'>
            <div className='text-xl font-bold flex items-center gap-2 cursor-pointer' onClick={() => {
              window.open("/user/" + post.userID, "_self")
            }}>{user?.nickname} {
                user?.roles?.includes(2) ? <span className="text-sm font-normal md:bg-dark4 md:px-2 rounded-2xl flex gap-2 items-center select-none"><MdVerified /> <span className="hidden md:block">Правительство</span></span> : null
              }
              {user?.inoagent ? <span className="text-sm font-normal md:bg-gradient-to-br from-rose-400 to-red-600 md:px-2 rounded-2xl flex gap-2 items-center select-none"><IoWarning /> <span className="hidden md:block">Иноагент</span></span> : null}
            </div>
            <div className='text-zinc-700'>{moment(post.date).fromNow()}</div>
          </div>
        </div>
        <div className="flex gap-2 items-center">
          {(post.authdata?.id != post.userID && !(post.passid == "LGS-P7nX10" || post.passid == "LGS-49fb3e")) && post.subEn ?
            <>
              {checkSub() == true ? <div className="flex select-none bg-blue-500 hover:bg-blue-600 cursor-pointer p-2 rounded-2xl flex justify-center" onClick={() => {
                sub();
              }}>Подписан</div> :
                <div className="flex select-none bg-dark4 hover:bg-dark3 cursor-pointer p-2 rounded-2xl flex justify-center" onClick={() => {
                  sub();
                }}>Подписаться</div>}
            </>
            : null}
          {post.authdata?.id != post.userID || (post.authdata?.roles?.includes(1) || post.authdata?.roles?.includes(2)) ? <div className="h-fit p-2 hover:text-red-500 cursor-pointer hover:bg-dark3 rounded-2xl" onClick={() => deletePost(post.postData?.id)}>
            <MdDelete size={20} />
          </div> : null}
        </div>
      </div>
      <div>
        {post.text}</div>
      <div>
        <LikeCompoennt passport={{ postid: post.postData?.id, authData: post.authdata, userData: post.postData }} />
      </div>
    </div>
  )
}