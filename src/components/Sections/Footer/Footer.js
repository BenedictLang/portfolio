import useSite from '../../../hooks/use-site';
import { postPathBySlug } from '../../../lib/posts';
import { categoryPathBySlug } from '../../../lib/categories';

import Section from '../Section';
import Container from '../../ContainerElements/Container';

import styles from './Footer.module.scss';
import CustomLink from '../../Link';

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
										<CustomLink className={styles.footerMenuTitle} href="/posts/">
											<strong>Recent Posts</strong>
										</CustomLink>
										<ul className={styles.footerMenuItems}>
											{recentPosts.map((post) => {
												const { id, slug, title } = post;
												return (
													<li key={id}>
														<CustomLink href={postPathBySlug(slug)}>{title}</CustomLink>
													</li>
												);
											})}
										</ul>
									</li>
								)}
								{hasRecentCategories && (
									<li>
										<CustomLink href="/categories/" className={styles.footerMenuTitle}>
											<strong>Categories</strong>
										</CustomLink>
										<ul className={styles.footerMenuItems}>
											{categories.map((category) => {
												const { id, slug, name } = category;
												return (
													<li key={id}>
														<CustomLink href={categoryPathBySlug(slug)}>{name}</CustomLink>
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
				<div className={styles.copyright}>
					<p>All rights reserved. Copyright &copy; 2020 - {new Date().getFullYear()} by&nbsp;</p>
					<CustomLink href="/home">Benedict Lang</CustomLink>
				</div>
				{simple && (
					<div className={styles.legalLinks}>
						<CustomLink href={'https://lang-familie.de/impressum/'}>Imprint</CustomLink>
						<CustomLink href={'https://lang-familie.de/datenschutzerklaerung/'}>Privacy Policy</CustomLink>
					</div>
				)}
			</Section>
		</footer>
	);
};

export default Footer;
