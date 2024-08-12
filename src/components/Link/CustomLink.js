import { useContext } from 'react';
import Link from 'next/link';
import { AudioContext } from '../Audio/AudioProvider';

const CustomLink = ({ href, children, onClick, ...props }) => {
	const { playSound } = useContext(AudioContext);

	const handleClick = (event) => {
		if (onClick) {
			onClick(event);
		}
		playSound('click');
	};

	return (
		<Link href={href} {...props} onClick={handleClick}>
			{children}
		</Link>
	);
};

export default CustomLink;
