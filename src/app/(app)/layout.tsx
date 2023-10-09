import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Toaster } from '@/components/ui/toaster';
import { WebSocketProvider } from '@/components/contexts/ws-context';
import { AudioContextProvider } from '@/components/contexts/audio-context';
import { MessagesProvider } from '@/components/contexts/messages-context';
import { Sidebar } from '@/components/sidebar';
import { SidebarProvider } from '@/components/contexts/sidebar-context';
import db from '@/lib/db';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  const instances = await db.instance.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return (
    <WebSocketProvider>
      <AudioContextProvider>
        <MessagesProvider>
          <SidebarProvider>
            <div className="h-screen bg-neutral-950 flex">
              <Sidebar user={user} instances={instances} />
              <div className="flex flex-col w-full h-full max-w-5xl mx-auto">
                <div className="h-full">{children}</div>
              </div>
              <Toaster />
            </div>
          </SidebarProvider>
        </MessagesProvider>
      </AudioContextProvider>
    </WebSocketProvider>
  );
}
