import ClassName from 'models/classname';
import styles from './HeroSub.module.scss';
import useSite from '../../../hooks/use-site';

export default function HeroSub({ children, className }) {
	const { metadata = {} } = useSite();
	const { title, description } = metadata;

	const contentClassName = new ClassName();
	contentClassName.addIf(className, className);

	return (
		<div className={styles.heroSub}>
			<h1
				dangerouslySetInnerHTML={{
					__html: title,
				}}
			/>
			<p
				className={styles.description}
				dangerouslySetInnerHTML={{
					__html: description,
				}}
			/>
			<div className={contentClassName.toString()}>{children}</div>
		</div>
	);
}
