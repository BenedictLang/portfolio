import useSite from 'hooks/use-site';
import { WebsiteJsonLd } from 'lib/json-ld';
import styles from 'styles/pages/Home.module.scss';

import Layout from 'components/Layouts/Layout';
import Section from 'components/Sections/Section';
import { useContext, useEffect, useRef } from 'react';
import { ThreeSceneContext } from '../components/3D/ThreeSceneProvider';
import { Vector3 } from 'three';
import { useViewport } from '../components/_General/Viewport/ViewportProvider';
import Hero from '../components/Sections/Heros/Hero';
import LogoSlider from '../components/Slider/LogoSlider';
import Image from 'next/image';
import CustomLink from '../components/Link';
import { getAllCustomers } from '../lib/customers';
import Content from '../components/ContainerElements/Content';
import Button from '../components/Buttons/Button';
import { IoArchiveOutline } from 'react-icons/io5';

export default function Home({ customers }) {
	const { metadata = {} } = useSite();
	const { title } = metadata;
	const { isMobile } = useViewport();
	const { setCameraTarget } = useContext(ThreeSceneContext);
	const clientsRef = useRef(null);
	const currentYear = new Date().getFullYear();

	useEffect(() => {
		const newTarget = new Vector3();
		if (isMobile) {
			newTarget.y = -7;
		} else {
			newTarget.x = 5;
		}
		setCameraTarget(newTarget);
	}, [isMobile, setCameraTarget]);

	return (
		<Layout>
			<WebsiteJsonLd siteTitle={title} />
			<Hero scrollTo={clientsRef.current} />
			<div ref={clientsRef}>
				<LogoSlider>
					{customers.map((customer) => {
						return (
							<CustomLink key={customer.id} href={customer.site} className={styles.customerLink}>
								<div className={styles.customerLogo}>
									<Image src={customer.logo.url} alt={customer.logo.alt} width={53} height={33} />
								</div>
							</CustomLink>
						);
					})}
				</LogoSlider>
			</div>
			{/*<Section className={styles.services}>
				<Content></Content>
			</Section>*/}
			<Section className={styles.aboutSection}>
				<Content className={styles.aboutContent}>
					<div>
						<h3>About Me</h3>
						<p>
							I am a 24-year-old Bachelor student in Computer Science and Media at Media University Stuttgart (HdM),
							Germany. As a full-stack developer, I enjoy optimizing processes using my IT knowledge and continually
							learning new technologies to achieve that goal. Creating a secure and impressive user experience are
							crucial parts to me.
						</p>
						<div className={styles.aboutBlock}>
							<p>
								During my studies, I used to work as a tutor and enjoyed assisting other students in various design and
								software projects. While explaining, things become even clearer for myself. As a student trainee I
								gained insights in AI appliance at our institute IAAI for two semesters. Subsequently, when working on
								software projects, I always advocated for appliance security and constantly developed my passion for
								InfoSec while continuing my exciting journey at Porsche.
							</p>
						</div>
					</div>
					<div className={styles.numbers}>
						<div className={styles.infoBox}>
							<span className={styles.years}>{currentYear - 2014}</span>
							<span>
								Jahre <br />
								Grafikdesign
							</span>
						</div>
						<div className={styles.infoBox}>
							<span className={styles.years}>{currentYear - 2017}</span>
							<span>
								Jahre Web <br />
								Entwicklung
							</span>
						</div>
						<div className={styles.infoBox}>
							<span className={styles.years}>{currentYear - 2019}</span>
							<span>
								Jahre Software <br />
								Entwicklung
							</span>
						</div>
					</div>
				</Content>
			</Section>
			<Section>
				<Content className={styles.portfolioContent}>
					<Button href={'https://www.apps.benedict.lang-familie.de'} className={styles.showWork}>
						All Work <IoArchiveOutline />
					</Button>
				</Content>
			</Section>
		</Layout>
	);
}

export async function getStaticProps() {
	const { customers } = await getAllCustomers();
	return {
		props: {
			customers,
		},
	};
}
