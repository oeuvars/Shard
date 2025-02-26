'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { IconLoader } from '@tabler/icons-react';

const Page = () => {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signIn.social({
        provider: 'google',
        callbackURL: '/',
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setGithubLoading(true);
    try {
      await signIn.social({
        provider: 'github',
        callbackURL: '/',
      });
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className='flex flex-col justify-center items-center min-h-screen gap-5'>
      <div className='flex gap-3'>
        <Image src="/icons/shard.svg" alt='shard' width={50} height={50} />
        <h1 className='text-2xl font-bold text-zinc-800 my-auto tracking-tight'>Cybership</h1>
      </div>
      <Card className="lg:w-[30rem] p-2">
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Sign In ✨</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Please select one of these OAuth to get started
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className='pt-7'>
          <div className="grid gap-4">
            <div className={cn('w-full gap-2 flex items-center', 'justify-between flex-col')}>
              <Button
                variant="outline"
                className={cn('w-full gap-2 hover:bg-neutral-100 animate')}
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Image
                    src="/icons/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                  />
                )}
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className={cn('w-full gap-2 hover:bg-neutral-100 animate')}
                onClick={handleGithubSignIn}
                disabled={githubLoading}
              >
                {githubLoading ? (
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Image
                    src="/icons/github.svg"
                    alt="GitHub"
                    width={25}
                    height={25}
                  />
                )}
                Sign in with Github
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Page;
