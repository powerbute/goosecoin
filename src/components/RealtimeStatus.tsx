import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useLocalStorage from "use-local-storage";

export default function RealtimeStatus({ }) {
  /*const [authData, setAuthData] = useLocalStorage<any>("authdata", {});
  const supabase = createClientComponentClient();

  const channel = supabase.channel('room1')

  async function start() {
    channel
      .on('presence', { event: 'join' }, async ({ newPresences }) => {
        //console.log('Newly joined presences: ', newPresences)
        const a = await supabase
          .from('status')
          .delete()
          .eq('passid', newPresences[0]?.user)
          .then(async () => {
            const { error } = await supabase
              .from('status')
              .upsert({ passid: newPresences[0]?.user, status: 1 })
          })
      })
      .on('presence', { event: 'leave' }, async ({ leftPresences }) => {
        //console.log('Left joined presences: ', leftPresences)
        const a = await supabase
          .from('status')
          .delete()
          .eq('passid', leftPresences[0]?.user)
          .then(async () => {
            const { error } = await supabase
              .from('status')
              .upsert({ passid: leftPresences[0]?.user, status: 0 })
          })
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user: authData?.passid, online_at: new Date().toISOString() })
        }
      })
  }

  start();*/

  return (<></>)
}