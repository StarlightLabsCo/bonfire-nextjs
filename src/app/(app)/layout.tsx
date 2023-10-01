import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Toaster } from '@/components/ui/toaster';
import { WebSocketProvider } from '@/components/app/ws-context';
import { MessagesProvider } from '@/components/app/messages-context';
import { Navbar } from '@/components/app/navbar';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <WebSocketProvider>
      <MessagesProvider>
        <div className="h-screen bg-neutral-950">
          <div className="flex flex-col h-full max-w-5xl mx-auto">
            <Navbar user={user} />
            {children}
          </div>
          <Toaster />
        </div>
      </MessagesProvider>
    </WebSocketProvider>
  );
}
