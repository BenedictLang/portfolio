import styles from './Header.module.scss';

import Container from '../../ContainerElements/Container';
import Nav from '../../Menu/Nav';
import Logo from '../../Logo';
import ButtonAudio from '../../Audio/ButtonAudio';

const Header = ({ children, minimal = false }) => {
	return (
		<header className={`${styles.header} ${minimal ? styles.minimal : ''}`}>
			<div className={styles.navLogo}>
				<Logo />
			</div>
			<div className={styles.headerWrapper}>
				{!minimal && (
					<div className={styles.wrapper}>
						<Container>{children}</Container>
						<Nav />
					</div>
				)}
				<ButtonAudio minimal={!minimal} />
			</div>
		</header>
	);
};

export default Header;
