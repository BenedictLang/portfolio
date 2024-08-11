import React, { createContext, useContext, useState, useEffect } from 'react';

const MouseContext = createContext(undefined, undefined);

export const MouseProvider = ({ children }) => {
	const [mouse, setMouse] = useState({ x: -50, y: 50 });

	useEffect(() => {
		const handleMouseMove = (event) => {
			setMouse({ x: event.clientX, y: event.clientY });
		};

		window.addEventListener('mousemove', handleMouseMove);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return <MouseContext.Provider value={mouse}>{children}</MouseContext.Provider>;
};

export const useMouse = () => useContext(MouseContext);
