import { Canvas  , extend, useThree, useFrame} from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ContactShadows } from "@react-three/drei";
// import { Canvas,  } from "react-three-fiber";
import {
  CubeTextureLoader,
  // CubeCamera,
  // WebGLCubeRenderTarget,
  // RGBFormat,
  // LinearMipmapLinearFilter
} from "three";


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
    <Canvas shadows camera={{ position: [8,8,8], fov: 30 }}>
      <ContactShadows blur={2}/>
      <color attach="background" args={["#ececec"]} />
      <Experience />
      {/* <SkyBox /> */}
    </Canvas>
    </>
  );
}

export default App;
