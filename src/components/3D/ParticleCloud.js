import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { Vector2, Vector3, Raycaster, Plane, AxesHelper, CameraHelper } from 'three';
import vertexShader from './shader/vertexShader';
import fragmentShader from './shader/fragmentShader';
import { useMouse } from '../Mouse/MouseProvider';
import * as THREE from 'three';

// Define the shader material
const BlobShaderMaterial = shaderMaterial(
	{
		u_time: 0,
		u_frequency: 6,
		u_red: 0.2,
		u_green: 0.4,
		u_blue: 0.4,
		u_intensity: 2,
	},
	vertexShader,
	fragmentShader,
);

extend({ BlobShaderMaterial });

// Function to calculate cylinder properties
function calculateCylinderProps(startPoint, endPoint) {
	const direction = new THREE.Vector3().subVectors(endPoint, startPoint);
	const distance = direction.length();

	// Calculate the position of the cylinder (midpoint between the two points)
	const position = new THREE.Vector3().addVectors(startPoint, endPoint).multiplyScalar(0.5);

	// Calculate the quaternion rotation to orient the cylinder along the direction
	const quaternion = new THREE.Quaternion();
	const up = new THREE.Vector3(0, 1, 0); // Default cylinder orientation along the Y-axis
	quaternion.setFromUnitVectors(up, direction.clone().normalize());

	return {
		position,
		rotation: new THREE.Euler().setFromQuaternion(quaternion),
		length: distance,
	};
}

const ParticleCloud = () => {
	const pointsRef = useRef();
	const materialRef = useRef();
	const mouse = useMouse();
	const { camera, scene } = useThree();
	const raycaster = new Raycaster();
	const cylinderRef = useRef();
	const planeMeshRef = useRef();

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
				frequency: 6,
				radius: 0.3, // Initial cylinder radius
			};

			const colorsFolder = gui.addFolder('Colors');
			colorsFolder.add(params, 'red', 0, 1).onChange((value) => {
				if (materialRef.current) {
					materialRef.current.uniforms.u_red.value = value;
				}
			});
			colorsFolder.add(params, 'green', 0, 1).onChange((value) => {
				if (materialRef.current) {
					materialRef.current.uniforms.u_green.value = value;
				}
			});
			colorsFolder.add(params, 'blue', 0, 1).onChange((value) => {
				if (materialRef.current) {
					materialRef.current.uniforms.u_blue.value = value;
				}
			});
			colorsFolder.add(params, 'intensity', 0, 3).onChange((value) => {
				if (materialRef.current) {
					materialRef.current.uniforms.u_intensity.value = value;
				}
			});

			const animationFolder = gui.addFolder('Animation');
			animationFolder.add(params, 'frequency', 0, 50).onChange((value) => {
				if (materialRef.current) {
					materialRef.current.uniforms.u_frequency.value = value;
				}
			});

			// Add a GUI slider to adjust the cylinder radius
			const cylinderFolder = gui.addFolder('Interaction');
			cylinderFolder.add(params, 'radius', 0.1, 10).onChange((value) => {
				if (cylinderRef.current) {
					// Update cylinder geometry with new radius
					const length = cylinderRef.current.geometry.parameters.height; // Preserve the existing length
					cylinderRef.current.geometry = new THREE.CylinderGeometry(value, value, length, 16);
				}
			});
		}

		init().then(() => {});

		const axesHelper = new AxesHelper(2);
		pointsRef.current.add(axesHelper);

		const cameraHelper = new CameraHelper(camera);
		scene.add(cameraHelper);

		return () => {
			gui.destroy();
		};
	}, [camera, scene]);

	useFrame((state, delta) => {
		if (materialRef.current) {
			materialRef.current.uniforms.u_time.value += delta;
		}

		if (pointsRef.current) {
			pointsRef.current.rotation.y += 0.001;
			pointsRef.current.rotation.x += 0.0012;
			pointsRef.current.rotation.z += 0.001;
		}

		if (materialRef.current) {
			const normalizedMouseX = (mouse.x / window.innerWidth) * 2 - 1;
			const normalizedMouseY = -(mouse.y / window.innerHeight) * 2 + 1;
			const mouseCoords = new Vector2(normalizedMouseX, normalizedMouseY);

			// Create a plane through the origin and parallel to the camera plane
			const planeNormal = new Vector3().copy(camera.getWorldDirection(new Vector3()));
			const plane = new Plane(planeNormal, 0);

			raycaster.setFromCamera(mouseCoords, camera);
			const intersectPoint = new Vector3();
			raycaster.ray.intersectPlane(plane, intersectPoint);

			if (intersectPoint) {
				const cameraPosition = new Vector3().copy(camera.position);

				const { position, rotation, length } = calculateCylinderProps(cameraPosition, intersectPoint);
				if (cylinderRef.current) {
					cylinderRef.current.position.copy(position);
					cylinderRef.current.rotation.copy(rotation);
					cylinderRef.current.geometry = new THREE.CylinderGeometry(
						cylinderRef.current.geometry.parameters.radiusTop,
						cylinderRef.current.geometry.parameters.radiusBottom,
						length,
						16,
					);
				}
			}
		}
	});

	return (
		<>
			<points ref={pointsRef} position={[0, 0, 0]}>
				<icosahedronGeometry args={[3, 30]} />
				<blobShaderMaterial ref={materialRef} />
			</points>
			<mesh ref={cylinderRef} position={[0, 0, 0]}>
				<cylinderGeometry args={[0.3, 0.3, 2, 16]} />
				<meshBasicMaterial color="red" wireframe={true} />
			</mesh>
			<mesh ref={planeMeshRef} position={[0, 0, 0]}>
				<planeGeometry args={[10, 10]} />
				<meshBasicMaterial color="blue" wireframe={false} />
			</mesh>
		</>
	);
};

export default ParticleCloud;
