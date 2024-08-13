import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useMouse } from '../../Mouse/MouseProvider';

/**
 * CameraController Component
 *
 * Controls the camera movement based on mouse input and external target.
 * @param {Object} props - Component props.
 * @param {Vector3} props.target - The target vector3 for the camera to look at.
 */
const CameraController = ({ target = new Vector3() }) => {
	const { camera } = useThree();
	const mouse = useMouse();
	const cameraPosition = useRef(new Vector3(camera.position.x, camera.position.y, camera.position.z));
	const cameraTarget = useRef(new Vector3().copy(target));

	useFrame(() => {
		const normalizedMouseX = (mouse.x / window.innerWidth) * 2 - 1;
		const normalizedMouseY = -(mouse.y / window.innerHeight) * 2 + 1;

		// Update target position based on mouse position
		const moveAmount = 1;
		const targetX = normalizedMouseX * moveAmount;
		const targetY = normalizedMouseY * moveAmount;

		// Set target camera position
		cameraPosition.current.set(targetX, targetY, camera.position.z);

		// Smoothly interpolate camera position
		camera.position.lerp(cameraPosition.current, 0.1);
		camera.rotation.x = normalizedMouseY * 0.1;
		camera.rotation.y = normalizedMouseX * 0.1;

		cameraTarget.current.lerp(target, 0.1);
		camera.lookAt(cameraTarget.current);
	});

	return null;
};

export default CameraController;
