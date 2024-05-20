import JobAdmin from "@/components/JobAdmin";
import JobTask from "@/components/JobTask"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react"

export default function JobTasks({ job }: { job: { jobID: any, passID: any } }) {
  const supabase = createClientComponentClient();

  const [allJobs, setAllJobs] = useState<any>([]);
  const [myJobs, setMyJobs] = useState<any>([]);
  const [worker, setWorker] = useState<any>();
  const [tab, setTab] = useState<any>(1);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      setLoaded(true);
      getAllJobs();
      getMyJobs();
      getWorker();
    }
  })


  async function getMyJobs() {
    const { data: jobs, error } = await supabase
      .from('jobtasks')
      .select('*')
      .eq("jobid", job.jobID)
      .eq("worker", job.passID)
    setMyJobs(jobs);
  }

  async function getWorker() {
    const { data: worker, error } = await supabase
      .from('jobworkers')
      .select('*')
      .eq("jobid", job.jobID)
      .eq("passid", job.passID)
      .single();
    setWorker(worker);
    console.log(worker);
  }

  async function getAllJobs() {
    const { data: jobs, error } = await supabase
      .from('jobtasks')
      .select('*')
      .eq("jobid", job.jobID)
      .eq("worker", "ALL")
    setAllJobs(jobs);
  }

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
      <div className='text-3xl font-bold flex items-center gap-2'>Задачи от "ГО Сельхоз"</div>
      {worker?.role >= 0 ?
        <div className="flex bg-zinc-500 w-fit rounded-2xl">
          <div className={"p-2 rounded-l-2xl cursor-pointer " + (tab == 1 ? "bg-zinc-600" : "hover:bg-zinc-600")} onClick={() => setTab(1)}>Задачи</div>
          <div className={"p-2 rounded-r-2xl cursor-pointer " + (tab == 2 ? "bg-zinc-600" : "hover:bg-zinc-600")} onClick={() => setTab(2)}>Управление</div>
        </div> : null}
      {tab == 1 ?
        <div className='flex flex-col gap-2'>
          {myJobs?.map((e: any) =>
            <JobTask key={makeid(5)} task={{ taskID: e?.id, name: e?.text }} />
          )}
          {allJobs?.map((e: any) =>
            <JobTask key={makeid(5)} task={{ taskID: e?.id, name: e?.text }} />
          )}
          {myJobs.length == 0 && allJobs.length == 0 ?
            <div className="text-lg">Пока что задач нет</div>
            : null}
        </div>
        : null}
      {tab == 2 ?
        <div className='flex flex-col gap-2'>
          <JobAdmin job={{ jobID: job.jobID, passID: job.passID }} />
        </div>
        : null}
    </>
  )
}