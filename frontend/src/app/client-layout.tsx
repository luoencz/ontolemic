'use client';

import * as React from 'react';

import Splash from '@/components/splash';

export default function AppClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Splash loading={loading} />
      {children}
    </>
  );
}
