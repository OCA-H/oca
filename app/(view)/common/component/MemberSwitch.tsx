'use client';

import React from 'react';
import { useAuth } from '@/app/(view)/common/helper/useAuth';

/**
 * Shows `guest` to visitors and `member` (nothing by default) to signed-in members, for the
 * "Become a Member" pitches around the site. Until the sign-in check answers, the guest version
 * holds its place invisibly, so the layout does not move and a member never sees the pitch flash.
 * `display: contents` keeps the wrapper out of the parent's flex or grid layout.
 */
export const MemberSwitch: React.FC<{ guest: React.ReactNode; member?: React.ReactNode }> = ({ guest, member = null }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ display: 'contents', visibility: 'hidden' }} aria-hidden="true" inert>
        {guest}
      </div>
    );
  }
  return <>{isAuthenticated ? member : guest}</>;
};

export default MemberSwitch;
