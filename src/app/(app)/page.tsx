import { getCurrentUser } from '@/lib/session';

import { Lobby } from './lobby';

export default async function Home() {
  const user = await getCurrentUser();

  return <Lobby user={user} />;
}
