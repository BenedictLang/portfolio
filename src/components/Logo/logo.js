import Link from 'next/link';
import Image from 'next/image';
import styles from './Logo.module.scss';

const Logo = () => {
	return (
		<Link href="/home" className={styles.logo}>
			<Image src="/images/logos/bl_logo.svg" alt="Logo" width={50} height={50} />
		</Link>
	);
};

export default Logo;
