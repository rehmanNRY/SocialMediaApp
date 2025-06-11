'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation'; // Next.js 14 App Router useRouter
import Loading from './Loading';

const AuthRedirect = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { data: session, status } = useSession();

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Mark component as client-rendered
    
    // Check if user is authenticated via Redux (which handles both email and Google auth)
    if (!isLoggedIn && status !== 'loading') {
      // Redirect to /login if the user is not logged in
      router.push('/login');
    }
  }, [isLoggedIn, status, router]);

  if (!isClient || status === 'loading') {
    return <Loading />;
  }

  return <>{isLoggedIn && children}</>;
};

export default AuthRedirect;
