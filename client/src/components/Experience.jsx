import { Environment, OrbitControls } from "@react-three/drei";
import { ManInSuit } from "./ManInSuit";

export const Experience = () => {
  return (
    <>
      <Environment preset="city" />
      <ambientLight intensity={0.5} />
      <OrbitControls />
      <ManInSuit/>
      <ManInSuit position-x={2} hairColor="red" shirtColor="red"   />
    </>
  );
};
