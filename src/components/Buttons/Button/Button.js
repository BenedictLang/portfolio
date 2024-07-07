import styles from './Button.module.scss';
import Link from 'next/link';

const Button = ({ children, className, href, ...rest }) => {
	let buttonClassName = styles.button;

	if (className) {
		buttonClassName = `${buttonClassName} ${className}`;
	}

	return (
		<Link href={href} className={buttonClassName} {...rest}>
			{children}
		</Link>
	);
};

export default Button;
