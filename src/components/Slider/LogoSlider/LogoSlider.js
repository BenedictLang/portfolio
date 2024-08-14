import React from 'react';
import styles from './LogoSlider.module.scss';

const LogoSlider = ({ children }) => {
	const childCount = React.Children.count(children);

	return (
		<div
			className={styles.sliderWrapper}
			style={{
				'--logo-cards': childCount,
				'--logo-margin': 'calc(6vh + 5vw)',
				'--logo-width': 'calc(7vh + 5vw)',
			}}
		>
			<div className={styles.slider}>
				{children}
				{children} {/* Duplication for endless scrolling */}
			</div>
			<div className={styles.overlay}></div>
		</div>
	);
};

export default LogoSlider;
