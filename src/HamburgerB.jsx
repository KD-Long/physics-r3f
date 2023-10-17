/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.2.13 ./public/hamburger.glb 
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { MeshCollider, RigidBody } from '@react-three/rapier'

export default function HamburgerB(props) {
  const { nodes, materials } = useGLTF('/hamburger.glb')
  console.log(nodes)
  return (
    <group {...props} dispose={null}>
      <RigidBody
        gravityScale={2}
        colliders='cuboid'
      >


        <mesh geometry={nodes.bottomBun.geometry} material={materials.BunMaterial} position={[0, -2.331, 0]} />

        <mesh geometry={nodes.meat.geometry} material={materials.SteakMaterial} position={[0, 0.486, 0]} />

        <mesh geometry={nodes.cheese.geometry} material={materials.CheeseMaterial} position={[0, 0.709, 0]} />
        <mesh geometry={nodes.topBun.geometry} material={materials.BunMaterial} position={[0, -0.56, 0]} />

      </RigidBody >
    </group>

  )
}

useGLTF.preload('/hamburger.glb')