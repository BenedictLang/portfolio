import styles from './Button.module.scss';
import CustomLink from '../../Link';

const Button = ({ children, className, href, ...rest }) => {
	let buttonClassName = styles.button;

	if (className) {
		buttonClassName = `${buttonClassName} ${className}`;
	}

	return (
		<CustomLink href={href} className={buttonClassName} {...rest}>
			{children}
		</CustomLink>
	);
};

export default Button;
