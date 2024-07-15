import { categoryPathBySlug } from 'lib/categories';
import { authorPathByName } from 'lib/users';
import { formatDate } from 'lib/datetime';
import ClassName from 'models/classname';

import { FaMapPin } from 'react-icons/fa';
import styles from './Metadata.module.scss';
import CustomLink from '../Link';

const DEFAULT_METADATA_OPTIONS = {
	compactCategories: true,
};

const Metadata = ({ className, author, date, categories, options = DEFAULT_METADATA_OPTIONS, isSticky = false }) => {
	const metadataClassName = new ClassName(styles.metadata);

	metadataClassName.addIf(className, className);

	const { compactCategories } = options;

	return (
		<ul className={metadataClassName.toString()}>
			{author && (
				<li className={styles.metadataAuthor}>
					<address>
						{author.avatar && (
							<img
								width={author.avatar.width}
								height={author.avatar.height}
								src={author.avatar.url}
								alt="Author Avatar"
							/>
						)}
						By{' '}
						<CustomLink href={authorPathByName(author.name)} rel="author">
							{author.name}
						</CustomLink>
					</address>
				</li>
			)}
			{date && (
				<li>
					<time dateTime={date}>{formatDate(date)}</time>
				</li>
			)}
			{Array.isArray(categories) && categories[0] && (
				<li className={styles.metadataCategories}>
					{compactCategories && (
						<p title={categories.map(({ name }) => name).join(', ')}>
							<CustomLink href={categoryPathBySlug(categories[0].slug)}>{categories[0].name}</CustomLink>
							{categories.length > 1 && ' and more'}
						</p>
					)}
					{!compactCategories && (
						<ul>
							{categories.map((category) => {
								return (
									<li key={category.slug}>
										<CustomLink href={categoryPathBySlug(category.slug)}>{category.name}</CustomLink>
									</li>
								);
							})}
						</ul>
					)}
				</li>
			)}
			{isSticky && (
				<li className={styles.metadataSticky}>
					<FaMapPin aria-label="Sticky Post" />
				</li>
			)}
		</ul>
	);
};

export default Metadata;
