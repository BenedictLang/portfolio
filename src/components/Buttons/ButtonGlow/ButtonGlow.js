import styles from './ButtonGlow.module.scss';
import stylesBtn from '../Button/Button.module.css';
import CustomLink from '../../Link';
import { useEffect } from 'react';

const ButtonGlow = ({ onClick, children, className, href, overglow, ...rest }) => {
	useEffect(() => {
		console.log('Rendering ButtonGlow');
	}, []);
	const handleClick = (event) => {
		event.preventDefault();
		if (onClick) {
			onClick(event);
		}
	};
	return (
		<CustomLink
			href={href}
			onClick={handleClick}
			className={`${className} ${stylesBtn.button} ${styles.button} ${overglow ? styles.overGlow : ''}`}
			{...rest}
		>
			{children}
		</CustomLink>
	);
};

export default ButtonGlow;
