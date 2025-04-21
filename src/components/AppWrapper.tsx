import React, { PropsWithChildren } from 'react';
import useInviteCode from '@/lib/hooks/useInviteCode';
import { AuthProvider } from '@/lib/dtel-auth/components';

const AppWrapper = ({ children }: PropsWithChildren) => {
  useInviteCode();

  return (
    <AuthProvider>
        <main data-lk-theme="default">{children}</main>
    </AuthProvider>
  );
};

export default AppWrapper;
