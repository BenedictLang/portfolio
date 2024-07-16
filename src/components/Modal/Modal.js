import styles from './Modal.module.scss';

const Modal = ({ children, visible, ...props }) => {
	const handleClick = (event) => {
		event.stopPropagation();
	};
	return (
		<div className={`${styles.container} ${visible ? styles.visible : ''}`}>
			<div className={`${styles.modal} ${visible ? styles.visible : ''}`} onClick={handleClick} {...props}>
				{children}
			</div>
		</div>
	);
};

export default Modal;
