import { Environment, OrbitControls, useCursor, Text, Grid } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { Avatar } from "./Avatar";
import { LoomCity } from './LoomCity';
import {Hangar } from './Hangar'
import {
  result,
  message,
  dryrun,
  createDataItemSigner,
  connect
} from "@permaweb/aoconnect";
import * as THREE from 'three';
import { useEffect, useState, useRef } from "react";
import React from 'react';
import { Item } from "./Item";
import { useGrid } from "../hooks/useGrid";
import { useAtom } from "jotai";
import { buildModeAtom, shopModeAtom, draggedItemAtom, draggedItemRotationAtom } from "./UI";
import { Shop } from "./Shop";

export const Experience = () => {


  const [buildMode, setBuildMode] = useAtom(buildModeAtom);
  const [shopMode, setShopMode] = useAtom(shopModeAtom);
  const [draggedItem, setDraggedItem] = useAtom(draggedItemAtom);
  const [draggedItemRotation, setDraggedItemRotation] = useAtom(draggedItemRotationAtom);

  const ao = connect();
  const LoomProcess = "o8Gd7GjChwo0j8u7zRvI5XYlDFiC9tB5i7OTY5n2SyI";
  const [players, setPlayers] = useState([]);
  const [map, setMap] = useState(null);
  const [items, setItems] = useState({});
  const [onFloor, setOnFloor] = useState(false);
  const [dragPosition, setDragPosition] = useState([0, 0]);
  const [canDrop, setCanDrop] = useState(false);

  const { vector3ToGrid, gridToVector3 } = useGrid(map);

  const UpdatePlayerPosition = async (position) => {
    if (!buildMode) {
      let pos = {
        x: position.x,
        y: position.y,
        z: position.z
      };
      await window.arweaveWallet.connect(["ACCESS_ADDRESS"]);
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
    } else {
      if (draggedItem !== null) {
        if (canDrop) {
          setItems((prevItems) => {
            const newItems = { ...prevItems };
            newItems[draggedItem].gridPosition = vector3ToGrid(position);
            newItems[draggedItem].rotation = draggedItemRotation;
            return newItems;
          });
        }
        setDraggedItem(null);
      }
    }
  };

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
  };

  const getMapData = async () => {
    const addr = await window.arweaveWallet.getActiveAddress();
    const res = await dryrun({
      process: LoomProcess,
      tags: [
        {
          name: "Action",
          value: "GetMapData",
        },
      ],
    });
    const { Messages } = res;
    const mapRes = Messages[0].Data;
    const mapJson = JSON.parse(mapRes);
    setMap(mapJson[0]);
  };

  const updateMapData = async (items) => {
    const addr = await window.arweaveWallet.getActiveAddress();
    const m_id = await message({
      process: LoomProcess,
      signer: createDataItemSigner(window.arweaveWallet),
      data: JSON.stringify(items),
      tags: [{ name: "Action", value: "UpdateMap" }],
    });
    const res = await ao.result({
      process: LoomProcess,
      message: m_id,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      getActivePlayers();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    getMapData();
  }, []);

  useEffect(() => {
    if (map && map.items) {
      setItems(map.items);
    }
  }, [map]);

  useCursor(onFloor);

  useEffect(() => {
    if (!map || !draggedItem || !buildMode) return;

    const item = map.items[draggedItem];
    if (!item || !dragPosition) return;

    const width = item.rotation === 1 || item.rotation === 3 ? item.item.size[1] : item.item.size[0];
    const height = item.rotation === 1 || item.rotation === 3 ? item.item.size[0] : item.item.size[1];

    let dropable = true;
    if (
      dragPosition[0] < 0 ||
      dragPosition[0] + width > map.size[0] * map.gridDivision ||
      dragPosition[1] < 0 ||
      dragPosition[1] + height > map.size[1] * map.gridDivision
    ) {
      dropable = false;
    }

    setCanDrop(dropable);
  }, [draggedItem, dragPosition, draggedItemRotation , map , buildMode]);

  const state = useThree((state) => state);

  useEffect(() => {
    if (!map) return;

    if (buildMode) {
      setItems(map?.items);
      state.camera.position.set(8, 8, 8);
      if (controls.current) {
        controls.current.target.set(0, 0, 0);
      }
    } else {
      updateMapData(items);
    }
  }, [buildMode]);

  useEffect(() => {
    if (!map) return;

    if (shopMode) {
      state.camera.position.set(0, 4, 8);
      if (controls.current) {
        controls.current.target.set(0, 0, 0);
      }
    } else {
      updateMapData(items);
    }
  }, [shopMode]);

  const controls = useRef();
  const onItemSelected = (item) => {
    setShopMode(false);
    
    const newItemId = `item_${Object.keys(items).length}`;
    
    const newItem = {
      item: item.item,
      gridPosition: [0, 0],
      // tmp: true,
    };
    
    setItems((prevItems) => ({
      ...prevItems,
      [newItemId]: newItem,
    }));
    
    setDraggedItem(newItemId);
    setDraggedItemRotation(0);
    
    const updatedItems = {
      ...items,
      [newItemId]: newItem,
    };
    
    updateMapData(updatedItems);
    
    setMap((prevMap) => ({
      ...prevMap,
      items: updatedItems,
    }));
  };
  
  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.1} />
      <directionalLight position={[-4, 4, -4]} castShadow intensity={0.35}  shadow-mapSize={[1024,1024]}>
        <orthographicCamera attach={`shadow-camera`} args={[-map?.size[0], map?.size[1], 10,-10  ] }  far = {map?.size[0] + map?.size[1] } />
      </directionalLight>
      <OrbitControls
        ref={controls}
        minDistance={5}
        maxDistance={30}
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2}
        screenSpacePanning={false}
        enableZoom={!shopMode}
      />

      {!shopMode && Object.keys(items).map((key) => (
        <Item
          key={key}
          item={items[key]}
          map={map}
          onClick={() => {
            if (buildMode) {
              setDraggedItem(key);
              setDraggedItemRotation(items[key].rotation || 0);
            }
          }}
          isDragging={buildMode ? draggedItem === key : false}
          dragPosition={dragPosition}
          canDrop={canDrop}
          dragRotation={draggedItemRotation}
        />
      ))}
      {shopMode && <Shop onItemSelected={onItemSelected} items={items} map={map} />}
      {!shopMode && (
        <mesh
          position={[map?.size[0] / 2, -0.001, map?.size[1] / 2]}
          rotation={[-Math.PI / 2, 0, 0]}
          onClick={(e) => UpdatePlayerPosition(e.point)}
          onPointerMove={(e) => {
            if (!buildMode) return;
            const newPosition = vector3ToGrid(e.point);
            if (!draggedItem || !dragPosition || newPosition[0] !== dragPosition[0] || newPosition[1] !== dragPosition[1]) {
              setDragPosition(newPosition);
            }
          }}
          onPointerEnter={() => setOnFloor(true)}
          onPointerLeave={() => setOnFloor(false)}
          position-x={map?.size[0] / 2}
          position-z={map?.size[1] / 2}
          receiveShadow
        >
          <planeGeometry args={map?.size} />
          <meshStandardMaterial color="coral" />
        </mesh>
      )}
      {buildMode && !shopMode && <Grid infiniteGrid fadeDistance={50} fadeStrength={5} />}
      {!buildMode && players && Object.keys(players).map((key) => {
        const player = players[key];
        const position = new THREE.Vector3(player.position.x, player.position.y, player.position.z);

        return (
          <React.Fragment key={key}>
            <Avatar
              position={position}
              hairColor={player.hairColor}
              skinColor={player.skinColor}
              shirtColor={player.shirtColor}
              pantsColor={player.pantColor}
              id={key}
            />
          </React.Fragment>
        );
      })}
    </>
  );
};
