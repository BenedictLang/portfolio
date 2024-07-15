import { useContext } from 'react';
import Link from 'next/link';
import { AudioContext } from 'components/Buttons/ButtonAudio/AudioContext';

const CustomLink = ({ href, children, onClick, ...props }) => {
	const { playClickSound } = useContext(AudioContext);

	const handleClick = (event) => {
		if (onClick) {
			onClick(event);
		}
		playClickSound();
	};

	return (
		<Link href={href} {...props} onClick={handleClick}>
			{children}
		</Link>
	);
};

export default CustomLink;
