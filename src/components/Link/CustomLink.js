import { useContext } from 'react';
import Link from 'next/link';
import { AudioContext } from '../Audio/AudioProvider';
import styles from './CustomLink.module.scss';
import ClassName from '../../models/classname';

const CustomLink = ({ href, children, className, onClick, scroll, ...props }) => {
	const containerClassName = new ClassName(styles.link);
	containerClassName.addIf(className, className);

	const { playSound } = useContext(AudioContext);

	const handleClick = (event) => {
		if (onClick) {
			onClick(event);
		}
		playSound('click');
	};

	return (
		<Link href={href} {...props} scroll={scroll} className={containerClassName.toString()} onClick={handleClick}>
			{children}
		</Link>
	);
};

export default CustomLink;
