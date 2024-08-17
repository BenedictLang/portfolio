import useSite from '../../../hooks/use-site';
import { postPathBySlug } from '../../../lib/posts';
import { categoryPathBySlug } from '../../../lib/categories';

import Section from '../Section';
import Container from '../../ContainerElements/Container';

import styles from './Footer.module.scss';
import CustomLink from '../../Link';
import { FaSitemap, FaRssSquare } from 'react-icons/fa';

const Footer = ({ minimal = false }) => {
	const { recentPosts = [], categories = [] } = useSite();

	const hasRecentPosts = Array.isArray(recentPosts) && recentPosts.length > 0;
	const hasRecentCategories = Array.isArray(categories) && categories.length > 0;
	const hasMenu = hasRecentPosts || hasRecentCategories;

	return (
		<footer className={styles.footer}>
			{hasMenu && !minimal && (
				<div>
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
								{!minimal && (
									<li>
										<div className={styles.footerMenuTitle}>
											<strong>Legal</strong>
										</div>
										<ul className={styles.footerMenuItems}>
											<li>
												<CustomLink href={'https://lang-familie.de/impressum/'}>Imprint</CustomLink>
											</li>
											<li>
												<CustomLink href={'https://lang-familie.de/datenschutzerklaerung/'}>Privacy Policy</CustomLink>
											</li>
										</ul>
									</li>
								)}
							</ul>
						</Container>
					</Section>
				</div>
			)}

			<Section className={styles.footerLegal}>
				<div className={styles.copyright}>
					<p>
						All rights reserved. Copyright &copy; 2020 - {new Date().getFullYear()} by&nbsp;
						<CustomLink href="/home">Benedict Lang</CustomLink>
					</p>
				</div>
				{minimal && (
					<div className={styles.legalLinks}>
						<CustomLink href={'https://lang-familie.de/impressum/'}>Imprint</CustomLink>
						<CustomLink href={'https://lang-familie.de/datenschutzerklaerung/'}>Privacy Policy</CustomLink>
					</div>
				)}
				{!minimal && (
					<ul className={styles.footerAccessibles}>
						<li>
							<a href="/feed.xml" aria-details="RSS">
								<FaRssSquare />
							</a>
						</li>
						<li>
							<a href="/sitemap.xml" aria-details="Sitemap">
								<FaSitemap />
							</a>
						</li>
					</ul>
				)}
			</Section>
		</footer>
	);
};

export default Footer;
