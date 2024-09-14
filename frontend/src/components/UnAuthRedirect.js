'use client'; // Required for Next.js App Router to use client-side hooks

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'; // Next.js 14 App Router useRouter

const UnAuthRedirect = ({ children }) => {
  const { isLoggedIn } = useSelector((state) => state.auth);

  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Mark component as client-rendered
    if (isLoggedIn) {
      router.push('/');
    }
  }, [isLoggedIn, router]);

  if (!isClient) {
    return <div className='h-screen w-screen fixed top-0 left-0 z-10 flex items-center justify-center font-bold text-white bg-black text-3xl'>Hey, Building page for you ;-)</div>;
  }

  return <>{!isLoggedIn ? children : <div className='h-screen w-screen fixed top-0 left-0 z-10 flex items-center justify-center font-bold text-white bg-black text-3xl'>Logout to access this page!!</div>}</>;

};

export default UnAuthRedirect;