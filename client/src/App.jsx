import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ContactShadows } from "@react-three/drei";

function App() {
  return (
    <Canvas shadows camera={{ position: [8,8,8], fov: 30 }}>
      <ContactShadows blur={2}/>
      <color attach="background" args={["#ececec"]} />
      <Experience />
    </Canvas>
  );
}

export default App;
