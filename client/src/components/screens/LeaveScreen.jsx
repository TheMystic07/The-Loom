import { useAuth } from "../../store/auth";
import { useState } from "react";
export function LeaveScreen({ setIsMeetingLeft }) {
  // const [meetclose,setmeetclose]=useState(true);
  const {setOpen,open}=useAuth();
  const meetingendclose=()=>{
    setOpen(false);
  }
  return (
    
    <div className="fixed bottom-20 right-4 w-[500px] ">
      <div className="bg-gray-800 rounded-lg flex-col pr-8 pt-4">
        <div className="flex justify-between items-center">
         <>.</><button  className="text-white " onClick={meetingendclose}>
              &times;
            </button>
        </div>
     
      <div className=" h-56 flex flex-col flex-1 items-center justify-center ">
  
      <h1 className="text-white text-4xl">You left the meeting!</h1>
      <div className="mt-12">
        <button
          className="`w-full bg-purple-300 text-white px-16 py-3 rounded-lg text-sm"
          onClick={() => {
            setIsMeetingLeft(false);
          }}
        >
          Rejoin the Meeting
        </button>
      </div>
    </div>
      </div>
    </div>
  );
}
