import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Instances() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // const instances = await db

  return <>Instances</>;
}
