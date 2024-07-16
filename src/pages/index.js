import styles from 'styles/pages/Start.module.scss';
import Container from 'components/ContainerElements/Container';
import ButtonGlow from 'components/Buttons/ButtonGlow';
import LayoutFullscreen from 'components/Layouts/LayoutFullscreen';
import { useContext, useEffect, useState } from 'react';
import { AudioContext } from '../components/Buttons/ButtonAudio/AudioContext';
import Modal from '../components/Modal';
import OSXWindow from '../components/ContainerElements/OSXWindow';
import Terminal from '../components/Terminal';

export default function Start() {
	const { isPlaying, toggleAudio, playKeySound, playCodeSound, stopKeySound, stopCodeSound } = useContext(AudioContext);
	const [shape, setShape] = useState('sphere');
	const [isModalVisible, setModalVisible] = useState(false);

	const changeParticles = () => {
		setShape(shape === 'sphere' ? 'cube' : 'sphere');
	};

	useEffect(() => {
		if (isModalVisible) {
			playKeySound();
			playCodeSound();
		} else {
			stopKeySound();
			stopCodeSound();
		}
	}, [isModalVisible, playCodeSound, playKeySound, stopCodeSound, stopKeySound]);

	const handleClick = (event) => {
		event.preventDefault();
		if (!isPlaying) {
			toggleAudio();
		}
		changeParticles();
		setModalVisible(true);
	};

	const handleCloseModal = () => {
		setModalVisible(false);
	};

	return (
		<LayoutFullscreen>
			<Container className={styles.content}>
				<ButtonGlow href="/" onClick={handleClick}>
					GET $data
				</ButtonGlow>
				{isModalVisible && (
					<Modal visible={isModalVisible} onClose={handleCloseModal}>
						<OSXWindow headerText="~KaliPurple.vmx" onClose={handleCloseModal}>
							{/* prettier-ignore */}
							<Terminal>

								root@kali:~# theHarvester -d benedict.lang-familie.de -b all

								*******************************************************************
								*  _   _                                            _             *
								* | |_| |__   ___    /\  /\__ _ _ ____   _____  ___| |_ ___ _ __  *
								* | __|  _ \ / _ \  / /_/ / _` | &apos;__\ \ / / _ \/ __| __/ _ \ &apos;__| *
								* | |_| | | |  __/ / __  / (_| | |   \ V /  __/\__ \ ||  __/ |    *
								*  \__|_| |_|\___| \/ /_/ \__,_|_|    \_/ \___||___/\__\___|_|    *
								*                                                                 *
								* theHarvester 4.4.3                                              *
								* Coded by Christian Martorella                                   *
								* Edge-Security Research                                          *
								* cmartorella@edge-security.com                                   *
								*                                                                 *
								*******************************************************************

								[*] Target: benedict.lang-familie.de

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
