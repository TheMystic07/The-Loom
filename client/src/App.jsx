import { Canvas  , extend, useThree, useFrame} from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ContactShadows } from "@react-three/drei";
import ChatBox from "./components/ChatRoom";
import VideoChat from "./components/VideoChat";
import Vid from "./components/Vid";
// import { Canvas,  } from "react-three-fiber";
import {
  CubeTextureLoader,
  // CubeCamera,
  // WebGLCubeRenderTarget,
  // RGBFormat,
  // LinearMipmapLinearFilter
} from "three";
//////////////////////////////////////////////////////////////////////////
import { Link, json } from 'react-router-dom'


function App() {

  

  function SkyBox() {
    const { scene } = useThree();
    const loader = new CubeTextureLoader();
    // The CubeTextureLoader load method takes an array of urls representing all 6 sides of the cube.
    const texture = loader.load([
      "/1.jpg",
      "/2.jpg",
      "/3.jpg",
      "/4.jpg",
      "/5.jpg",
      "/6.jpg"
    ]);
  
    // Set the scene background property to the resulting texture.
    scene.background = texture;
    return null;
  }







  return (
    <>
    {/* <button onClick={getActivePlayers}>Get Active Players</button> */}
    <div>
     
   <ChatBox /></div>
   <div><Vid/></div>
   {/* <Link to="/videChat">

   <button className="fixed z-10 bottom-0 right-0 bg-blue-500 text-white p-3 rounded-full shadow-lg m-4">VIDEOOO</button></Link> */}
    <Canvas shadows camera={{ position: [8,20,8], fov: 45 }}>
      <ContactShadows blur={2}/>
      <color attach="background" args={["#ececec"]} />
      <Experience />
      {/* <SkyBox /> */}
    </Canvas>
    </>
  );
}

export default App;
