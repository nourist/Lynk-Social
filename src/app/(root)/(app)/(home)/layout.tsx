import Sidebar from './_layout/sidebar';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<>
			<div className="p-6 lg:pr-84">{children}</div>
			<Sidebar />
		</>
	);
};

export default Layout;
