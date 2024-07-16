import styles from './Main.module.scss';

const Main = ({ children, className }) => {
	return <main className={`${styles.main} ${className}`}>{children}</main>;
};

export default Main;
