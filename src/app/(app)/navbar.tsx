'use client';

import { UserNav } from '@/components/user-nav';
import { WebSocketStatusIndicator } from './ws-indicator';
import { User } from 'next-auth';

export function Navbar({ user }: { user: { id: string } & User }) {
  return (
    <div className="flex w-full gap-x-2 justify-end items-center py-2 px-4 ">
      <WebSocketStatusIndicator />
      <UserNav {...user} />
    </div>
  );
}
