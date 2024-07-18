import { useRouter } from 'next/router';
import { Helmet } from 'react-helmet';
import styles from './LayoutFullscreen.module.scss';

import useSite from '../../../hooks/use-site';
import { helmetSettingsFromMetadata } from '../../../lib/site';

import Main from '../../Sections/Main';
import Header from '../../Sections/Header';
import Footer from '../../Sections/Footer';
import { useEffect } from 'react';

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

	useEffect(() => {
		console.log('Rendering Layout');
		const handleMouseMove = (event) => {
			const glow = document.getElementById('halo-mouse');
			if (glow) {
				glow.style.left = `${event.pageX}px`;
				glow.style.top = `${event.pageY}px`;
			}
		};

		document.addEventListener('mousemove', handleMouseMove);

		return () => {
			document.removeEventListener('mousemove', handleMouseMove);
		};
	}, []);

	return (
		<div className={styles.layoutContainer}>
			<div id="halo-mouse" className={styles.haloMouse}></div>
			<Helmet {...helmetSettings} />
			<Header simple={true}></Header>
			<Main className={styles.main}>{children}</Main>
			<Footer simple={true}></Footer>
		</div>
	);
};

export default LayoutFullscreen;
