import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import vertexShader from './shader/vertexShader';
import fragmentShader from './shader/fragmentShader';

const BlobShaderMaterial = shaderMaterial(
	{
		u_time: 0,
		u_intensity: 0.5,
		u_frequency: 0,
		u_red: 0.2,
		u_green: 0.2,
		u_blue: 0.3,
		u_threshold: 0.5,
		u_strength: 0.5,
		u_radius: 0.8,
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
				red: 0.2,
				green: 0.2,
				blue: 0.3,
				frequency: 1.0,
				threshold: 0.5,
				strength: 0.5,
				radius: 0.8,
			};

			const colorsFolder = gui.addFolder('Colors');
			colorsFolder.add(params, 'red', 0, 1).onChange((value) => (materialRef.current.uniforms.u_red.value = value));
			colorsFolder.add(params, 'green', 0, 1).onChange((value) => (materialRef.current.uniforms.u_green.value = value));
			colorsFolder.add(params, 'blue', 0, 1).onChange((value) => (materialRef.current.uniforms.u_blue.value = value));

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
		meshRef.current.rotation.x += 0.001;
		meshRef.current.rotation.y += 0.001;
		materialRef.current.uniforms.u_time.value += delta;
		materialRef.current.uniforms.u_frequency.value = 10.0; // Example frequency value, change as needed
	});

	return (
		<mesh ref={meshRef} position={[0, 0, 0]}>
			<icosahedronGeometry args={[4, 20]} />
			<blobShaderMaterial ref={materialRef} wireframe={true} />
		</mesh>
	);
};

export default Blob;
