'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Loading from './Loading';

const UnAuthRedirect = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isClient) {
    return <Loading />;
  }

  return <>{!isLoggedIn ? children : <Loading />}</>;

};

export default UnAuthRedirect;