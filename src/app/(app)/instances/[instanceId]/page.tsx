import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import db from '@/lib/db';
import { Story } from '@/components/pages/story';

export default async function Instance({
  params,
}: {
  params: { instanceId: string };
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const instance = await db.instance.findUnique({
    where: {
      id: params.instanceId,
    },
  });

  if (!instance || instance.userId !== user.id) {
    redirect('/');
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
