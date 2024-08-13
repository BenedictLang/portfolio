import React from 'react';
import styles from './GradientText.module.scss';

const GradientText = ({ string }) => {
	return <span className={styles.gradientText}>{string}</span>;
};

export default GradientText;
