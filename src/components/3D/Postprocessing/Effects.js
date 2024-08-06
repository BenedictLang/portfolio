import React from 'react';
import { Bloom, EffectComposer } from '@react-three/postprocessing';
import { useThree } from '@react-three/fiber';

const Effects = () => {
	const { size } = useThree();
	return (
		<EffectComposer>
			<Bloom
				intensity={1.0}
				width={size.width}
				height={size.height}
				kernelSize={5}
				luminanceSmoothing={1}
				luminanceThreshold={0.1}
			/>
		</EffectComposer>
	);
};

export default Effects;
