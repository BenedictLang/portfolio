import React, { createContext, useState } from 'react';
import { Vector3 } from 'three';
import styles from '../../styles/pages/App.module.scss';
import THREEScene from './Scene/THREEScene';

export const ThreeSceneContext = createContext(undefined, undefined);

export const ThreeSceneProvider = ({ children }) => {
	const [threeSceneChildren, setThreeSceneChildren] = useState(null);
	const [cameraTarget, setCameraTarget] = useState(new Vector3(0, 0, 0));

	return (
		<ThreeSceneContext.Provider value={{ cameraTarget, setCameraTarget, setThreeSceneChildren }}>
			<div className={styles.webglContainer}>
				<THREEScene>{threeSceneChildren}</THREEScene>
			</div>
			{children}
		</ThreeSceneContext.Provider>
	);
};
