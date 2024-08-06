import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import vertexShader from './shader/vertexShader';
import fragmentShader from './shader/fragmentShader';

const BlobShaderMaterial = shaderMaterial(
	{
		u_time: 0,
		u_frequency: 11,
		u_red: 0.2,
		u_green: 0.4,
		u_blue: 0.4,
		u_intensity: 2,
	},
	vertexShader,
	fragmentShader,
);

extend({ BlobShaderMaterial });

const Blob = () => {
	const pointsRef = useRef();
	const materialRef = useRef();

	useEffect(() => {
		let gui;
		async function init() {
			const { GUI } = await import('dat.gui');
			gui = new GUI();
			const params = {
				red: 0.2,
				green: 0.4,
				blue: 0.4,
				intensity: 2,
				frequency: 11,
			};

			const colorsFolder = gui.addFolder('Colors');
			colorsFolder.add(params, 'red', 0, 1).onChange((value) => (materialRef.current.uniforms.u_red.value = value));
			colorsFolder.add(params, 'green', 0, 1).onChange((value) => (materialRef.current.uniforms.u_green.value = value));
			colorsFolder.add(params, 'blue', 0, 1).onChange((value) => (materialRef.current.uniforms.u_blue.value = value));
			colorsFolder
				.add(params, 'intensity', 0, 3)
				.onChange((value) => (materialRef.current.uniforms.u_intensity.value = value));

			const animationFolder = gui.addFolder('Animation');
			animationFolder
				.add(params, 'frequency', 0, 50)
				.onChange((value) => (materialRef.current.uniforms.u_frequency.value = value));
		}

		init().then(() => {});

		return () => {
			gui.destroy();
		};
	}, []);

	useFrame((state, delta) => {
		materialRef.current.uniforms.u_time.value += delta;
		if (pointsRef.current) {
			pointsRef.current.rotation.y += 0.001;
			pointsRef.current.rotation.x += 0.0012;
			pointsRef.current.rotation.z += 0.001;
		}
	});

	return (
		<points ref={pointsRef} position={[0, 0, 0]}>
			<icosahedronGeometry args={[3, 30]} />
			<blobShaderMaterial ref={materialRef} />
		</points>
	);
};

export default Blob;
