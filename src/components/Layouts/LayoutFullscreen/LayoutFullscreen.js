import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from './LayoutFullscreen.module.scss';

import useSite from '../../../hooks/use-site';
import { helmetSettingsFromMetadata } from '../../../lib/site';

import Main from '../../Sections/Main';
import Header from '../../Sections/Header';
import Footer from '../../Sections/Footer';

const LayoutFullscreen = ({ children }) => {
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
			<Header minimal={true}></Header>
			<Main className={styles.main}>{children}</Main>
			<Footer minimal={true}></Footer>
		</div>
	);
};

export default LayoutFullscreen;
