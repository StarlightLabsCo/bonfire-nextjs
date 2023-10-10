'use client';

import { cn } from '@/lib/utils';
import { useSidebar } from '../contexts/sidebar-context';
import { Instance } from '@prisma/client';
import { TopActions } from './top-actions';
import { PastStories } from './past-stories';
import { UserInfo } from './user-info';
import { AudioSidebar } from './audio-sidebar';

export function Sidebar({
  user,
  instances,
}: {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
  instances: Instance[];
}) {
  const { isSidebarOpen, setShowSidebarOpen } = useSidebar();

  const handleTransitionEnd = () => {
    if (!isSidebarOpen) {
      setShowSidebarOpen(true);
    }
  };

  return (
    <div
      className={cn(
        'h-full overflow-x-hidden transition-[width] duration-200 ',
        isSidebarOpen ? 'w-[250px]' : 'w-0',
      )}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className={cn(
          'h-full w-[250px] flex flex-col justify-between items-center bg-black border-r border-white/10',
        )}
      >
        <TopActions />
        <PastStories instances={instances} />
        <AudioSidebar />
        <UserInfo user={user} />
      </div>
    </div>
  );
}
