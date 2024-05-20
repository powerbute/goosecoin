import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import useLocalStorage from "use-local-storage";

export default function SecurityAuth({ authData }: { authData: { data: any, setData: any, authCallback: any } }) {

  const [session, setSession] = useLocalStorage("session", "");
  const supabase = createClientComponentClient();
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loaded) {
      auth();
      setLoaded(true);
    }
  })

  async function auth() {
    //console.log(authData.data)
    const { data: sessions, error: sessionsErr } = await supabase
      .from("sessions")
      .select("*")
      .eq("session", session)
      .single();
    if (sessionsErr != null) {
      router.push("https://id.gooseland.cc/authinapp?app=coin.gooseland.cc")
      return;
    }
    if (sessions?.passid == null) {
      router.push("https://id.gooseland.cc/authinapp?app=coin.gooseland.cc")
      return;
    }
    const { data: userData, error: userDataErr } = await supabase
      .from("users")
      .select()
      .eq("passid", sessions?.passid)
      .single();
    if (userData == null) {
      router.push("https://id.gooseland.cc/authinapp?app=coin.gooseland.cc")
      return;
    }
    authData.setData(userData)
    authData.authCallback(userData);
  }

  //if (authData == null) {
  return (
    <>
      {authData.data == null && <div className="fixed bottom-0 right-0 m-8 text-white text-sm font-bold">
        <div className="flex p-2 justify-center bg-dark2 border border-dark3 gap-2 rounded-md items-center"><AiOutlineLoading className="animate-spin" /> Авторизация...</div>
      </div>}
    </>
  )
  //}

}

export async function AVauth() {
  const [session, setSession] = useLocalStorage("session", "");
  const supabase = createClientComponentClient();

  const { data: sessions, error: sessionsErr } = await supabase
    .from("sessions")
    .select("*")
    .eq("session", session)
    .single();
  if (sessionsErr != null) {
    alert("Ошибка!")
    return;
  }
  if (sessions?.passid == null) {
    alert("Ошибка!")
    return;
  }
  const { data: userData, error: userDataErr } = await supabase
    .from("users")
    .select()
    .eq("passid", sessions?.passid)
    .single();
  if (userData == null) {
    alert("Ошибка!")
    return;
  }
  return userData;

}

export async function AVauthC(session: any) {
  //const [session, setSession] = useLocalStorage("session", "");
  const supabase = createClientComponentClient();

  const { data: sessions, error: sessionsErr } = await supabase
    .from("sessions")
    .select("*")
    .eq("session", session)
    .single();
  if (sessionsErr != null) {
    alert("Ошибка!")
    return;
  }
  if (sessions?.passid == null) {
    alert("Ошибка!")
    return;
  }
  const { data: userData, error: userDataErr } = await supabase
    .from("users")
    .select()
    .eq("passid", sessions?.passid)
    .single();
  if (userData == null) {
    alert("Ошибка!")
    return;
  }
  return userData;

}