import NextApp from 'next/app';
import { SiteContext, useSiteContext } from 'hooks/use-site';
import { SearchProvider } from 'hooks/use-search';
import { getSiteMetadata } from 'lib/site';
import { getRecentPosts } from 'lib/posts';
import { getCategories } from 'lib/categories';
import NextNProgress from 'nextjs-progressbar';
import { getAllMenus } from 'lib/menus';
import 'styles/globals.css';
import 'styles/globals.scss';
import 'styles/wordpress.scss';
import styles from 'styles/pages/App.module.scss';
import cssVariables from '../styles/_variables.module.scss';
import { useEffect } from 'react';
import { AudioProvider } from '../components/Audio/AudioProvider';
import { MouseProvider, useMouse } from '../components/Mouse/MouseProvider';
import { ViewportProvider } from '../components/_General/Viewport/ViewportProvider';
import { ThreeSceneProvider } from '../components/3D/ThreeSceneProvider';

function App({ Component, pageProps = {}, metadata, recentPosts, categories, menus }) {
	const site = useSiteContext({
		metadata,
		recentPosts,
		categories,
		menus,
	});

	return (
		<SiteContext.Provider value={site}>
			<ViewportProvider>
				<MouseProvider>
					<AudioProvider>
						<SearchProvider>
							<MouseMover>
								<div id="halo-mouse" className={styles.haloMouse}></div>
								<NextNProgress height={4} color={cssVariables.progressbarColor} />
								<ThreeSceneProvider>
									<Component {...pageProps} />
								</ThreeSceneProvider>
							</MouseMover>
						</SearchProvider>
					</AudioProvider>
				</MouseProvider>
			</ViewportProvider>
		</SiteContext.Provider>
	);
}

const MouseMover = ({ children }) => {
	const mouse = useMouse();

	useEffect(() => {
		const glow = document.getElementById('halo-mouse');
		if (glow) {
			glow.style.left = `${mouse.x}px`;
			glow.style.top = `${mouse.y}px`;
		}
	}, [mouse]);

	return children;
};

App.getInitialProps = async function (appContext) {
	const appProps = await NextApp.getInitialProps(appContext);

	const { posts: recentPosts } = await getRecentPosts({
		count: 5,
		queryIncludes: 'index',
	});

	const { categories } = await getCategories({
		count: 5,
	});

	const { menus = [] } = await getAllMenus();

	return {
		...appProps,
		metadata: await getSiteMetadata(),
		recentPosts,
		categories,
		menus,
	};
};

export default App;
