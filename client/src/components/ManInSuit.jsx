/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.18 .\public\models\Man in Suit.glb -o ./src/Components/ManInSuit.jsx -r public 
*/

import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { log } from 'three/examples/jsm/nodes/Nodes.js'
import { useGraph } from '@react-three/fiber'
import { SkeletonUtils } from 'three-stdlib'

export function ManInSuit({
  hairColor = '#000000',
  skinColor = '#ffcc99',
  shirtColor = 'black',
  pantsColor = 'black',
  ...props
}) {
  const group = useRef()
  const { scene, materials, animations } = useGLTF('/models/Man in Suit.glb')

  const clone = useMemo(()=> SkeletonUtils.clone(scene,), [scene] )
  const {nodes} = useGraph(clone)


  const { actions } = useAnimations(animations, group)
  const [animation , setAnimation] =  useState('HumanArmature|Man_Run');

  useEffect(() => {
    actions[animation].reset().fadeIn(0.5) .play()
    return () => actions[animation].fadeOut(0.5)
  } , [animation])

  console.log(actions);
  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Root_Scene">
        <group name="RootNode">
          <group name="HumanArmature" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <primitive object={nodes.Bone} />
          </group>
          <group name="BaseHuman" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
            <skinnedMesh name="BaseHuman_1" geometry={nodes.BaseHuman_1.geometry} material={materials.Shirt} skeleton={nodes.BaseHuman_1.skeleton} > <meshStandardMaterial color={shirtColor} /> </skinnedMesh>
            <skinnedMesh name="BaseHuman_2" geometry={nodes.BaseHuman_2.geometry} material={materials.Pants} skeleton={nodes.BaseHuman_2.skeleton} > 
              <meshStandardMaterial color={pantsColor} /> </skinnedMesh>
            <skinnedMesh name="BaseHuman_3" geometry={nodes.BaseHuman_3.geometry} material={materials.Eyes} skeleton={nodes.BaseHuman_3.skeleton} />
            <skinnedMesh name="BaseHuman_4" geometry={nodes.BaseHuman_4.geometry} material={materials.Skin} skeleton={nodes.BaseHuman_4.skeleton} >
              <meshStandardMaterial color={skinColor} /> </skinnedMesh>
            <skinnedMesh name="BaseHuman_5" geometry={nodes.BaseHuman_5.geometry} material={materials.Hair} skeleton={nodes.BaseHuman_5.skeleton} >
              <meshStandardMaterial color={hairColor} /> </skinnedMesh>
            <skinnedMesh name="BaseHuman_6" geometry={nodes.BaseHuman_6.geometry} material={materials.Details} skeleton={nodes.BaseHuman_6.skeleton} />
            <skinnedMesh name="BaseHuman_7" geometry={nodes.BaseHuman_7.geometry} material={materials.TieTexture} skeleton={nodes.BaseHuman_7.skeleton} />
          </group>
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/Man in Suit.glb')
