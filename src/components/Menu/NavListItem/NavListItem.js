// import ClassName from 'models/classname';
// import styles from './NavListItem.module.scss';
import CustomLink from '../../Link';

const NavListItem = ({ className, item }) => {
	const nestedItems = (item.children || []).map((item) => {
		return <NavListItem key={item.id} item={item} />;
	});

	return (
		<li key={item.id}>
			{/* 
        Before rendering the Link component, we first check if `item.path` exists
        and if it does not include 'http'. This prevents a TypeError when `item.path` is null.
      */}
			{item.path && !item.path.includes('http') && !item.target && (
				<CustomLink href={item.path} title={item.title}>
					{item.label}
				</CustomLink>
			)}
			{/* 
        Before rendering the `a` tag, we first check if `item.path` exists
        and if it includes 'http'. This prevents a TypeError when `item.path` is null.
      */}
			{item.path && item.path.includes('http') && (
				<a href={item.path} title={item.title} target={item.target}>
					{item.label}
				</a>
			)}

			{nestedItems.length > 0 && <ul className={className}>{nestedItems}</ul>}
		</li>
	);
};

export default NavListItem;
