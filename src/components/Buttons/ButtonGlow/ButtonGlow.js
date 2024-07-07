import styles from './ButtonGlow.module.scss';
import stylesBtn from '../Button/Button.module.css';
import Link from 'next/link';

const ButtonGlow = ({ children, className, href, ...rest }) => {
	return (
		<Link href={href} className={`${className} ${stylesBtn.button} ${styles.button}`} {...rest}>
			{children}
		</Link>
	);
};

export default ButtonGlow;
