import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from './Layout.module.scss';

import useSite from '../../../hooks/use-site';
import { helmetSettingsFromMetadata } from '../../../lib/site';

import Main from '../../Main';
import Footer from '../../Footer';
import Header from '../../Header';

const Layout = ({ children }) => {
	const router = useRouter();
	const { asPath } = router;

	const { homepage, metadata = {} } = useSite();

	if (!metadata.og) {
		metadata.og = {};
	}

	metadata.og.url = `${homepage}${asPath}`;

	const helmetSettings = {
		defaultTitle: metadata.title,
		titleTemplate: process.env.WORDPRESS_PLUGIN_SEO === true ? '%s' : `%s - ${metadata.title}`,
		...helmetSettingsFromMetadata(metadata, {
			setTitle: false,
			link: [
				{
					rel: 'alternate',
					type: 'application/rss+xml',
					href: '/feed.xml',
				},

				// Favicon sizes and manifest generated via https://favicon.io/

				{
					rel: 'apple-touch-icon',
					sizes: '180x180',
					href: '/apple-touch-icon.png',
				},
				{
					rel: 'icon',
					type: 'image/svg+xml',
					sizes: 'any',
					href: '/favicon.svg',
				},
				{
					rel: 'manifest',
					href: '/site.webmanifest',
				},
			],
		}),
	};

	return (
		<div className={styles.layoutContainer}>
			<Helmet {...helmetSettings} />

			<Header />

			<Main>{children}</Main>

			<Footer />
		</div>
	);
};

export default Layout;
