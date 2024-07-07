import styles from 'styles/pages/Start.module.scss';

import Container from 'components/Container';
import ButtonGlow from '../components/Buttons/ButtonGlow';
import LayoutFullscreen from '../components/Layouts/LayoutFullscreen';

export default function Start() {
	return (
		<LayoutFullscreen>
			<Container className={styles.content}>
				<ButtonGlow href="/home" className>
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
