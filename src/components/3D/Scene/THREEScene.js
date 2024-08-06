import React from 'react';
import { Canvas } from '@react-three/fiber';
import Blob from '../Blob';
import Effects from '../Postprocessing/Effects';

const THREEScene = ({ children }) => {
	return (
		<Canvas camera={{ position: [0, -2, 14], fov: 45 }}>
			<ambientLight intensity={0.1} />
			<Blob shape="sphere" />
			<Effects />
			{children}
		</Canvas>
	);
};

export default THREEScene;
