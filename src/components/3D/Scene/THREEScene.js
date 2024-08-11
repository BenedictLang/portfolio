import styles from './THREEScene.module.scss';
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import ParticleCloud from '../ParticleCloud';
import Effects from '../Postprocessing/Effects';
import { useMouse } from '../../Mouse/MouseProvider';
import { Vector3 } from 'three';
import StarField from '../Starfield';

const CameraController = () => {
	const { camera } = useThree();
	const mouse = useMouse();
	const targetCameraPosition = useRef(new Vector3(camera.position.x, camera.position.y, camera.position.z));

	useFrame(() => {
		const normalizedMouseX = (mouse.x / window.innerWidth) * 2 - 1;
		const normalizedMouseY = -(mouse.y / window.innerHeight) * 2 + 1;

		// Update target position based on mouse position
		const moveAmount = 1;
		const targetX = normalizedMouseX * moveAmount;
		const targetY = normalizedMouseY * moveAmount;

		// Set target camera position
		targetCameraPosition.current.set(targetX, targetY, camera.position.z);

		// Smoothly interpolate camera position
		camera.position.lerp(targetCameraPosition.current, 0.1);
		camera.rotation.x = normalizedMouseY * 0.1;
		camera.rotation.y = normalizedMouseX * 0.1;

		camera.lookAt(0, 0, 0);
	});

	return null;
};

const THREEScene = ({ children }) => {
	return (
		<div className={styles.container}>
			<Canvas camera={{ position: [0, 0, -17], fov: 45 }}>
				<CameraController />
				<ambientLight intensity={0.1} />
				<pointLight position={[10, 10, 10]} />
				<StarField count={1000} />
				<ParticleCloud shape="sphere" />
				<Effects />
				{children}
			</Canvas>
			<div className={styles.canvasOverlay}></div>
		</div>
	);
};

export default THREEScene;
