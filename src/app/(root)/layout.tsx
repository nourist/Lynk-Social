import Header from './_layout/header';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<>
			<Header />
			{children}
		</>
	);
};

export default Layout;
