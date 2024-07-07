import ClassName from 'models/classname';

import styles from './Hero.module.scss';

const Hero = ({ children, className }) => {
	const contentClassName = new ClassName();

	contentClassName.addIf(className, className);

	return <div className={`${contentClassName.toString()}${styles.hero}`}>{children}</div>;
};

export default Hero;
