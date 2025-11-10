'use client';

import { useTheme } from 'next-themes';

const Home = () => {
	const { theme, setTheme } = useTheme();

	return (
		<>
			<button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>Toggle Theme</button>
			<div className="h-[200vh] w-full"></div>
		</>
	);
};

export default Home;
