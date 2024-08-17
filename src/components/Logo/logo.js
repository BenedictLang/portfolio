import Image from 'next/image';
import styles from './Logo.module.scss';
import CustomLink from '../Link';

const Logo = () => {
	return (
		<CustomLink href="/home" className={styles.logo}>
			<div className={styles.logoImage}>
				<Image className={styles.img} src="/images/logos/Logo-BL.svg" alt="Logo" width={53} height={41} />
			</div>
		</CustomLink>
	);
};

export default Logo;
