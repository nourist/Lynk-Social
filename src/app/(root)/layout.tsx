import Header from './_layout/header';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<>
			<Header />
			<div className="flex h-[calc(100vh-64px)] w-full">{children}</div>
		</>
	);
};

export default Layout;
