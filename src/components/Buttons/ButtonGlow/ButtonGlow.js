import stylesBtn from '../Button/Button.module.scss';
import styles from './ButtonGlow.module.scss';
import CustomLink from '../../Link';
import { useEffect } from 'react';

const ButtonGlow = ({ onClick, children, className, href, overglow, scroll, ...rest }) => {
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
			scroll={scroll}
			className={`${className} ${stylesBtn.button} ${styles.button} ${overglow ? styles.overGlow : ''}`}
			{...rest}
		>
			{children}
		</CustomLink>
	);
};

export default ButtonGlow;
