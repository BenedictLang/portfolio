import React, { useRef, useEffect } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import vertexShader from '../Shader/StarfieldVertexShader';
import fragmentShader from '../Shader/StarfieldFragmentShader';

const StarFieldMaterial = shaderMaterial(
	{
		u_time: 0,
	},
	vertexShader,
	fragmentShader,
);

extend({ StarFieldMaterial });

const StarField = ({ count = 500 }) => {
	const materialRef = useRef();
	const pointsRef = useRef();

	useEffect(() => {
		const positions = new Float32Array(count * 3);
		for (let i = 0; i < count * 3; i++) {
			positions[i] = Math.random() * 200 - 100;
		}
		pointsRef.current.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	}, [count]);

	useFrame((state, delta) => {
		materialRef.current.uniforms.u_time.value += delta;
	});

	return (
		<points ref={pointsRef}>
			<bufferGeometry />
			<starFieldMaterial ref={materialRef} />
		</points>
	);
};

export default StarField;
