import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';

export default async function Instance({
  params,
}: {
  params: { instanceId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // const instance = await db

  return <>Instance Id {params.instanceId}</>;
}
