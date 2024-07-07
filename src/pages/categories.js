import Link from 'next/link';
import { Helmet } from 'react-helmet';

import useSite from 'hooks/use-site';
import { getAllCategories, categoryPathBySlug } from 'lib/categories';
import { WebpageJsonLd } from 'lib/json-ld';

import Layout from 'components/Layouts/Layout';
import Section from 'components/Section';
import Container from 'components/Container';
import SectionTitle from 'components/SectionTitle';

import styles from 'styles/pages/Categories.module.scss';
import HeroSub from '../components/Heros/HeroSub';

export default function Categories({ categories }) {
	const { metadata = {} } = useSite();
	const { title: siteTitle } = metadata;
	const title = 'Categories';
	const slug = 'categories';
	let metaDescription = `Read ${categories.length} categories at ${siteTitle}.`;

	return (
		<Layout>
			<Helmet>
				<title>Categories</title>
				<meta name="description" content={metaDescription} />
				<meta property="og:title" content={title} />
				<meta property="og:description" content={metaDescription} />
			</Helmet>

			<WebpageJsonLd title={title} description={metaDescription} siteTitle={siteTitle} slug={slug} />

			<HeroSub>
				<Container>
					<h1>Categories</h1>
				</Container>
			</HeroSub>

			<Section>
				<Container>
					<SectionTitle>All Categories</SectionTitle>
					<ul className={styles.categories}>
						{categories.map((category) => {
							return (
								<li key={category.slug}>
									<Link href={categoryPathBySlug(category.slug)}>{category.name}</Link>
								</li>
							);
						})}
					</ul>
				</Container>
			</Section>
		</Layout>
	);
}

export async function getStaticProps() {
	const { categories } = await getAllCategories();

	return {
		props: {
			categories,
		},
	};
}
