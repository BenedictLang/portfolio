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

	// Unified function to handle the start of dragging (mouse or touch)
	const handleDragStart = (position) => {
		setIsDragging(true);
		sliderRef.current.style.animationPlayState = 'paused';
		setStartX(position - sliderRef.current.offsetLeft);
		setScrollLeft(sliderRef.current.scrollLeft);
		setDraggingDistance(0);
	};

	// Unified function to handle the end of dragging (mouse or touch)
	const handleDragEnd = () => {
		setIsDragging(false);
	};

	// Unified function to handle the dragging movement (mouse or touch)
	const handleDragMove = (position) => {
		if (!isDragging) return;
		const x = position - sliderRef.current.offsetLeft;
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

	// Prevent click events if there was dragging
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
				onMouseDown={(e) => handleDragStart(e.pageX)}
				onMouseLeave={handleDragEnd}
				onMouseUp={handleDragEnd}
				onMouseMove={(e) => handleDragMove(e.pageX)}
				onTouchStart={(e) => handleDragStart(e.touches[0].pageX)}
				onTouchEnd={handleDragEnd}
				onTouchMove={(e) => handleDragMove(e.touches[0].pageX)}
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
