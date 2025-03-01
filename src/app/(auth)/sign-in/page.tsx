'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { IconChevronLeft, IconLoader } from '@tabler/icons-react';
import { motion } from 'motion/react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

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
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <IconChevronLeft className="size-5" />
          <Image src="/icons/tkiara.svg" alt="tkiara" width={30} height={30} />
        </Link>
      </div>

      <motion.div
        className="relative"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
      >
        <Card className="lg:w-[30rem] p-2 overflow-hidden bg-white rounded-lg shadow-lg">
          <CardHeader>
            <motion.div
              className="flex gap-3 mb-4 mx-auto"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              <Image src="/icons/tkiara.svg" alt="tkiara" width={30} height={30} />
              <h1 className="text-xl font-bold text-zinc-800 my-auto tracking-tight">tkiara</h1>
            </motion.div>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CardTitle className="text-base md:text-lg">Sign In ✨</CardTitle>
              <CardDescription className="text-xs md:text-sm font-medium text-neutral-500">
                Please select one of these OAuth providers to get started
              </CardDescription>
            </motion.div>
          </CardHeader>
          <Separator />
          <CardContent className="pt-7">
            <div className={cn('w-full gap-2 flex items-center', 'justify-between flex-col')}>
              <Button
                variant="outline"
                className={cn(
                  'w-full gap-2 hover:bg-neutral-100 animate font-semibold text-sm text-neutral-600 tracking-tight',
                )}
                onClick={handleGoogleSignIn}
                disabled={googleLoading}
              >
                {googleLoading ? (
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Image src="/icons/google.svg" alt="Google" width={20} height={20} />
                )}
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className={cn(
                  'w-full gap-2 hover:bg-neutral-100 animate font-semibold text-sm text-neutral-600 tracking-tight',
                )}
                onClick={handleGithubSignIn}
                disabled={githubLoading}
              >
                {githubLoading ? (
                  <IconLoader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Image src="/icons/github.svg" alt="GitHub" width={25} height={25} />
                )}
                Sign in with Github
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Page;
