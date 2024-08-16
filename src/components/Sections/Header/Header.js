import styles from './Header.module.scss';

import Container from '../../ContainerElements/Container';
import Nav from '../../Menu/Nav';
import Logo from '../../Logo';
import ButtonAudio from '../../Audio/ButtonAudio';
import { useViewport } from '../../_General/Viewport/ViewportProvider';
import { useEffect, useState } from 'react';

const Header = ({ children, minimal = false }) => {
	const { isMobile } = useViewport();
	const [isVisible, setIsVisible] = useState(true);
	const [isScrolled, setIsScrolled] = useState(false);
	const [isScrolledEnough, setIsScrolledEnough] = useState(false);
	const [lastScrollTop, setLastScrollTop] = useState(0);

	useEffect(() => {
		const handleScroll = () => {
			if (!isMobile) {
				const currentScrollTop = window.scrollY || document.documentElement.scrollTop;

				// Check if scrolled
				if (currentScrollTop > 5) {
					setIsScrolled(true);
				} else {
					setIsScrolled(false);
				}

				// Check if scrolled more than 3rem
				if (currentScrollTop > window.innerHeight * 0.5) {
					setIsScrolledEnough(true);
				} else {
					setIsScrolledEnough(false);
				}

				// Check if scrolling up or down
				if (currentScrollTop > lastScrollTop && currentScrollTop > window.innerHeight * 0.2) {
					setIsVisible(false);
				} else {
					setIsVisible(true);
				}

				setLastScrollTop(currentScrollTop <= 0 ? 0 : currentScrollTop);
			} else {
				//const currentScrollBottom = window.scrollY || document.documentElement.scrollTop;
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [isMobile, lastScrollTop]);

	return (
		<header
			className={`${styles.header} ${minimal ? styles.minimal : ''} ${isScrolled ? styles.scrolled : ''} ${isScrolledEnough ? styles.scrolledEnough : ''} ${isVisible ? '' : styles.hidden}`}
		>
			<div className={styles.headerWrapper}>
				<div className={styles.navLogo}>
					<Logo />
				</div>
				<div className={styles.headerContentWrapper}>
					{!minimal && (
						<div className={styles.wrapper}>
							<Container>{children}</Container>
							<Nav />
						</div>
					)}
					<ButtonAudio minimal={!minimal} />
				</div>
			</div>
		</header>
	);
};

export default Header;
