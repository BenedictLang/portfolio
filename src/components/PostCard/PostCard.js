import { postPathBySlug, sanitizeExcerpt } from 'lib/posts';

import Metadata from 'components/Metadata';

import { FaMapPin } from 'react-icons/fa';
import styles from './PostCard.module.scss';
import CustomLink from '../Link';

const PostCard = ({ post, options = {} }) => {
	const { title, excerpt, slug, date, author, categories, isSticky = false } = post;
	const { excludeMetadata = [] } = options;

	const metadata = {};

	if (!excludeMetadata.includes('author')) {
		metadata.author = author;
	}

	if (!excludeMetadata.includes('date')) {
		metadata.date = date;
	}

	if (!excludeMetadata.includes('categories')) {
		metadata.categories = categories;
	}

	let postCardStyle = styles.postCard;

	if (isSticky) {
		postCardStyle = `${postCardStyle} ${styles.postCardSticky}`;
	}

	return (
		<div className={postCardStyle}>
			{isSticky && <FaMapPin aria-label="Sticky Post" />}
			<CustomLink href={postPathBySlug(slug)}>
				<h3
					className={styles.postCardTitle}
					dangerouslySetInnerHTML={{
						__html: title,
					}}
				/>
			</CustomLink>
			<Metadata className={styles.postCardMetadata} {...metadata} />
			{excerpt && (
				<div
					className={styles.postCardContent}
					dangerouslySetInnerHTML={{
						__html: sanitizeExcerpt(excerpt),
					}}
				/>
			)}
		</div>
	);
};

export default PostCard;
