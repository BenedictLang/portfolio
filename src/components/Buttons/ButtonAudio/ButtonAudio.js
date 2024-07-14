import { useContext } from 'react';
import { AudioContext } from './AudioContext';
import styles from './ButtonAudio.module.scss';

const ButtonAudio = () => {
	const { isPlaying, toggleAudio } = useContext(AudioContext);

	return (
		<div className={styles.soundToggle} onClick={toggleAudio}>
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
