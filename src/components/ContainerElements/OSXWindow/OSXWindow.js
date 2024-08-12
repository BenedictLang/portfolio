import styles from './OSXWindow.module.scss';
import { useContext } from 'react';
import { AudioContext } from '../../Audio/AudioProvider';

const OSXWindow = ({ headerText, children, onClick, onClose, onMinimize, onMaximize, ...props }) => {
	const { playSound } = useContext(AudioContext);

	const handleClick = (event, action) => {
		event.preventDefault();
		playSound('click');

		switch (action) {
			case 'close':
				if (onClose) onClose();
				break;
			case 'minimize':
				if (onMinimize) onMinimize();
				break;
			case 'maximize':
				if (onMaximize) onMaximize();
				break;
			default:
				if (onClick) {
					onClick(action);
				}
				break;
		}
	};
	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<div className={styles.dots}>
					<div className={`${styles.dot} ${styles.close}`} onClick={(event) => handleClick(event, 'close')} />
					<div className={`${styles.dot} ${styles.minimize}`} onClick={(event) => handleClick(event, 'minimize')} />
					<div className={`${styles.dot} ${styles.maximize}`} onClick={(event) => handleClick(event, 'maximize')} />
				</div>
				<span className={styles.title}>{headerText}</span>
			</div>
			<div className={styles.content} {...props}>
				{children}
			</div>
		</div>
	);
};

export default OSXWindow;
