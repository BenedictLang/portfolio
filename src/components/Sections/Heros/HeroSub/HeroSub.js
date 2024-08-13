import ClassName from '../../../../models/classname';
import styles from './HeroSub.module.scss';
import useSite from '../../../../hooks/use-site';
import GlitchText from '../../../Text/GlitchText';

export default function HeroSub({ children, className }) {
	const { metadata = {} } = useSite();
	const { description } = metadata;

	const contentClassName = new ClassName();
	contentClassName.addIf(className, className);

	return (
		<div className={styles.heroSub}>
			<h1>
				<GlitchText text="Hello World!" intervalTime={50} />
			</h1>
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
