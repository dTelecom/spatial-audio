import React, { PropsWithChildren } from 'react';
import useInviteCode from '@/lib/hooks/useInviteCode';
import { AuthProvider } from '@/lib/dtel-auth/components';
import { useRibbit } from '@/lib/dtel-common/hooks/useRibbit';

const AppWrapper = ({ children }: PropsWithChildren) => {
  useRibbit();
  useInviteCode();

  return (
    <AuthProvider>
        <main data-lk-theme="default">{children}</main>
    </AuthProvider>
  );
};

export default AppWrapper;
