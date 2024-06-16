import { Environment, OrbitControls, useCursor } from "@react-three/drei";
import { ManInSuit } from "./ManInSuit";
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
import * as THREE from 'three'

import { useEffect, useState } from "react";
// import { useAtom , atom} from 'jotai'

export const Experience = () => {

  // const playersAtom = atom([])
  // const ao = connect();


  // const GenerateRandomPostion = () => {
  //   return [Math.random() * 3 ,  0 , Math.random() * 3]
  // }
  // const GenerateRandomHexColor = () => {
  //   return  "#" + Math.floor(Math.random()*16777215).toString(16); // i dont know what  this code means but it  works
  // }
const LoomProcess = "o8Gd7GjChwo0j8u7zRvI5XYlDFiC9tB5i7OTY5n2SyI"

// const [_players, setPlayers] = useAtom(playersAtom)
const [players, setPlayers] = useState([]);


const UpdatePlayerPosition = async (position) => {
  console.log("Updating Player Position", position);
  let pos = {
    "x": position.x,
    "y": position.y,
    "z": position.z
  }
  // pos = JSON.stringify(pos);
    await window.arweaveWallet.connect(["ACCESS_ADDRESS", "SIGN_TRANSACTION"]);
    const m_id = await message({
      process: LoomProcess,
      signer: createDataItemSigner(window.arweaveWallet),
      data: JSON.stringify(pos),
      tags: [{ name: "Action", value: "UpdatePlayerPosition" }],
    });
    const res = await ao.result({
      process: LoomProcess,
      message: m_id,
    });
    console.log(res);
}

const getActivePlayers = async () => {
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
}


useEffect(() => {
  setInterval(() => {
    getActivePlayers();
    console.log("Getting Active Players" , players);
  }, 2000); 
}, []);


const [onFloor, setOnFloor] = useState(false);
useCursor(onFloor)
  
// const players = useAtom(playersAtom)
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <OrbitControls />
<mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} onClick={(e)=> {
  // so i need to add a hander and pass e.point
  UpdatePlayerPosition(e.point);
} }
onPointerEnter={ ()=>{ setOnFloor(true)}}
onPointerLeave= { () => {setOnFloor(false)}}

>
    <planeGeometry args={[10, 10]} />
    <meshStandardMaterial color="blue" />
</mesh>


      {/* {players && Object.entries(players).map(([key, player]) => (
        <ManInSuit 
          key={key} 
          position={[player.position.x, player.position.y, player.position.z]} 
        />
      ))} */}

{ Object.keys(players).map((key) => {
        return (
          <ManInSuit key={key} position={new THREE.Vector3(players[key].position.x, players[key].position.y, players[key].position.z)  } />
          // <div key={key}>
          //   {key}
          //   {players[key].position.x} {players[key].position.y} {players[key].position.z}
          // </div>
        );
}
      )
   }
    </>
  );
};
