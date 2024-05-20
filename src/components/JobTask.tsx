import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react"

export default function JobTask({ task }: { task: { taskID: any, name: any } }) {
  const [complete, setComplete] = useState<any>(false);
  const supabase = createClientComponentClient();

  async function completeF() {
    const { data: jobs, error } = await supabase
      .from('jobtasks')
      .update({ complete: (!complete) as any })
      .eq("id", task.taskID)
    setComplete(!complete);
  }

  return (
    <div className='flex gap-2 items-center'>
      <div className={'w-4 h-4 rounded-2xl cursor-pointer' + (complete ? " bg-green-500" : " bg-zinc-400")} onClick={() => {
        completeF();
      }}></div>
      <div className='text-lg'>{task.name}</div>
    </div>
  )
}