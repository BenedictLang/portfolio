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

export default function Home({ customers }) {
	const { metadata = {} } = useSite();
	const { title } = metadata;
	const { isMobile } = useViewport();
	const { setCameraTarget } = useContext(ThreeSceneContext);
	const clientsRef = useRef(null);

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
			<Section className={styles.tileSection}></Section>
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
