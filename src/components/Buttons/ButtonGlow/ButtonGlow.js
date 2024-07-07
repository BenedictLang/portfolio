import styles from './ButtonGlow.module.scss';
import Link from 'next/link';

const ButtonGlow = ({ children, className, href, ...rest }) => {
	return (
		<Link
			href={href}
			className={`px-8 py-4 text-white font-bold rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/50 ${className} ${styles.button}`}
			{...rest}
		>
			{children}
		</Link>
	);
};

export default ButtonGlow;
