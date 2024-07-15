import { useContext } from 'react';
import { AudioContext } from './AudioContext';
import styles from './ButtonAudio.module.scss';

const ButtonAudio = () => {
	const { isPlaying, toggleAudio, playClickSound } = useContext(AudioContext);

	const handleClick = () => {
		toggleAudio();
		playClickSound();
	};

	return (
		<div className={styles.soundToggle} onClick={handleClick}>
			<div>
				<span className={`${styles.soundBar} ${!isPlaying && styles.noSound}`}></span>
				<span className={`${styles.soundBar} ${!isPlaying && styles.noSound}`}></span>
				<span className={`${styles.soundBar} ${!isPlaying && styles.noSound}`}></span>
				<span className={`${styles.soundBar} ${!isPlaying && styles.noSound}`}></span>
			</div>
		</div>
	);
};

export default ButtonAudio;
