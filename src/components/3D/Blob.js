import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import vertexShader from './shader/vertexShader.glsl';
import fragmentShader from './shader/fragmentShader.glsl';

const BlobShaderMaterial = shaderMaterial(
	{
		u_time: 0,
		u_frequency: 0,
		u_red: 1.0,
		u_green: 1.0,
		u_blue: 1.0,
	},
	vertexShader,
	fragmentShader,
);

extend({ BlobShaderMaterial });

const Blob = () => {
	const meshRef = useRef();
	const materialRef = useRef();

	useEffect(() => {
		let gui;
		async function init() {
			const { GUI } = await import('dat.gui');
			gui = new GUI();
			const params = {
				red: 1.0,
				green: 1.0,
				blue: 1.0,
				frequency: 1.0,
				threshold: 0.5,
				strength: 0.5,
				radius: 0.8,
			};

			const colorsFolder = gui.addFolder('Colors');
			colorsFolder.add(params, 'red', 0, 1);
			colorsFolder.add(params, 'green', 0, 1);
			colorsFolder.add(params, 'blue', 0, 1);

			const bloomFolder = gui.addFolder('Bloom');
			bloomFolder.add(params, 'threshold', 0, 1);
			bloomFolder.add(params, 'strength', 0, 3);
			bloomFolder.add(params, 'radius', 0, 1);
		}

		init().then(() => {});

		// Add other parameters to the GUI as needed
		return () => {
			gui.destroy();
		};
	}, []);

	useFrame((state, delta) => {
		meshRef.current.rotation.x += 0.01;
		meshRef.current.rotation.y += 0.01;
		materialRef.current.uniforms.u_time.value += delta;
		materialRef.current.uniforms.u_frequency.value = 10.0; // Example frequency value, change as needed
	});

	return (
		<mesh ref={meshRef}>
			<icosahedronGeometry args={[4, 30]} />
			<blobShaderMaterial ref={materialRef} wireframe />
		</mesh>
	);
};

export default Blob;
