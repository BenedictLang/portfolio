import styles from 'styles/pages/Start.module.scss';
import Container from 'components/ContainerElements/Container';
import ButtonGlow from 'components/Buttons/ButtonGlow';
import LayoutFullscreen from 'components/Layouts/LayoutFullscreen';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AudioContext } from '../components/Audio/AudioContext';
import Modal from '../components/Modal';
import OSXWindow from '../components/ContainerElements/OSXWindow';
import Terminal from '../components/Terminal';
import { useRouter } from 'next/router';

export default function Start() {
	const { playSound, stopSound } = useContext(AudioContext);
	const [shape, setShape] = useState('sphere');
	const [isModalVisible, setModalVisible] = useState(false);
	const [terminalChildren, setTerminalChildren] = useState(null);
	const router = useRouter();

	const changeParticles = useCallback(() => {
		setShape(shape === 'sphere' ? 'cube' : 'sphere');
	}, [shape]);

	useEffect(() => {
		console.log('Rendering Start');
		if (isModalVisible) {
			playSound('codeSound');
			playSound('keyboardSound');
		}
	}, [isModalVisible, playSound, stopSound]);

	const handleClick = useCallback(
		(event) => {
			event.preventDefault();
			changeParticles();
			setModalVisible(true);
			router.prefetch('/home').then(() => {});
		},
		[changeParticles, router],
	);

	const handleTerminalComplete = useCallback(() => {
		stopSound('codeSound');
		stopSound('keyboardSound');
		setModalVisible(false);
		playSound('greetings');
		router.push('/home').then(() => {
			playSound('backgroundMusic');
		});
	}, [playSound, router, stopSound]);

	const handleCloseModal = useCallback(() => {
		handleTerminalComplete();
	}, [handleTerminalComplete]);

	// Memoize children to avoid unnecessary re-renders of Terminal
	{/* prettier-ignore */}
	const memoizedTerminalChildren = useMemo(
		() => (
			<>
				<code data-output-type="q">dnsrecon -d benedict.lang-familie.de</code>
				<code data-output-type="a">
					{`
[*] std: Performing General Enumeration against: benedict.lang-familie.de...
[!] Wildcard resolution is enabled on this domain
[!] It is resolving to 85.13.147.176
[-] DNSSEC is not configured for benedict.lang-familie.de
[*] \t A benedict.lang-familie.de 85.13.147.176

[-] No SRV Records Found for benedict.lang-familie.de


`}
				</code>
				<code data-output-type="q">wafw00f benedict.lang-familie.de</code>
				<code data-output-type="a">
					{`
The Web Application Firewall Fingerprinting Toolkit

`}
				</code>
				<code data-output-type="a">
					{`
[*] The site https://benedict.lang-familie.de seems to be behind a WAF or some sort of security solution
[*] The site https://benedict.lang-familie.de is behind Cloudflare (Cloudflare inc.) WAF.
[~] Reason: Response code to a SQL injection attack is "403"

`}
				</code>
				<code data-output-type="q">dig benedict.lang-familie.de NS</code>
				<code data-output-type="a">
					{`
; <
<>> DiG 9.19.25-185-g392e7199df2-1-Debian <
<>> benedict.lang-familie.de NS
;; global options: +cmd
; Got answer:
; ->>HEADER

; AUTHORITY SECTION:
lang-familie.de. 5 IN SOA ns5.server.com. hostmaster.server.com.

; Query time: 44 msec
; SERVER: 192.168.16.2#53(192.168.16.2) (UDP)

`}
				</code>
				<code data-output-type="q">wappalyzer benedict.lang-familie.de</code>
				<code data-output-type="a">
					{`
- - - - - - - - - -
W A P P A L Y Z E R
- - - - - - - - - -
Tools:
---
\tSecurity\treCAPTCHA
\tCDN\tcdnjs, Cloudflare
\tLibraries\tJQuery[3.1.1]
`}
				</code>
				<code data-output-type="a">
					{`
Found Social Links:
---
GitHub [https://github.com/BenedictLang]
LinkedIn [https://www.linkedin.com/in/benedict-lang-72b78721a]
Instagram [https://www.instagram.com/bl_design.de/]

`}
				</code>
				<code data-output-type="q">theHarvester -d benedict.lang-familie.de -b all</code>
				<code data-output-type="a">
					{`
*******************************************************************
*  _   _                                            _             *
* | |_| |__   ___    /\\  /\\__ _ _ ____   _____  ___| |_ ___ _ __  *
* | __|  _ \\ / _ \\  / /_/ / _\` | '__\\ \\ / / _ \\/ __| __/ _ \\ '__| *
* | |_| | | |  __/ / __  / (_| | |   \\ V /  __/\\__ \\ ||  __/ |    *
*  \\__|_| |_|\\___| \\/ /_/ \\__,_|_|    \\_/ \\___||___/\\__\\___|_|    *
*                                                                 *
* theHarvester 4.4.3                                              *
* Coded by Christian Martorella                                   *
* Edge-Security Research                                          *
* cmartorella@edge-security.com                                   *
*                                                                 *
*******************************************************************

[*] Target: benedict.lang-familie.de

`}
				</code>
				<code data-output-type="a">
					{`
[*] Searching Anubis.
[*] Searching Threatminer.
[*] Searching CRTsh. 

`}
				</code>
				<code data-output-type="a">
					{`
Site title      \t\t\tPortfolio | Benedict Lang
Date first seen \t\t\tFebruary 2019
Meta-Author     \t\t\t[Benedict Lang],
Primary language\t\t\tEnglish

`}
				</code>
				<code data-output-type="a">
					{`
Netblock Owner  \t\t\tNeue Medien Muennich GmbH
Location        \t\t\tNeusalza-Spremberg Germany
Nameserver      \t\t\tns5.server.com
DNS Security Extensions\t\tEnabled

`}
				</code>
				<code data-output-type="a">
					{`
Server               \t\tApache 
Public key algorithm \t\trsaEncryption
Signature algorithm  \t\tsha256WithRSAEncryption

`}
				</code>
				<code data-output-type="q"></code>
			</>
		),
		[],
	);

	useEffect(() => {
		setTerminalChildren(memoizedTerminalChildren);
	}, [memoizedTerminalChildren]);

	return (
		<LayoutFullscreen>
			<Container className={styles.content}>
				<ButtonGlow href="/" onClick={handleClick}>
					GET $data
				</ButtonGlow>
				{isModalVisible && (
					<Modal visible={isModalVisible} onClose={handleCloseModal}>
						<OSXWindow headerText="~KaliPurple.vmx" onClose={handleCloseModal}>
							<Terminal isAnimated={true} onComplete={handleTerminalComplete}>
								{terminalChildren}
							</Terminal>
						</OSXWindow>
					</Modal>
				)}
			</Container>
		</LayoutFullscreen>
	);
}

export async function getStaticProps() {
	return {
		props: {},
	};
}
