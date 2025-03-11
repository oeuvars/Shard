'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { signIn } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { IconLoader } from '@tabler/icons-react';
import { motion, AnimatePresence } from 'motion/react';

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [googleLoading, setGoogleLoading] = useState<boolean>(false);
  const [githubLoading, setGithubLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isOpen, onClose]);

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const data = await signIn.social({
        provider: 'google',
        callbackURL: '/',
        errorCallbackURL: '/',

      });
      onClose();
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
      onClose();
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-zinc-700 backdrop-blur-sm bg-opacity-0 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
          initial={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
          animate={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
          exit={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}
        >
          <motion.div
            className="relative"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
          >

            <Card className="lg:w-[30rem] p-2 overflow-hidden bg-white/90 backdrop-blur-xl rounded-lg">
              <CardHeader>
                <div className="flex gap-3 mb-4 mx-auto">
                  <Image src="/icons/tkiara.svg" alt="tkiara" width={30} height={30} />
                  <h1 className="text-3xl font-bold text-zinc-700 my-auto tracking-tight">tkiara</h1>
                </div>
                <CardTitle className="text-base md:text-lg">Sign In ✨</CardTitle>
                <CardDescription className="text-xs md:text-sm font-medium text-neutral-500">
                  Please select one to get started
                </CardDescription>
              </CardHeader>
              <Separator className='bg-zinc-300 px-5'/>
              <CardContent className="pt-7">
                <div className={cn('w-full gap-2 flex items-center', 'justify-between flex-col')}>
                  <Button
                    variant="outline"
                    className={cn('w-full gap-2 hover:bg-neutral-100 animate font-semibold text-sm text-neutral-600 tracking-tight')}
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
                    className={cn('w-full gap-2 hover:bg-neutral-100 animate font-semibold text-sm text-neutral-600 tracking-tight')}
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
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
