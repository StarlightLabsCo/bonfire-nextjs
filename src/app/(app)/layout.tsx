import { getCurrentUser } from '@/lib/session';
import { redirect } from 'next/navigation';
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
    </WebSocketProvider>
  );
}
