import styles from './Header.module.scss';

import Container from '../../ContainerElements/Container';
import Nav from '../../Menu/Nav';
import Logo from '../../Logo';
import ButtonAudio from '../../Buttons/ButtonAudio';

const Header = ({ children, simple = false }) => {
	return (
		<header className={styles.header}>
			<div className={styles.navLogo}>
				<Logo />
			</div>
			<div className={styles.headerWrapper}>
				{!simple && (
					<div className={styles.wrapper}>
						<Container>{children}</Container>
						<Nav />
					</div>
				)}
				<ButtonAudio />
			</div>
		</header>
	);
};

export default Header;
