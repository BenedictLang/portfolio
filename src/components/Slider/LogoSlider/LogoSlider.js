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

	/**
	 * Handles the start of a drag action (both mouse and touch).
	 * Pauses the animation and stores the initial positions.
	 */
	const handleDragStart = (pageX) => {
		setIsDragging(true);
		sliderRef.current.style.animationPlayState = 'paused';
		setStartX(pageX - sliderRef.current.offsetLeft);
		setScrollLeft(sliderRef.current.scrollLeft);
		setDraggingDistance(0);
	};

	/**
	 * Handles the mouse down event to start dragging.
	 */
	const handleMouseDown = (e) => {
		handleDragStart(e.pageX);
	};

	/**
	 * Handles the touch start event to start dragging.
	 */
	const handleTouchStart = (e) => {
		handleDragStart(e.touches[0].pageX);
	};

	/**
	 * Ends the drag action (both mouse and touch).
	 */
	const handleDragEnd = () => {
		setIsDragging(false);
	};

	/**
	 * Handles the mouse move event to drag the slider.
	 */
	const handleMouseMove = (e) => {
		handleDragMove(e.pageX);
	};

	/**
	 * Handles the touch move event to drag the slider.
	 */
	const handleTouchMove = (e) => {
		handleDragMove(e.touches[0].pageX);
	};

	/**
	 * Handles the movement during dragging (both mouse and touch).
	 * Updates the scroll position of the slider.
	 */
	const handleDragMove = (pageX) => {
		if (!isDragging) return;
		const x = pageX - sliderRef.current.offsetLeft;
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

	/**
	 * Prevents the default click behavior if the slider was dragged.
	 */
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
				onMouseLeave={handleDragEnd}
				onMouseUp={handleDragEnd}
				onMouseMove={handleMouseMove}
				onTouchStart={handleTouchStart}
				onTouchEnd={handleDragEnd}
				onTouchMove={handleTouchMove}
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
