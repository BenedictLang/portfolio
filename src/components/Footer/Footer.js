import Link from 'next/link';

import useSite from 'hooks/use-site';
import { postPathBySlug } from 'lib/posts';
import { categoryPathBySlug } from 'lib/categories';

import Section from 'components/Section';
import Container from 'components/Container';

import styles from './Footer.module.scss';

const Footer = ({ simple = false }) => {
	const { metadata = {}, recentPosts = [], categories = [] } = useSite();
	const { title } = metadata;

	const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
	const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
	const hasMenu = hasRecentPosts || hasRecentCategories;

	return (
		<footer className={styles.footer}>
			{hasMenu && !simple && (
				<div>
					<div>{title}</div>
					<Section className={styles.footerMenu}>
						<Container>
							<ul className={styles.footerMenuColumns}>
								{hasRecentPosts && (
									<li>
										<Link className={styles.footerMenuTitle} href="/posts/">
											<strong>Recent Posts</strong>
										</Link>
										<ul className={styles.footerMenuItems}>
											{recentPosts.map((post) => {
												const { id, slug, title } = post;
												return (
													<li key={id}>
														<Link href={postPathBySlug(slug)}>{title}</Link>
													</li>
												);
											})}
										</ul>
									</li>
								)}
								{hasRecentCategories && (
									<li>
										<Link href="/categories/" className={styles.footerMenuTitle}>
											<strong>Categories</strong>
										</Link>
										<ul className={styles.footerMenuItems}>
											{categories.map((category) => {
												const { id, slug, name } = category;
												return (
													<li key={id}>
														<Link href={categoryPathBySlug(slug)}>{name}</Link>
													</li>
												);
											})}
										</ul>
									</li>
								)}
								<li>
									<p className={styles.footerMenuTitle}>
										<strong>More</strong>
									</p>
									<ul className={styles.footerMenuItems}>
										<li>
											<a href="/feed.xml">RSS</a>
										</li>
										<li>
											<a href="/sitemap.xml">Sitemap</a>
										</li>
									</ul>
								</li>
							</ul>
						</Container>
					</Section>
				</div>
			)}

			<Section className={styles.footerLegal}>
				<p>
					All rights reserved. Copyright &copy; 2020 - {new Date().getFullYear()} by&nbsp;
					<Link href="/home">Benedict Lang</Link>
				</p>
				{simple && (
					<div className={styles.legalLinks}>
						<Link href={'https://lang-familie.de/impressum/'}>Imprint</Link>
						<Link href={'https://lang-familie.de/datenschutzerklaerung/'}>Privacy Policy</Link>
					</div>
				)}
			</Section>
		</footer>
	);
};

export default Footer;
