'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; // Next.js 14 App Router useRouter
import Loading from './Loading';

const AuthRedirect = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Mark component as client-rendered
    if (!isLoggedIn) {
      // Redirect to /login if the user is not logged in
      router.push('/login');
    }
  }, [isLoggedIn, router]);

  if (!isClient) {
    return <Loading />;
  }

  return <>{isLoggedIn && children}</>;
};

export default AuthRedirect;
