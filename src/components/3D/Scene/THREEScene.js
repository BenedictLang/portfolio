import styles from './THREEScene.module.scss';
import React, { useContext } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleCloud from '../Objects/ParticleCloud';
import Effects from '../Postprocessing/Effects';
import StarField from '../Objects/Starfield';
import CameraController from './CameraController';
import { ThreeSceneContext } from '../ThreeSceneProvider';

const THREEScene = ({ children }) => {
	const { cameraTarget } = useContext(ThreeSceneContext);

	return (
		<div className={styles.container}>
			<Canvas camera={{ position: [0, 0, -17], fov: 45 }}>
				<CameraController target={cameraTarget} />
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
