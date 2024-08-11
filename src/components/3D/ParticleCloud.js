import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';
import { Vector2, Vector3, Raycaster, Plane } from 'three';
import pointCloudVertexShader from './shader/PointCloudVertexShader';
import pointCloudFragmentShader from './shader/PointCloudFragmentShader';
import { useMouse } from '../Mouse/MouseProvider';
import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils';

const defaultInteractionRadius = 5;
const defaultFrequency = 4;
const defaultGravity = 0.1;
const defaultIntensity = 1.5;
const defaultRedValue = 1.0;
const defaultGreenValue = 0.16;
const defaultBlueValue = 0.0;

const BlobShaderMaterial = shaderMaterial(
	{
		u_time: 0,
		u_frequency: defaultFrequency,
		u_red: defaultRedValue,
		u_green: defaultGreenValue,
		u_blue: defaultBlueValue,
		u_intensity: defaultIntensity,
		u_gravity: defaultGravity,
		u_perspectiveCorrection: true,
		u_cameraPosition: new THREE.Vector3(),
		u_targetPosition: new THREE.Vector3(),
		u_interactionRadius: defaultInteractionRadius,
		u_objectPosition: new THREE.Vector3(),
	},
	pointCloudVertexShader,
	pointCloudFragmentShader,
);

extend({ BlobShaderMaterial });

const ParticleCloud = () => {
	const pointsRef = useRef();
	const materialRef = useRef();
	const mouse = useMouse();
	const { camera } = useThree();
	const raycaster = new Raycaster();
	const geometryRaycaster = new Raycaster();
	const radiusRef = useRef(defaultInteractionRadius);
	const intensityRef = useRef(defaultIntensity);
	const targetIntensityRef = useRef(defaultIntensity);
	const frequencyRef = useRef(defaultFrequency);
	const targetFrequencyRef = useRef(defaultFrequency);
	const prevCameraPosition = useRef(new Vector3());
	const planeRef = useRef(new Plane());
	const planeNormal = useRef(new Vector3());
	const intensityChangeSpeed = 3;

	useEffect(() => {
		let gui;
		async function init() {
			const { GUI } = await import('dat.gui');
			gui = new GUI();
			const params = {
				red: defaultRedValue,
				green: defaultGreenValue,
				blue: defaultBlueValue,
				intensity: intensityRef.current,
				frequency: defaultFrequency,
				gravity: defaultGravity,
				radius: radiusRef.current,
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
				intensityRef.current = value;
				targetIntensityRef.current = value;
				if (materialRef.current) {
					materialRef.current.uniforms.u_intensity.value = value;
				}
			});

			const animationFolder = gui.addFolder('Animation');
			animationFolder.add(params, 'frequency', 0, 50).onChange((value) => {
				frequencyRef.current = value;
				if (materialRef.current) {
					materialRef.current.uniforms.u_frequency.value = value;
				}
			});
			animationFolder.add(params, 'gravity', 0, 10).onChange((value) => {
				if (materialRef.current) {
					materialRef.current.uniforms.u_gravity.value = value;
				}
			});

			const interactionFolder = gui.addFolder('Interaction');
			interactionFolder.add(params, 'radius', 0.1, 10).onChange((value) => {
				radiusRef.current = value;

				if (materialRef.current) {
					materialRef.current.uniforms.u_interactionRadius.value = value;
				}
			});
		}

		init().then(() => {});

		return () => {
			gui.destroy();
		};
	}, [camera]);

	useEffect(() => {
		if (pointsRef.current) {
			const geometry = pointsRef.current.geometry;
			BufferGeometryUtils.mergeVertices(geometry);
		}
	}, []);

	useFrame((state, delta) => {
		if (materialRef.current) {
			materialRef.current.uniforms.u_time.value += delta;
		}

		if (pointsRef.current) {
			pointsRef.current.rotation.y += 0.001;
			pointsRef.current.rotation.x += 0.0012;
			pointsRef.current.rotation.z += 0.001;
		}

		const currentCameraPosition = camera.position.clone();
		if (!prevCameraPosition.current.equals(currentCameraPosition)) {
			// Re-renders in case the camera position changed
			prevCameraPosition.current.copy(currentCameraPosition);
			planeNormal.current.copy(camera.getWorldDirection(new Vector3()));
			planeRef.current.normal.copy(planeNormal.current);
			planeRef.current.constant = -5;
		}

		const normalizedMouseX = (mouse.x / window.innerWidth) * 2 - 1;
		const normalizedMouseY = -(mouse.y / window.innerHeight) * 2 + 1;
		const mouseCoords = new Vector2(normalizedMouseX, normalizedMouseY);
		raycaster.setFromCamera(mouseCoords, camera);

		const intersectPoint = new Vector3();
		raycaster.ray.intersectPlane(planeRef.current, intersectPoint);

		let isIntersecting = false;
		if (intersectPoint && intersectPoint.x !== 0) {
			// Avoid intersectPoint gets reset to origin after 5 seconds of no interaction
			if (materialRef.current) {
				// Compute the inverse of the object's world matrix
				pointsRef.current.updateMatrixWorld(); // Ensure the matrix world is up-to-date

				// Create a new matrix and copy the world matrix of the geometry
				let inverseMatrix = new THREE.Matrix4().copy(pointsRef.current.matrixWorld).invert();

				// Calculate the marker position in local coordinates
				let interactionLocalPositionCam = camera.position.clone().applyMatrix4(inverseMatrix);
				let interactionLocalPositionObject = pointsRef.current.position.clone().applyMatrix4(inverseMatrix);
				let interactionLocalPositionTarget = intersectPoint.clone().applyMatrix4(inverseMatrix);

				materialRef.current.uniforms.u_cameraPosition.value.copy(interactionLocalPositionCam);
				materialRef.current.uniforms.u_objectPosition.value.copy(interactionLocalPositionObject);
				materialRef.current.uniforms.u_targetPosition.value.copy(interactionLocalPositionTarget);
			}

			geometryRaycaster.ray.copy(raycaster.ray);
			const intersects = geometryRaycaster.intersectObject(pointsRef.current, true);

			if (intersects.length > 0) {
				isIntersecting = true;
			}
		}

		if (isIntersecting) {
			targetIntensityRef.current = intensityRef.current * 2.4;
			targetFrequencyRef.current = frequencyRef.current * 1.6;
		} else {
			targetIntensityRef.current = intensityRef.current;
			targetFrequencyRef.current = frequencyRef.current;
		}

		if (materialRef.current) {
			materialRef.current.uniforms.u_intensity.value = THREE.MathUtils.lerp(
				materialRef.current.uniforms.u_intensity.value,
				targetIntensityRef.current,
				delta * intensityChangeSpeed,
			);
			materialRef.current.uniforms.u_frequency.value = THREE.MathUtils.lerp(
				materialRef.current.uniforms.u_frequency.value,
				targetFrequencyRef.current,
				delta * intensityChangeSpeed,
			);
		}
	});

	return (
		<>
			<points ref={pointsRef} position={[0, 0, 0]}>
				<icosahedronGeometry args={[4, 30]} />
				<blobShaderMaterial ref={materialRef} />
			</points>
		</>
	);
};

export default ParticleCloud;
