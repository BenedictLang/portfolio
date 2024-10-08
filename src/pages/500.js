import { Helmet } from 'react-helmet';

import Layout from 'components/Layouts/Layout';
import Section from 'components/Sections/Section';
import Container from 'components/ContainerElements/Container';

import styles from 'styles/pages/Error.module.scss';
import CustomLink from '../components/Link';

export default function Custom500() {
	return (
		<Layout>
			<Helmet>
				<title>500 - Internal Error</title>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
			<Section>
				<Container className={styles.center}>
					<h1>Internal Error</h1>
					<p className={styles.errorCode}>500</p>
					<p className={styles.errorMessage}>
						Uh oh, something went wrong. Please try refreshing the page or clearing site data. If the problem persists,
						reach out to let us know!
					</p>
					<p>
						<CustomLink href="/">Go back home</CustomLink>
					</p>
				</Container>
			</Section>
		</Layout>
	);
}

// Next.js method to ensure a static page gets rendered
export async function getStaticProps() {
	return {
		props: {},
	};
}
