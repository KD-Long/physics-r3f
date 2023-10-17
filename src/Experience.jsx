import { OrbitControls, useGLTF, PivotControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { InstancedRigidBodies, Physics, RigidBody, CuboidCollider, CylinderCollider, MeshCollider } from '@react-three/rapier'
import { useMemo, useRef, useState, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Hamburger from './Hamburger'
import HamburgerB from './HamburgerB'

import React from 'react'



export default function Experience() {

    const cubeRef = useRef()
    const cubeColRef = useRef()
    const twisterRef = useRef()
    // const [count, setCount] = useState(0);
    const [hitSound] = useState(() => { return new Audio('./hit.mp3') })

    const ham = useGLTF('/hamburger.glb')

    const cubeCount = 200;
    const cubes = useRef()

    const burgerArr = [...Array(10)]


    const cubeClick = () => {
        const mass = cubeRef.current.mass()
        console.log(mass)
        cubeRef.current.applyImpulse({ x: 0, y: 5 * mass, z: 0 })
        cubeRef.current.applyTorqueImpulse({
            x: Math.random() - .5,
            y: Math.random() - .5,
            z: Math.random() - .5,
        })
    }
    useFrame((state) => {
        const elapsedTime = state.clock.elapsedTime

        //spinning
        //euler rotaion
        const euler = new THREE.Euler(0, -elapsedTime * 4, 0)
        const quarternion = new THREE.Quaternion()
        quarternion.setFromEuler(euler)
        twisterRef.current.setNextKinematicRotation(quarternion) //needs quarternion

        // circle path on the floor
        const angle = state.clock.elapsedTime * 1.5
        const diameter = 3
        const x = Math.sin(angle) * diameter
        const y = Math.cos(angle) * diameter
        twisterRef.current.setNextKinematicTranslation({ x: x, y: -0.8, z: y })


    })

    const cubeCollisionEnter = () => {
        console.log('cube collision!')
        hitSound.currentTime = 0 // resets the sound when second collision
        // hitSound.volume = Math.random()+1 // randomize sounds
        hitSound.play()

    }
    // onlyneed this on threejs side 'InstancedRigidBodies' handles this for us
    // useEffect(() => {
    //     for (let i = 0; i < cubeCount; i++) {
    //         const matrix = new THREE.Matrix4()
    //         matrix.compose(
    //             new THREE.Vector3(i * 2, 0, 0),
    //             new THREE.Quaternion(),
    //             new THREE.Vector3(1, 1, 1),
    //         )
    //         cubes.current.setMatrixAt(i, matrix)
    //     }
    // }, [])

    // initial setup for instance bodies
    const instances = useMemo(() => {
        const instances = []
        for (let i = 0; i < cubeCount; i++) {

            instances.push({
                key: 'instance_' + i,
                position: [
                    (Math.random() - 0.5) * 16,
                    6 + i * 0.3,
                    (Math.random() - 0.5) * 16],
                rotation: [0, 0, 0]
            })
        }
        return instances
    }, [])


    return <>

        <Perf position="top-left" />

        <OrbitControls makeDefault />

        <directionalLight castShadow position={[1, 2, 3]} intensity={1.5} />
        <ambientLight intensity={0.5} />

        <Physics
            // debug
            gravity={[0, -9.08, 0]}
        >
            {/* Shpere */}
            <RigidBody
                colliders='ball'
            >
                <mesh castShadow position={[-1.5, 2, 0]}>
                    <sphereGeometry />
                    <meshStandardMaterial color="orange" />
                </mesh>
            </RigidBody>

            {/* Cube */}
            <RigidBody
                friction={0.7}
                restitution={1}
                gravityScale={1}
                ref={cubeRef}
                position={[2, 2, 0]}
                colliders={false}
                onCollisionEnter={cubeCollisionEnter}
            >
                <CuboidCollider
                    ref={cubeColRef}
                    args={[0.5, 0.5, 0.5]}
                />
                <mesh
                    castShadow
                    onClick={cubeClick}
                >
                    <boxGeometry />
                    <meshStandardMaterial color="mediumpurple" />
                </mesh>
            </RigidBody>


            {/* twister */}
            <RigidBody
                ref={twisterRef}
                type='kinematicPosition'
                position={[0, - 0.8, 0]}
                rotation-y={Math.PI * .5}
                friction={0}
            >
                <mesh>
                    <boxGeometry args={[5, 0.2, 0.2]} />
                    <meshStandardMaterial color='red' />
                </mesh>
            </RigidBody>


            {/* <PivotControls
                anchor={[0, 0, 0]}
                depthTest={false}
                lineWidth={4}
                axisColors={['#9381ff', '#ff4d6d', '#7ae582']}
                scale={200}
                fixed={true}

            > */}


            {/* </PivotControls> */}



            {/* Torus */}
            <RigidBody position={[0, 0, 0]} rotation-x={Math.PI * .5}
                // colliders='ball' // sphere shapes
                // colliders='hull' // convex mebrane around obj (good perf)
                // colliders='trimesh' // best result (bad for moving rigid bodies-bugs as they are hollow inside)
                colliders={false} // set this if you want to make custom colider
            >
                <CuboidCollider args={[1.5, 1.5, 0.5]} />
                <mesh castShadow>
                    <torusGeometry args={[1, 0.5, 16, 32]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </RigidBody>

            {/* Floor */}
            <RigidBody
                type='fixed'
                restitution={0}
                friction={0.7}

            >
                <mesh receiveShadow position-y={- 1.25}>
                    <boxGeometry args={[20, 0.5, 20]} />
                    <meshStandardMaterial color="greenyellow" />
                </mesh>
            </RigidBody>

            {/* Walls */}
            <RigidBody
                type='fixed'
            >
                <CuboidCollider args={[10, 2, 0.5]} position={[0, 1, 10.25]} />
                <CuboidCollider args={[10, 2, 0.5]} position={[0, 1, -10.25]} />

                <CuboidCollider args={[.5, 2, 10]} position={[10.25, 1, 0]} />
                <CuboidCollider args={[.5, 2, 10]} position={[-10.25, 1, 0]} />

            </RigidBody>


            {/* Many cubes  */}

            <InstancedRigidBodies instances={instances}>
                <instancedMesh castShadow args={[null, null, cubeCount]}>
                    <boxGeometry />
                    <meshNormalMaterial />

                </instancedMesh>
            </InstancedRigidBodies>

            {/* Instance mesh three js only with no rigid bodies (requires matrix4 set in use effect) */}
            {/* <instancedMesh ref={cubes} castShadow args={[null, null, cubeCount]}>
                <boxGeometry />
                <meshStandardMaterial color='tomato' />

            </instancedMesh> */}




            {burgerArr.map((value, i) => {
                return <Hamburger key={i}
                    position={[
                        (Math.random() - 0.5) * 16,
                        6 + i * 6.3,
                        (Math.random() - 0.5) * 16
                    ]}
                    scale={(i * .55 * .5) / 10}
                />
            })}
            {burgerArr.map((value, i) => {
                return <HamburgerB key={'B' + i} position={[
                    (Math.random() - 0.5) * 16,
                    6 + i * 6.3,
                    (Math.random() - 0.5) * 16
                ]}
                    scale={(i * .55 * .5) / 10}
                />
            })}




        </Physics >

    </>
}