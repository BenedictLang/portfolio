import { Helmet } from 'react-helmet';

import Layout from 'components/Layouts/Layout';
import Section from 'components/Sections/Section';
import Container from 'components/ContainerElements/Container';

import styles from 'styles/pages/Error.module.scss';
import CustomLink from '../components/Link';

export default function Custom404() {
	return (
		<Layout>
			<Helmet>
				<title>404 - Page Not Found</title>
				<meta name="robots" content="noindex, nofollow" />
			</Helmet>
			<Section>
				<Container className={styles.center}>
					<h1>Page Not Found</h1>
					<p className={styles.errorCode}>404</p>
					<p className={styles.errorMessage}>The page you were looking for could not be found.</p>
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
