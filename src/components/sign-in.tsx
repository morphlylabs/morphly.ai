'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '~/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { GoogleIcon } from '~/components/ui/google-icon';
import { authClient } from '~/lib/auth-client';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

  const signIn = async () => {
    await authClient.signIn.email({
      email,
      password,
      callbackURL: '/',
      fetchOptions: {
        onResponse: () => {
          setIsLoading(false);
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onError: ctx => {
          toast.error(ctx.error.message);
        },
        onSuccess: async () => {
          router.push('/');
        },
      },
    });
  };

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/',
        fetchOptions: {
          onError: ctx => {
            toast.error(ctx.error.message);
            setIsGoogleLoading(false);
          },
          onSuccess: async () => {
            router.push('/');
          },
        },
      });
    } catch (error) {
      toast.error('Failed to sign in with Google');
      setIsGoogleLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Google Sign In Button */}
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={signInWithGoogle}
          disabled={isGoogleLoading}
        >
          {isGoogleLoading ? (
            'Signing in...'
          ) : (
            <>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Sign in with Google
            </>
          )}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background text-muted-foreground px-2">
              Or continue with
            </span>
          </div>
        </div>

        {/* Existing Email/Password Form */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <Button
          type="button"
          className="w-full"
          onClick={signIn}
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </CardContent>
    </Card>
  );
}
