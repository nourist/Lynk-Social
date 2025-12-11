'use client';

import Image from 'next/image';
import { useCallback } from 'react';

import { Button } from '~/components/ui/button';
import { createClient } from '~/lib/supabase/client';

const Login = () => {
	const supabase = createClient();

	const handleLogin = useCallback(() => {
		supabase.auth.signInWithOAuth({
			provider: 'google',
			options: {
				redirectTo: `/`,
			},
		});
	}, [supabase]);

	return (
		<div className="relative container grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
			<div className="bg-muted relative hidden h-full flex-col p-10 text-white lg:flex dark:border-r">
				<div className="absolute inset-0 bg-zinc-900" />
				<div className="relative z-20 flex items-center text-lg font-medium">
					<div className="mr-2 flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1">
						<Image src="/logo.png" alt="logo" width={32} height={32} />
					</div>
					Lynk
				</div>
				<div className="relative z-20 mt-auto">
					<blockquote className="space-y-2">
						<p className="text-lg">&ldquo;Connect with friends and the world around you on Lynk. Share what&apos;s new and life moments with your friends.&rdquo;</p>
					</blockquote>
				</div>
			</div>
			<div className="lg:p-8">
				<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
					<div className="flex flex-col space-y-2 text-center">
						<h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
						<p className="text-muted-foreground text-sm">Sign in to your account to continue</p>
					</div>
					<div className="grid gap-6">
						<Button variant="outline" type="button" disabled={false} onClick={handleLogin}>
							<Image src="/google-logo.svg" alt="google logo" width={24} height={24} className="mr-2" />
							Continue with Google
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
