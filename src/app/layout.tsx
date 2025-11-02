import { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Inter } from 'next/font/google';

import { Toaster } from '~/components/ui/sonner';
import '~/styles/globals.css';

export const metadata: Metadata = {
	title: 'Lynk - Social Media with Realtime Messaging',
	description: 'Lynk is a social media platform with real-time messaging. Connect, chat, and share instantly with friends in a seamless and dynamic environment.',
	icons: '/logo.png',
};

interface Props {
	children: React.ReactNode;
}

const inter = Inter({
	subsets: ['latin'],
});

const RootLayout = async ({ children }: Props) => {
	return (
		<html className={inter.className} suppressHydrationWarning lang="en">
			<body className="antialiased">
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
};

export default RootLayout;
