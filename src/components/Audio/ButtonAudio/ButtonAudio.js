import { useContext } from 'react';
import { AudioContext } from '../AudioProvider';
import styles from './ButtonAudio.module.scss';

const ButtonAudio = ({ minimal = false }) => {
	const { isPlaying, mute } = useContext(AudioContext);

	const handleClick = () => {
		if (isPlaying) {
			mute(true);
		} else {
			mute(false);
		}
	};

	return (
		<div className={styles.soundToggle} onClick={handleClick}>
			{!minimal && <span>Sound</span>}
			<div className={`${styles.soundBars} ${!isPlaying ? styles.noSound : ''}`}>
				<span className={styles.soundBar}></span>
				<span className={styles.soundBar}></span>
				<span className={styles.soundBar}></span>
				<span className={styles.soundBar}></span>
			</div>
		</div>
	);
};

export default ButtonAudio;
