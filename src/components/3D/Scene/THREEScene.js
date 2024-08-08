import React, { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import ParticleCloud from '../ParticleCloud';
import Effects from '../Postprocessing/Effects';

const THREEScene = ({ children }) => {
	const axesRef = useRef();

	return (
		<Canvas camera={{ position: [0, 0, -17], fov: 45 }}>
			<axesHelper ref={axesRef} args={[5]} />
			<ambientLight intensity={0.1} />
			<pointLight position={[10, 10, 10]} />
			<ParticleCloud shape="sphere" />
			<Effects />
			{children}
		</Canvas>
	);
};

export default THREEScene;
