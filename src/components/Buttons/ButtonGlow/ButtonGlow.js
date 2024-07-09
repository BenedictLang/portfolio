import styles from './ButtonGlow.module.scss';
import stylesBtn from '../Button/Button.module.css';
import Link from 'next/link';

const ButtonGlow = ({ onClick, children, className, href, ...rest }) => {
	return (
		<Link onClick={onClick} href={href} className={`${className} ${stylesBtn.button} ${styles.button}`} {...rest}>
			{children}
		</Link>
	);
};

export default ButtonGlow;
