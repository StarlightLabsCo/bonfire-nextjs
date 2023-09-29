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

  return <>Instance Id {params.instanceId}</>;
}
