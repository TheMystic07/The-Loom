import { Environment, OrbitControls, useCursor, Text } from "@react-three/drei";
import { ManInSuit } from "./ManInSuit";
import {LoomCity} from './LoomCity'
import {
  result,
  results,
  message,
  spawn,
  monitor,
  unmonitor,
  dryrun,
  createDataItemSigner,
  connect
} from "@permaweb/aoconnect";
import * as THREE from 'three'
import { useEffect, useState } from "react";
import  React from 'react'
// import { AllData } from "./ao_contract";
// import { message, result, createDataItemSigner, dryrun } from "@permaweb/aoconnect";
import {useActiveAddress } from 'arweave-wallet-kit';
import { useAuth } from '../store/auth';


export const Experience = () => {
  const { all, AllData } = useAuth();
  const user=useActiveAddress();

  // useEffect(() => {
   
  //      AllData();
 
  //      for(let i=(all.length-1);i>-1;i--){
  //      if (all[i].SentBy==user){
  //       setAllChatData(all[i].Data);
  //       break;
  //      }
  //    }
  // }, [AllData]);



  const [allChatData,setAllChatData]=useState("");
  // useEffect(() => {
  //   AllData();
  //   const interval = setInterval(AllData, 5000); 
  //   return () => clearInterval(interval); 
  // }, []);

  // const stripAnsiCodes = (str) =>
  //   str.replace(
  //     /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
  //     ""
  //   );
    
  // const AllData = async () => {
  //   try {
  //     const messageId = await dryrun({
  //       process: "hF1fU8-VrvsPBLYY6VWqMxAa_rFocOnEvckkJBrcpoo",
  //       tags: [{ name: "Action", value: "Chat" }],
  //       data: `Send({Target="hF1fU8-VrvsPBLYY6VWqMxAa_rFocOnEvckkJBrcpoo",Action="Chat"})`,
  //     });
  //     console.log("AllData id : " + messageId);
  //     console.log("AllData data " + stripAnsiCodes(messageId.Output.data));

      

  //      const data=(JSON.parse(stripAnsiCodes(messageId.Output.data)));

  //    for(let i=(data.length-1);i>-1;i--){
  //      if (data[i].SentBy==user){
  //       setAllChatData(data[i].Data);
  //       break;
  //      }
  //    }

  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // // const chatData=AllData();

  const ao = connect();
  const LoomProcess = "o8Gd7GjChwo0j8u7zRvI5XYlDFiC9tB5i7OTY5n2SyI"
  const [players, setPlayers] = useState([]);

  const UpdatePlayerPosition = async (position) => {
    console.log("Updating Player Position", position);
    let pos = {
      "x": position.x,
      "y": position.y,
      "z": position.z
    }
    await window.arweaveWallet.connect(["ACCESS_ADDRESS"  ] );
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
    const interval = setInterval(() => {
      getActivePlayers();
      console.log("tick");
    }, 1000); 
    return () => clearInterval(interval);
  }, []);

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  const truncate = (str, maxLength) => {
    return str.length > maxLength ? str.substring(0, maxLength) + "..." : str;
  };

  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.25} />
      <OrbitControls />
      <mesh position={[0, -0.001, 0]} rotation={[0, 0, 0]} 
        onClick={(e) => UpdatePlayerPosition(e.point)}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}>
        {/* <planeGeometry args={[10, 10]} />\ */}
      <LoomCity />
        {/* <meshStandardMaterial color="blue" /> */}
      </mesh>

      {Object.keys(players).map((key) => {
        const player = players[key];
        const position = new THREE.Vector3(player.position.x, player.position.y, player.position.z);

        return (

          
          <React.Fragment key={key}>

          <ManInSuit 
            position={position} 
            hairColor={player.hairColor} 
            skinColor={player.skinColor} 
            shirtColor={player.shirtColor} 
            pantsColor={player.pantColor} 
          />
         
            <Text
              position={[position.x, position.y + 5, position.z]} // Position the text above the player
              fontSize={0.5}
              color={player.shirtColor}
              anchorX="center"
              anchorY="middle"
              frustumCulled={false} // Ensures the text doesn't interact with pointer events
            >
              {truncate(key, 10)}
            </Text>
            {/* <Text
              position={[position.x, position.y + 8, position.z]} // Position the text above the player
              fontSize={0.5}
              color={player.shirtColor}
              anchorX="center"
              anchorY="middle"
              frustumCulled={false} // Ensures the text doesn't interact with pointer events
            >
             {truncate(allChatData,15)}
            </Text> */}
          
        </React.Fragment>
        );
      })}
    </>
  );
};
