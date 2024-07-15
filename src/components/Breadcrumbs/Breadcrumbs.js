import ClassName from 'models/classname';

import styles from './Breadcrumbs.module.scss';
import CustomLink from '../Link';

const Breadcrumbs = ({ className, breadcrumbs }) => {
	const breadcrumbsClassName = new ClassName(styles.breadcrumbs);

	breadcrumbsClassName.addIf(className, className);

	return (
		<ul className={breadcrumbsClassName.toString()}>
			{breadcrumbs.map(({ id, title, uri }) => {
				return (
					<li key={id}>
						{!uri && title}
						{uri && <CustomLink href={uri}>{title}</CustomLink>}
					</li>
				);
			})}
		</ul>
	);
};

export default Breadcrumbs;
