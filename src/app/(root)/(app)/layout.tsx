import Sidebar from './_layout/sidebar';
import { ScrollArea } from '~/components/ui/scroll-area';

interface Props {
	children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
	return (
		<>
			<Sidebar />
			<ScrollArea className="h-full flex-1">{children}</ScrollArea>
		</>
	);
};

export default Layout;
