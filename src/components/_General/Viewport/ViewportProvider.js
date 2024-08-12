import React, { createContext, useContext, useState, useEffect } from 'react';
import cssVariables from '../../../styles/_variables.module.scss';

const ViewportContext = createContext(undefined, undefined);

export const ViewportProvider = ({ children }) => {
	const [isMobile, setIsMobile] = useState(false);

	useEffect(() => {
		const updateViewport = () => {
			const mobileBreakpoint = cssVariables.breakPointTablet;
			const isMobileViewport = window.matchMedia(`(max-width: ${mobileBreakpoint})`).matches;
			setIsMobile(isMobileViewport);
		};

		updateViewport();
		window.addEventListener('resize', updateViewport);

		return () => {
			window.removeEventListener('resize', updateViewport);
		};
	}, []);

	return <ViewportContext.Provider value={{ isMobile }}>{children}</ViewportContext.Provider>;
};

export const useViewport = () => {
	return useContext(ViewportContext);
};
