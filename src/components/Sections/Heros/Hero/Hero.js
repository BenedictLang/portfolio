import ClassName from '../../../../models/classname';

import styles from './Hero.module.scss';
import GlitchText from '../../../Text/GlitchText';
import ButtonGlow from '../../../Buttons/ButtonGlow';
import GradientText from '../../../Text/GradientText';
import Content from '../../../ContainerElements/Content';
import CustomLink from '../../../Link';
import { FiGithub, FiLinkedin, FiDribbble } from 'react-icons/fi';
import { RiStackOverflowFill } from 'react-icons/ri';
import { CgScrollV } from 'react-icons/cg';

const Hero = ({ children, className }) => {
	const contentClassName = new ClassName();

	contentClassName.addIf(className, className);

	return (
		<div className={`${contentClassName.toString()} ${styles.hero}`}>
			<Content className={styles.content}>
				<div className={styles.socialLinks}>
					<CustomLink href={'https://github.com/BenedictLang'}>
						<FiGithub />
					</CustomLink>
					<CustomLink href={'https://www.linkedin.com/in/benedict-lang-72b78721a'}>
						<FiLinkedin />
					</CustomLink>
					{/*<CustomLink href={'https://www.instagram.com/bl_design.de/'}>
						<FiInstagram />
					</CustomLink>*/}
					<CustomLink href={'https://dribbble.com/BL-Design'}>
						<FiDribbble />
					</CustomLink>
					<CustomLink href={'https://stackoverflow.com/users/16054918/benedict-lang'}>
						<RiStackOverflowFill />
					</CustomLink>
					{/*<CustomLink href={'https://app.hackthebox.com/profile/1687811'}>
						<SiHackthebox />
					</CustomLink>*/}
				</div>
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
						<CgScrollV />
					</ButtonGlow>
				</div>
				{children}
			</Content>
		</div>
	);
};

export default Hero;
