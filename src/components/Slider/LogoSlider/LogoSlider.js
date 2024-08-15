import React, { useRef, useState, useEffect } from 'react';
import styles from './LogoSlider.module.scss';

const LogoSlider = ({ children }) => {
	const sliderRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [scrollLeft, setScrollLeft] = useState(0);
	const [draggingDistance, setDraggingDistance] = useState(0);

	useEffect(() => {
		if (!isDragging) {
			sliderRef.current.style.animationPlayState = 'running';
		}
	}, [isDragging]);

	const handleMouseDown = (e) => {
		setIsDragging(true);
		sliderRef.current.style.animationPlayState = 'paused';
		setStartX(e.pageX - sliderRef.current.offsetLeft);
		setScrollLeft(sliderRef.current.scrollLeft);
		setDraggingDistance(0);
	};

	const handleMouseLeave = () => {
		if (isDragging) {
			setIsDragging(false);
		}
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		const x = e.pageX - sliderRef.current.offsetLeft;
		const walk = x - startX;
		setDraggingDistance(Math.abs(walk));
		sliderRef.current.scrollLeft = scrollLeft - walk;

		// Handle endless scrolling effect
		if (sliderRef.current.scrollLeft === 0) {
			sliderRef.current.scrollLeft = sliderRef.current.scrollWidth / 2;
		} else if (sliderRef.current.scrollLeft >= sliderRef.current.scrollWidth / 2) {
			sliderRef.current.scrollLeft = 1;
		}
	};

	const handleClick = (e) => {
		if (draggingDistance > 5) {
			e.preventDefault();
		}
	};

	const childCount = React.Children.count(children);

	return (
		<div className={styles.container}>
			<div
				className={styles.sliderWrapper}
				style={{
					'--logo-cards': childCount,
					'--logo-margin': 'calc(5vh + 5vw)',
					'--logo-width': 'calc(9vh + 4vw)',
				}}
				ref={sliderRef}
				onMouseDown={handleMouseDown}
				onMouseLeave={handleMouseLeave}
				onMouseUp={handleMouseUp}
				onMouseMove={handleMouseMove}
			>
				<div className={styles.slider}>
					{React.Children.map(children, (child) => (
						<div onClick={handleClick} className={styles.clickCatcher}>
							{child}
						</div>
					))}
					{React.Children.map(children, (child) => (
						<div onClick={handleClick} className={styles.clickCatcher}>
							{child} {/* Duplication for endless scrolling */}
						</div>
					))}
				</div>
			</div>
			<div className={styles.overlay}></div>
		</div>
	);
};

export default LogoSlider;
