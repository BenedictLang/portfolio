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
import variables from '../styles/_variables.module.scss';
import THREEScene from 'components/3D/Scene/THREEScene';
import { createContext, useEffect, useState } from 'react';
import { AudioProvider } from '../components/Audio/AudioContext';
import { MouseProvider, useMouse } from '../components/Mouse/MouseProvider';

const ThreeSceneContext = createContext(null);

function App({ Component, pageProps = {}, metadata, recentPosts, categories, menus }) {
	const site = useSiteContext({
		metadata,
		recentPosts,
		categories,
		menus,
	});

	const [threeSceneChildren, setThreeSceneChildren] = useState(null);

	return (
		<SiteContext.Provider value={site}>
			<MouseProvider>
				<AudioProvider>
					<SearchProvider>
						<MouseMover>
							<div id="halo-mouse" className={styles.haloMouse}></div>
							<NextNProgress height={4} color={variables.progressbarColor} />
							<div className={styles.webglContainer}>
								<ThreeSceneContext.Provider value={setThreeSceneChildren}>
									<THREEScene>{threeSceneChildren}</THREEScene>
								</ThreeSceneContext.Provider>
							</div>
							<Component {...pageProps} />
						</MouseMover>
					</SearchProvider>
				</AudioProvider>
			</MouseProvider>
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
