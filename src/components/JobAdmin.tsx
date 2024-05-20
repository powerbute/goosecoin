import JobTask from "@/components/JobTask"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react"

export default function JobAdmin({ job }: { job: { jobID: any, passID: any } }) {
  const supabase = createClientComponentClient();

  const [allJobs, setAllJobs] = useState<any>([]);
  const [myJobs, setMyJobs] = useState<any>([]);
  const [worker, setWorker] = useState<any>();
  //const [workers, setWorkers] = useState<any>([]);
  const [workers2, setWorkers2] = useState<any>([]);
  const [tab, setTab] = useState<any>(1);
  //const [loaded, setLoaded] = useState(false);
  let loaded = false;
  let workers: any = [];

  useEffect(() => {
    if (loaded == false) {
      loaded = true;
      //setLoaded(true);
      getAllJobs();
      getMyJobs();
      //getWorkers();
      getWorker();
    }
  }, [loaded])


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

  async function getWorkers() {
    //if (workers.length > 0) return;
    //workers = [];
    const { data: workers1, error } = await supabase
      .from('jobworkers')
      .select('*')
      .eq("jobid", job.jobID)
    workers1?.forEach(async (e: any) => {
      if (e?.passid != undefined) {
        workers.push(e?.passid);
      }
    });
    //let uniqueChars: any[] = [];
    //workers.forEach((element) => {
    //  if (!uniqueChars.includes(element)) {
    //    uniqueChars.push(element);
    //  }
    //});
    //workers = uniqueChars;
    console.log(workers);
    //setWorkers(workers);
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
      <div className="flex gap-2">
        <div className="flex flex-col">
          <div>{workers[0]}</div>
          {workers.map((e: any) => {
            return (
              <div key={makeid(5)} className="flex">
                <img src={'https://avatar.spworlds.ru/face/512/'} className='rounded-2xl' />
                <div>{e}</div>
              </div>
            )
          }
          )
          }
        </div>
      </div>
    </>
  )
}