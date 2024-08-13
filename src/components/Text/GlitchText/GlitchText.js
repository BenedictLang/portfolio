import { useEffect, useState } from 'react';

const GlitchText = ({ text, intervalTime = 50 }) => {
	const chars = '☺Σ×Π#-_¯—→↓↑←0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ';
	const [displayedText, setDisplayedText] = useState('');

	useEffect(() => {
		let currentText = Array(text.length).fill('#');
		setDisplayedText(currentText.join(''));

		let currentIndex = 0;

		const intervalId = setInterval(() => {
			// Replace the current character with either the correct character or a random one
			if (currentText[currentIndex] !== text[currentIndex]) {
				currentText[currentIndex] =
					Math.random() < 0.5 ? text[currentIndex] : chars[Math.floor(Math.random() * chars.length)];
				setDisplayedText(currentText.join(''));
			} else {
				currentIndex++;
			}

			// Stop the interval when all characters are resolved
			if (currentIndex >= text.length) {
				clearInterval(intervalId);
			}
		}, intervalTime); // Change the timing here to make the glitch effect faster or slower

		return () => clearInterval(intervalId);
	}, [text, intervalTime]);

	return <>{displayedText} </>;
};

export default GlitchText;
