'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from './Loading';

const UnAuthRedirect = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);
  const { data: session, status } = useSession();

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Check if user is authenticated via Redux (which handles both email and Google auth)
    if (isLoggedIn && status !== 'loading') {
      router.push('/');
    }
  }, [isLoggedIn, status, router]);

  if (!isClient || status === 'loading') {
    return <Loading />;
  }

  return <>{!isLoggedIn ? children : <Loading />}</>;

};

export default UnAuthRedirect;