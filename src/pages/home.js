import useSite from 'hooks/use-site';
import { getPaginatedPosts } from 'lib/posts';
import { WebsiteJsonLd } from 'lib/json-ld';
import styles from 'styles/pages/Home.module.scss';

import Layout from 'components/Layouts/Layout';
import Section from 'components/Sections/Section';
import Container from 'components/ContainerElements/Container';
import PostCard from 'components/PostCard';
import Pagination from 'components/Pagination';
import { useContext, useEffect } from 'react';
import { ThreeSceneContext } from '../components/3D/ThreeSceneProvider';
import { Vector3 } from 'three';
import { useViewport } from '../components/_General/Viewport/ViewportProvider';
import Hero from '../components/Sections/Heros/Hero';
import LogoSlider from '../components/Slider/LogoSlider';
import Image from 'next/image';
import CustomLink from '../components/Link';
import { getAllCustomers } from '../lib/customers';

export default function Home({ posts, pagination, customers }) {
	const { metadata = {} } = useSite();
	const { title } = metadata;
	const { isMobile } = useViewport();
	const { setCameraTarget } = useContext(ThreeSceneContext);

	useEffect(() => {
		const newTarget = new Vector3();
		if (isMobile) {
			newTarget.y = 3;
		} else {
			newTarget.x = -5;
		}
		setCameraTarget(newTarget);
	}, [isMobile, setCameraTarget]);

	return (
		<Layout>
			<WebsiteJsonLd siteTitle={title} />
			<Hero />
			<LogoSlider>
				{customers.map((customer) => {
					return (
						<CustomLink key={customer.id} href={customer.site} className={styles.customerLink}>
							<div className={styles.customerLogo}>
								<Image src={customer.logo.url} alt={customer.logo.alt} width={53} height={33} />
							</div>
						</CustomLink>
					);
				})}
			</LogoSlider>
			<Section className={styles.heroSection}></Section>
			<Section>
				<Container>
					<h2 className="sr-only">Posts</h2>
					<ul className={styles.posts}>
						{posts.map((post) => {
							return (
								<li key={post.slug}>
									<PostCard post={post} />
								</li>
							);
						})}
					</ul>
					{pagination && (
						<Pagination
							addCanonical={false}
							currentPage={pagination?.currentPage}
							pagesCount={pagination?.pagesCount}
							basePath={pagination?.basePath}
						/>
					)}
				</Container>
			</Section>
		</Layout>
	);
}

export async function getStaticProps() {
	const { posts, pagination } = await getPaginatedPosts({
		queryIncludes: 'archive',
	});
	const { customers } = await getAllCustomers();
	return {
		props: {
			customers,
			posts,
			pagination: {
				...pagination,
				basePath: '/posts',
			},
		},
	};
}
