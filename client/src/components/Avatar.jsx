import { useActiveAddress } from 'arweave-wallet-kit';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGLTF, useAnimations, Text } from '@react-three/drei';
import { useFrame, useGraph } from '@react-three/fiber';
import { SkeletonUtils } from 'three-stdlib';
import * as THREE from 'three';

const MOVEMENT_SPEED = 0.022;

export function Avatar({
  hairColor = "green",
  topColor = "pink",
  bottomColor = "brown",
  id,
  avatarUrl = "https://models.readyplayer.me/64f0265b1db75f90dcfd9e2c.glb",
  ...props
}) {
  const position = useMemo(() => props.position, []);
  const avatar = useRef();
  const textPosition = useRef(new THREE.Vector3());

  const group = useRef();
  const { scene } = useGLTF(avatarUrl);
  const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
  const { nodes } = useGraph(clone);

  const { animations: walkAnimation } = useGLTF("/animations/M_Walk_001.glb");
  const { animations: danceAnimation } = useGLTF("/animations/M_Dances_001.glb");
  const { animations: idleAnimation } = useGLTF("/animations/M_Standing_Idle_001.glb");

  const { actions } = useAnimations(
    [walkAnimation[0], idleAnimation[0], danceAnimation[0]],
    avatar
  );
  const [animation, setAnimation] = useState("M_Standing_Idle_001");

  useEffect(() => {
    clone.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [clone]);

  useEffect(() => {
    actions[animation].reset().fadeIn(0.32).play();
    return () => actions[animation]?.fadeOut(0.32);
  }, [animation, actions]);

  const user = useActiveAddress();
  
  useFrame((state, delta) => {
    const hips = avatar.current.getObjectByName("Hips");
    hips.position.set(0, hips.position.y, 0);

    const targetPosition = props.position.clone();

    if (group.current.position.distanceTo(targetPosition) > 0.1) {
      const direction = group.current.position
        .clone()
        .sub(targetPosition)
        .normalize()
        .multiplyScalar(MOVEMENT_SPEED);
      group.current.position.sub(direction);
      group.current.lookAt(targetPosition);
      setAnimation("M_Walk_001");
    } else {
      setAnimation("M_Standing_Idle_001");
    }

    if (id === user) {
      state.camera.position.x = group.current.position.x + 8;
      state.camera.position.y = group.current.position.y + 8;
      state.camera.position.z = group.current.position.z + 8;
      state.camera.lookAt(group.current.position);
    }

    // Update the text position smoothly
    textPosition.current.lerp(group.current.position.clone().add(new THREE.Vector3(0,  1, 0)), 0.1);
  });

  return (
    <group
      ref={group}
      {...props}
      position={position}
      dispose={null}
      name={`character-${id}`}
    >
      <primitive object={clone} ref={avatar} />
      <Text
        position={[0,  2 , 0]} // Use the smooth position for the text
        fontSize={0.15}
        color={bottomColor}
        anchorX="center"
        anchorY="middle"
        frustumCulled={false} // Ensures the text doesn't interact with pointer events
      >
        {id.substring(0, 10)}...
      </Text>
    </group>
  );
}

useGLTF.preload("/animations/M_Walk_001.glb");
useGLTF.preload("/animations/M_Standing_Idle_001.glb");
useGLTF.preload("/animations/M_Dances_001.glb");
