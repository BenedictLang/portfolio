import { useContext } from 'react';
import Link from 'next/link';
import { AudioContext } from '../Audio/AudioProvider';
import styles from './CustomLink.module.scss';

const CustomLink = ({ href, children, onClick, ...props }) => {
	const { playSound } = useContext(AudioContext);

	const handleClick = (event) => {
		if (onClick) {
			onClick(event);
		}
		playSound('click');
	};

	return (
		<Link href={href} {...props} className={styles.link} onClick={handleClick}>
			{children}
		</Link>
	);
};

export default CustomLink;
