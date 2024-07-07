import styles from './Header.module.scss';

import Container from 'components/Container';
import Nav from '../Nav';
import Logo from '../Logo';

const Header = ({ children, simple = false }) => {
	return (
		<header className={styles.header}>
			<div className={styles.navLogo}>
				<Logo />
			</div>
			{!simple && (
				<div className={styles.wrapper}>
					<Container>{children}</Container>
					<Nav />
				</div>
			)}
		</header>
	);
};

export default Header;
