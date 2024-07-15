import Image from 'next/image';
import styles from './Logo.module.scss';
import CustomLink from '../Link';

const Logo = () => {
	return (
		<CustomLink href="/home" className={styles.logo}>
			<Image src="/images/logos/Logo-BL.svg" alt="Logo" width={50} height={50} />
		</CustomLink>
	);
};

export default Logo;
