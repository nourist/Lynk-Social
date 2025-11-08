'use client';

import Image from 'next/image';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
import { createClient } from '~/lib/supabase/client';

const Login = () => {
	const supabase = createClient();

	return (
		<div className="flex h-screen w-screen items-center justify-center px-6">
			<Card className="mb-60 max-w-sm flex-1">
				<CardHeader className="text-2xl font-bold">
					<CardTitle>Login</CardTitle>
					<CardDescription>Sign in with your google account</CardDescription>
				</CardHeader>
				<CardContent>
					<Button
						variant="outline"
						className="w-full"
						onClick={() => {
							supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: '/' } });
						}}
					>
						<Image src="/google-logo.svg" alt="google logo" width={24} height={24} />
						Continue with google
					</Button>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;
