import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import { CiHeart } from "react-icons/ci";

export default function LikeCompoennt({ passport }: { passport: { postid: any, authData: any, userData: any } }) {
  const [liked, setLiked] = useState(passport.userData?.likes?.includes(passport?.authData?.passid));
  const supabase = createClientComponentClient();
  function removeA(arr: any, what: any) {
    const index = arr.indexOf(what);
    if (index > -1) { // only splice array when item is found
      arr.splice(index, 1); // 2nd parameter means remove one item only
    }
  }

  async function handleLike(event: any) {
    const newLikes: any[] = passport.userData?.likes;
    if (liked) {
      removeA(newLikes, passport.authData?.passid);
    } else {
      if (!newLikes.includes(passport.authData?.passid)) {
        newLikes.push(passport.authData?.passid);
      }
    }
    const { error } = await supabase
      .from('posts')
      .update({ likes: newLikes })
      .eq('id', passport.userData?.id)
    setLiked(!liked);
  }

  return (
    <div className={"flex select-none w-fit justify-center relative items-center cursor-pointer pt-[1px] h-10 px-2 rounded-2xl " + (!liked ? "bg-white hover:bg-gray-200 text-black" : "bg-red-500 hover:bg-red-400 text-white")} onClick={(e) => handleLike(e)}>
      <CiHeart color={!liked ? "black" : "white"} size={32} className="relative cursor-pointer" />
      <div>{passport.userData?.likes?.length > 0 ? passport.userData?.likes?.length : null}</div>
    </div>
  )
}