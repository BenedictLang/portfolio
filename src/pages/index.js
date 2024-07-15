import styles from 'styles/pages/Start.module.scss';

import Container from 'components/Container';
import ButtonGlow from 'components/Buttons/ButtonGlow';
import LayoutFullscreen from 'components/Layouts/LayoutFullscreen';
import { useContext, useEffect, useState } from 'react';
import { useThreeScene } from './_app';
import { AudioContext } from '../components/Buttons/ButtonAudio/AudioContext';

export default function Start() {
	const { isPlaying, toggleAudio } = useContext(AudioContext);
	const [shape, setShape] = useState('sphere');
	const setThreeSceneChildren = useThreeScene();

	const changeParticles = () => {
		setShape(shape === 'sphere' ? 'cube' : 'sphere');
	};

	useEffect(() => {}, [shape, setThreeSceneChildren]);

	const handleClick = (event) => {
		event.preventDefault();

		if (!isPlaying) {
			toggleAudio();
		}
		changeParticles();
	};

	return (
		<LayoutFullscreen>
			<Container className={styles.content}>
				<ButtonGlow href="/home" onClick={handleClick}>
					GET $data
				</ButtonGlow>
			</Container>
		</LayoutFullscreen>
	);
}

export async function getStaticProps() {
	return {
		props: {},
	};
}
