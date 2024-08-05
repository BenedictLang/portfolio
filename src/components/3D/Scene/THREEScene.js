import React, { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import { useThree, extend, useFrame } from '@react-three/fiber';
import Blob from '../Blob';
import * as THREE from 'three';

extend({ EffectComposer, RenderPass, UnrealBloomPass });

const Effects = () => {
	const { gl, scene, camera, size } = useThree();
	const composer = useRef();
	useEffect(() => void composer.current.setSize(size.width, size.height), [size]);
	useFrame(() => composer.current.render(), 1);

	return (
		<effectComposer ref={composer} args={[gl]}>
			<renderPass attachArray="passes" args={[scene, camera]} />
			<unrealBloomPass attachArray="passes" args={[new THREE.Vector2(size.width, size.height), 1.5, 0.4, 0.85]} />
		</effectComposer>
	);
};

const THREEScene = ({ children }) => {
	return (
		<Canvas camera={{ position: [0, -2, 14], fov: 45 }}>
			<ambientLight intensity={0.1} />
			<Blob shape="sphere" />
			{children}
			<Effects />
		</Canvas>
	);
};

export default THREEScene;
