import React from 'react'
import {
  result,
  results,
  message,
  spawn,
  monitor,
  unmonitor,
  dryrun,
  createDataItemSigner
} from "@permaweb/aoconnect";

// const LoomProcess= "uZRvUz2hPcuejYs6bKzhrEAqrR42RaR6sd-huw03L2w"
const LoomProcess= "o8Gd7GjChwo0j8u7zRvI5XYlDFiC9tB5i7OTY5n2SyI"

// import { connect } from "@permaweb/aoconnect";

// const { result, results, message, spawn, monitor, unmonitor, dryrun } = connect(
//   {
//     MU_URL: "https://mu.ao-testnet.xyz",
//     CU_URL: "https://cu.ao-testnet.xyz",
//     GATEWAY_URL: "https://arweave.net",
//   },
// );

// now spawn, message, and result can be used the same way as if they were imported directly

// const TestingAoTemp = () => {
//   return (
//     <div>TestingAoTemp</div>
//   )
// }

// export default TestingAoTemp    

import { connect,} from "@permaweb/aoconnect";
import { useEffect, useState } from "react";
import { func } from 'three/examples/jsm/nodes/Nodes.js';

// declare global {
//   interface Window {
//     arweaveWallet: {
//       connect: (foo: string[]) => void;
//       disconnect: () => void;
//       getActiveAddress: () => void;
//     };
//   }
// }

const todoProcess = "o8Gd7GjChwo0j8u7zRvI5XYlDFiC9tB5i7OTY5n2SyI";
const  aoSigner = createDataItemSigner(window.arweaveWallet);
function TestingAoTemp() {
  const [newTask, setNewTask] = useState("");
  const [players, setPlayers] = useState([]);
  const ao = connect();


//Testing some shit


async function loomConnect(){
  await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);

  const res = await message({
    process: LoomProcess,
    tags: [{name: "Action", value: "Connect" },],
    signer: aoSigner,
    // data: window.arweaveWallet.getActiveAddress(),
  });
  console.log("Loom  result", res);

  const msgResult = await result({
    process: LoomProcess,
    message: res,
  });


  console.log(msgResult);}

  
  
    // async function getActivePlayers(){
  
    //   const res = await message({
    //     process:LoomProcess,
    //     tags:[{name:"Action" , value:"GetActivePlayers"}],
    //     signer: aoSigner,
    //   });
    //   console.log(res)
    //   const msgResult= await result({
    //     process:LoomProcess,
    //     message:res,
    //   })
    //   console.log(msgResult)
  
  
    // }
    // ---------------------------
  
    async function getActivePlayers(){
  
      const res = await  dryrun({
        process:LoomProcess,
        tags:[{name:"Action" , value:"GetActivePlayers"}],
        signer: aoSigner,
      });
      console.log(res);
      const { Messages } = res;
      const tasks = Messages[0].Data;
      const tasksJson = JSON.parse(tasks);
      console.log(tasksJson);
      setPlayers(tasksJson);
  
  
    }


    const notgetActivePlayers = async () => {
      console.log("Getting Active Players");
      const addr = await window.arweaveWallet.getActiveAddress();
      const res = await dryrun({
        process: LoomProcess,
        tags: [
          {
            name: "Action",
            value: "GetActivePlayers",
          },
        ],
      });
      const { Messages } = res;
      const tasks = Messages[0].Data;
      const tasksJson = JSON.parse(tasks);
      setPlayers(tasksJson);
      console.log(tasksJson);
      console.log(tasksJson.keys);
    }
    
    


///------------------

  // async function addTask(task) {
  //   if (!task) alert("type in a task");
  //   await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
  //   const m_id = await ao.message({
  //     process: todoProcess,
  //     signer: createDataItemSigner(window.arweaveWallet),
  //     data: task,
  //     tags: [{ name: "Action", value: "Add-Task" }],
  //   });
  //   const res = await ao.result({
  //     process: todoProcess,
  //     message: m_id,
  //   });
  //   console.log(res);
  // }

  // async function getTasks() {
  //   const addr = await window.arweaveWallet.getActiveAddress();
  //   const res = await ao.dryrun({
  //     process: todoProcess,
  //     tags: [
  //       {
  //         name: "Action",
  //         value: "Get-Tasks",
  //       },
  //     ],
  //     data: addr,
  //   });
  //   console.log(res);
  //   const { Messages } = res;
  //   const tasks = Messages[0].Data;
  //   const tasksJson = JSON.parse(tasks);
  //   console.log(tasksJson);
  //   setPlayers(tasksJson);
  // }

  // useEffect(() => {
  //   setInterval(() => {
  //     getActivePlayers();
  //   }, 5000);
  // }, []);

  return (
    <>
      <input placeholder="type in your task" onChange={(e) => setNewTask(e.target.value)} />{" "}
      <button
        onClick={() => {
        loomConnect();
        }}
      >
        add task
      </button>
      
      <button className='bg-red-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
        onClick={getActivePlayers}
      >
        get tasks
      </button>

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full' 
        onClick={() => {
          loomConnect();
        }} >

          Connect
        </button>



      <br />

       { Object.keys(players).map((key) => {
        return (
          <div key={key}>
            {key}
            {players[key].position.x} {players[key].position.y} {players[key].position.z}
          </div>
        );
}
      )
   }
    </>
  );
}

export default TestingAoTemp;