import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/session';
import { Toaster } from '@/components/ui/toaster';
import { WebSocketProvider } from './ws-context';
import { Navbar } from './navbar';

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
      <Navbar user={user} />
      {children}
      <Toaster />
    </WebSocketProvider>
  );
}
