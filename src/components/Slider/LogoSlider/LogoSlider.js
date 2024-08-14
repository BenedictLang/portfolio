import styles from './LogoSlider.module.scss';

const LogoSlider = ({ children }) => {
	return <div className={styles.container}>{children}</div>;
};

export default LogoSlider;
