import React, { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';

const Particles = ({ shape, radius = 20 }) => {
	const pointsRef = useRef();
	const [positions, setPositions] = useState(new Float32Array(3000 * 3));

	useEffect(() => {
		let particles;
		switch (shape) {
			case 'sphere':
				particles = generateSpherePositions(3000, radius);
				break;
			case 'cube':
				particles = generateCubePositions(3000);
				break;
			default:
				particles = generateSpherePositions(3000, radius);
		}
		setPositions(particles);
	}, [shape, radius]);

	useFrame(() => {
		if (pointsRef.current) {
			pointsRef.current.rotation.y += 0.0002;
		}
	});

	const generateSpherePositions = (count, radius) => {
		const particles = new Float32Array(count * 3);
		for (let i = 0; i < count * 3; i += 3) {
			const phi = Math.acos(2 * Math.random() - 1);
			const theta = Math.random() * 2 * Math.PI;

			particles[i] = radius * Math.sin(phi) * Math.cos(theta);
			particles[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
			particles[i + 2] = radius * Math.cos(phi);
		}
		return particles;
	};

	const generateCubePositions = (count) => {
		const particles = new Float32Array(count * 3);
		for (let i = 0; i < count * 3; i += 3) {
			particles[i] = Math.random() * 30 - 15;
			particles[i + 1] = Math.random() * 30 - 15;
			particles[i + 2] = Math.random() * 30 - 15;
		}
		return particles;
	};

	return (
		<Points ref={pointsRef} positions={positions}>
			<PointMaterial color="#ffffff" size={0.1} />
		</Points>
	);
};

export default Particles;
