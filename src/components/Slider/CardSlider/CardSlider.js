import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import Image from 'next/image';
import styles from './CardSlider.module.scss';

/**
 * CardSlider Component
 * Displays a horizontal carousel of cards that can be scrolled with the mouse wheel,
 * dragged, or swiped. Clicking on a card brings it into view.
 *
 * @param {Array} cards - Array of card objects containing `id`, `title`, and `image` fields.
 */ const CardSlider = ({ cards }) => {
	const [activeIndex, setActiveIndex] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [progress, setProgress] = useState(0);
	const carouselRef = useRef(null);

	useEffect(() => {
		if (carouselRef.current) {
			const carousel = carouselRef.current;
			carousel.style.setProperty('--active', activeIndex);
			carousel.style.setProperty('--items', cards.length);
		}
	}, [activeIndex, cards.length]);

	const handleScroll = (event) => {
		event.preventDefault();
		const scrollAmount = event.deltaY > 0 ? 1 : -1;
		setActiveIndex((prevIndex) => {
			const newIndex = prevIndex + scrollAmount;
			return Math.max(0, Math.min(newIndex, cards.length - 1));
		});
	};

	const handleMouseDown = (event) => {
		setIsDragging(true);
		setStartX(event.clientX || (event.touches && event.touches[0].clientX) || 0);
	};

	const handleMouseMove = (event) => {
		if (!isDragging) return;
		const x = event.clientX || (event.touches && event.touches[0].clientX) || 0;
		const mouseProgress = (x - startX) * -0.1;
		setProgress((prevProgress) => {
			return Math.max(0, Math.min(prevProgress + mouseProgress, 100));
		});
		setStartX(x);
		updateActiveIndex();
	};

	const handleMouseUp = () => {
		setIsDragging(false);
		setProgress(Math.round(progress)); // Round the progress to the nearest whole number
		updateActiveIndex();
	};

	const updateActiveIndex = () => {
		const index = Math.floor((progress / 100) * (cards.length - 1));
		setActiveIndex(index);
	};

	const handleCardClick = (index) => {
		setActiveIndex(index);
	};

	useEffect(() => {
		const carousel = carouselRef.current;
		carousel.addEventListener('wheel', handleScroll);
		carousel.addEventListener('mousedown', handleMouseDown);
		carousel.addEventListener('mousemove', handleMouseMove);
		carousel.addEventListener('mouseup', handleMouseUp);
		carousel.addEventListener('touchstart', handleMouseDown);
		carousel.addEventListener('touchmove', handleMouseMove);
		carousel.addEventListener('touchend', handleMouseUp);

		return () => {
			carousel.removeEventListener('wheel', handleScroll);
			carousel.removeEventListener('mousedown', handleMouseDown);
			carousel.removeEventListener('mousemove', handleMouseMove);
			carousel.removeEventListener('mouseup', handleMouseUp);
			carousel.removeEventListener('touchstart', handleMouseDown);
			carousel.removeEventListener('touchmove', handleMouseMove);
			carousel.removeEventListener('touchend', handleMouseUp);
		};
	}, [progress, startX, isDragging, handleScroll, handleMouseMove, handleMouseUp]);

	return (
		<div className={styles.carousel} ref={carouselRef}>
			{cards.map((card, index) => {
				const distance = Math.abs(index - activeIndex);
				const opacity = Math.max(0, 1 - distance * 0.4);
				return (
					<div
						key={card.id}
						className={styles['carousel-item']}
						style={{
							'--active': index - activeIndex,
							'--zIndex': cards.length - distance,
							'--opacity': opacity,
						}}
						onClick={() => handleCardClick(index)}
					>
						<div className={styles['carousel-box']}>
							<div className={styles.title}>{card.title}</div>
							<div className={styles.num}>{String(index + 1).padStart(2, '0')}</div>
							<Image src={card.image} alt={card.title} width={200} height={400} />
						</div>
					</div>
				);
			})}
		</div>
	);
};

CardSlider.propTypes = {
	cards: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
			title: PropTypes.string.isRequired,
			image: PropTypes.string.isRequired,
		}),
	).isRequired,
};

export default CardSlider;
