import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import db from '@/lib/db';
import { Story } from '@/components/app/instances/story';

export default async function Instance({
  params,
}: {
  params: { instanceId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch any from db if this is hard refresh
  const messages = await db.message.findMany({
    where: {
      instanceId: params.instanceId,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  return <Story instanceId={params.instanceId} dbMessages={messages} />;
}
