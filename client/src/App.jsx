import { Canvas  , extend, useThree, useFrame} from "@react-three/fiber";
import { Experience } from "./components/Experience";
import ChatBox from "./components/ChatRoom";
import VideoChat from "./components/VideoChat";
import Vid from "./components/Vid";

import { ContactShadows, ScrollControls } from "@react-three/drei";
import {HangarExp} from "./components/HangarExp";
import { Link, json } from 'react-router-dom'

// import { Canvas,  } from "react-three-fiber";
import {
  CubeTextureLoader,
  // CubeCamera,
  // WebGLCubeRenderTarget,
  // RGBFormat,
  // LinearMipmapLinearFilter
} from "three";
import { UI } from "./components/UI";
// import  Hangar from "./components/Hangar";


function App() {

  

  




  return (
    <>
     <div>
     
     <ChatBox /></div>
     <div><Vid/></div>
  
    {/* <button onClick={getActivePlayers}>Get Active Players</button> */}
    <Canvas shadows camera={{ position: [8,20,8], fov: 30 }}>
      <color attach="background" args={["#ececec"]} />
      <ScrollControls pages={4}>
      <Experience />
      </ScrollControls>
      {/* <SkyBox /> */}
    </Canvas>
    <UI/>
    </>
  );
}

export default App;
