import styles from './ButtonGlow.module.scss';
import stylesBtn from '../Button/Button.module.css';
import CustomLink from '../../Link';

const ButtonGlow = ({ onClick, children, className, href, ...rest }) => {
	const handleClick = (event) => {
		if (onClick) {
			onClick(event);
		}
	};
	return (
		<CustomLink
			href={href}
			onClick={handleClick}
			className={`${className} ${stylesBtn.button} ${styles.button}`}
			{...rest}
		>
			{children}
		</CustomLink>
	);
};

export default ButtonGlow;
