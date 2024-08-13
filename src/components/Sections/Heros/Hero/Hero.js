import ClassName from '../../../../models/classname';

import styles from './Hero.module.scss';
import GlitchText from '../../../Text/GlitchText';
import ButtonGlow from '../../../Buttons/ButtonGlow';
import GradientText from '../../../Text/GradientText';
import Content from '../../../ContainerElements/Content';

const Hero = ({ children, className }) => {
	const contentClassName = new ClassName();

	contentClassName.addIf(className, className);

	return (
		<div className={`${contentClassName.toString()} ${styles.hero}`}>
			<Content>
				<div className={styles.textBox}>
					<hr />
					<h2>Design & Software. Made in Germany.</h2>
					<h1>
						Hey, I&apos;m&nbsp;
						<GlitchText text="Benny" intervalTime={40} />
					</h1>
					<p>
						As a full-stack software engineer and designer, I love to create digital experiences and optimizing IT
						processes and security. I&apos;m ready for your <GradientText string={'challenge'} />.
					</p>
					<ButtonGlow href="/#clients" className={styles.btn} overglow={false}>
						Learn more
					</ButtonGlow>
				</div>
				{children}
			</Content>
		</div>
	);
};

export default Hero;
