'use client';

import { Spinner } from '@/components/spinner';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { useScrollTop } from '@/hooks/use-scroll-top';
import { cn } from '@/lib/utils';
import { SignInButton, UserButton } from '@clerk/clerk-react';
import { useConvexAuth } from 'convex/react';
import Link from 'next/link';
import { Logo } from './logo';

interface IProps {}

export function Navbar(props: IProps) {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const scrolled = useScrollTop();

  return (
    <div
      className={cn(
        'fixed top-0 z-50 flex w-full items-center bg-background p-6 dark:bg-[#1F1F1F]',
        scrolled && 'border-b shadow-sm'
      )}
    >
      <Logo />

      <div className="flex w-full items-center justify-between gap-x-2 md:ml-auto md:justify-end">
        {isLoading && (
          <Spinner />
        )}

        {!isAuthenticated && !isLoading && (
          <>
            <SignInButton mode='modal'>
              <Button variant={'ghost'} size={'sm'}>
                Login
              </Button>
            </SignInButton>
            
            <SignInButton mode='modal'>
              <Button size={'sm'}>
                Get GaldeVotion Free
              </Button>
            </SignInButton>
          </>
        )}

        {isAuthenticated && !isLoading && (
          <>
            <Button variant={'ghost'} size={'sm'} asChild>
              <Link href="/documents">
                Enter GaldeVotion
              </Link>
            </Button>
            <UserButton 
              afterSignOutUrl='/'
            />
          </>
        )}

        <ThemeToggle />
      </div>
    </div>
  );
}
