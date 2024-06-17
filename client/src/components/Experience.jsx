import { Environment, OrbitControls, useCursor, Text } from "@react-three/drei";
import { ManInSuit } from "./ManInSuit";
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

export const Experience = () => {

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
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <mesh position={[0, -0.001, 0]} rotation={[-Math.PI / 2, 0, 0]} 
        onClick={(e) => UpdatePlayerPosition(e.point)}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="blue" />
      </mesh>

      {Object.keys(players).map((key) => {
        const player = players[key];
        const position = new THREE.Vector3(player.position.x, player.position.y, player.position.z);

        return (
          <group key={key} position={position}>
            <ManInSuit 
              position={position} 
              hairColor={player.hairColor} 
              skinColor={player.skinColor} 
              shirtColor={player.shirtColor} 
              pantsColor={player.pantColor} 
            />
            <Text
              position={[player.position.x, 5, player.position.z]} // Adjusted position to appear above the player
              fontSize={1}
              color={player.shirtColor}
              anchorX="center"
              anchorY="middle"
              frustumCulled={false} // Ensures the text doesn't interact with pointer events
            >
              {truncate(key, 10)}
            </Text>
          </group>
        );
      })}
    </>
  );
};
