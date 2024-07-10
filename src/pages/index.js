import styles from 'styles/pages/Start.module.scss';

import Container from 'components/Container';
import ButtonGlow from 'components/Buttons/ButtonGlow';
import LayoutFullscreen from 'components/Layouts/LayoutFullscreen';
import { useEffect, useState } from 'react';
import { useThreeScene } from './_app';

export default function Start() {
	const [shape, setShape] = useState('sphere');
	const setThreeSceneChildren = useThreeScene();

	const changeParticles = () => {
		setShape(shape === 'sphere' ? 'cube' : 'sphere');
	};

	useEffect(() => {
		//setThreeSceneChildren(<Particles shape={shape} />);
	}, [shape, setThreeSceneChildren]);
	return (
		<LayoutFullscreen>
			<Container className={styles.content}>
				<ButtonGlow href="/home" className onClick={changeParticles}>
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
