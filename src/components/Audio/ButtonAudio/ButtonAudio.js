import { useContext } from 'react';
import { AudioContext } from '../AudioProvider';
import styles from './ButtonAudio.module.scss';

const ButtonAudio = () => {
	const { isPlaying, fadeInBackgroundMusicAndResumeOthers, fadeOutAllPlayingSounds } = useContext(AudioContext);

	const handleClick = () => {
		if (isPlaying) {
			fadeOutAllPlayingSounds();
		} else {
			fadeInBackgroundMusicAndResumeOthers();
		}
	};

	return (
		<div className={styles.soundToggle} onClick={handleClick}>
			<div className={!isPlaying ? styles.noSound : ''}>
				<span className={styles.soundBar}></span>
				<span className={styles.soundBar}></span>
				<span className={styles.soundBar}></span>
				<span className={styles.soundBar}></span>
			</div>
		</div>
	);
};

export default ButtonAudio;
