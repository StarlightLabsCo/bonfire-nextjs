import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

import { Lobby } from './lobby';

export default async function Home() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return <Lobby user={user} />;
}
