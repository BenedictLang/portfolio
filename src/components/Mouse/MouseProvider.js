import React, { createContext, useContext, useState, useEffect } from 'react';

const MouseContext = createContext();

export const MouseProvider = ({ children }) => {
	const [mouse, setMouse] = useState({ x: 0, y: 0 });

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
