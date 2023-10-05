import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Toaster } from '@/components/ui/toaster';
import { WebSocketProvider } from '@/components/app/ws-context';
import { AudioContextProvider } from '@/components/app/audio-context';
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
      <AudioContextProvider>
        <MessagesProvider>
          <div className="h-screen bg-neutral-950">
            <div className="h-full flex flex-col max-w-5xl mx-auto">
              <Navbar user={user} />
              <div className="h-[calc(100%-3rem)]">{children}</div>
            </div>
            <Toaster />
          </div>
        </MessagesProvider>
      </AudioContextProvider>
    </WebSocketProvider>
  );
}
