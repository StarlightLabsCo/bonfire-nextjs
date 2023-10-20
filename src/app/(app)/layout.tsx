import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Toaster } from '@/components/ui/toaster';
import { WebSocketProvider } from '@/components/contexts/ws-context';
import { AudioContextProvider } from '@/components/contexts/audio-context';
import { MessagesProvider } from '@/components/contexts/messages-context';
import { Sidebar } from '@/components/sidebar/sidebar';
import { SidebarProvider } from '@/components/contexts/sidebar-context';
import { DialogProvider } from '@/components/contexts/dialog-context';
import { OutOfCreditsDialog } from '@/components/dialog/outofcredits-dialog';

import db from '@/lib/db';
import { Instance } from '@prisma/client';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  let instances: Instance[] = [];
  if (user) {
    instances = await db.instance.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  return (
    <WebSocketProvider>
      <AudioContextProvider>
        <MessagesProvider>
          <SidebarProvider>
            <DialogProvider>
              <div className="h-screen bg-neutral-950 flex">
                {user && <Sidebar user={user} instances={instances} />}
                <div className="flex flex-col w-full h-full max-w-5xl mx-auto">
                  <div className="h-full">{children}</div>
                </div>
                <Toaster />
                <OutOfCreditsDialog />
              </div>
            </DialogProvider>
          </SidebarProvider>
        </MessagesProvider>
      </AudioContextProvider>
    </WebSocketProvider>
  );
}
