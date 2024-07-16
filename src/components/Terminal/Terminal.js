import styles from './Terminal.module.scss';

const Terminal = ({ children }) => {
	return (
		<div className={styles.terminal}>
			<pre className={styles.pre}>
				<code className={styles.code}>{children}</code>
			</pre>
		</div>
	);
};

export default Terminal;
