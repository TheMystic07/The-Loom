/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/LoomCity.glb -o src/components/LoomCityNew.jsx -r public 
*/

import React from 'react'
import { useGLTF } from '@react-three/drei'

export function LoomCityNew(props) {
  const { nodes, materials } = useGLTF('/models/LoomCity.glb')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Cube016.geometry} material={materials.multi} />
      <mesh geometry={nodes.Cube016_1.geometry} material={materials.PaletteMaterial001} />
      <mesh geometry={nodes.Nuvole_medie.geometry} material={materials.multicolor} />
      <mesh geometry={nodes.Icosphere020.geometry} material={materials.sassy} />
      <mesh geometry={nodes.Cylinder_2.geometry} material={materials.PaletteMaterial002} />
      <mesh geometry={nodes.SEMAFORO001.geometry} material={materials.PaletteMaterial003} />
    </group>
  )
}

useGLTF.preload('/models/LoomCity.glb')