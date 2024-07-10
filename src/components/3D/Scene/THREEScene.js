import React from 'react';
import { Canvas } from '@react-three/fiber';

const THREEScene = ({ children }) => {
	return (
		<Canvas camera={{ position: [0, 0, 50] }}>
			<ambientLight intensity={0.1} />
			{children}
		</Canvas>
	);
};

export default THREEScene;
