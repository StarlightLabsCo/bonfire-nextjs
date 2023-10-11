'use client';

import { cn } from '@/lib/utils';
import { Instance } from '@prisma/client';
import { usePathname } from 'next/navigation';
import { useSidebar } from '../contexts/sidebar-context';
import { TopActions } from './top-actions';
import { PastStories } from './past-stories';
import { UserInfo } from './user-info';
import { AudioSidebar } from './audio-sidebar';
import { useEffect, useState } from 'react';

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
  const pathname = usePathname();

  const { isSidebarOpen, setShowSidebarOpen } = useSidebar();
  const [displayedInstances, setDisplayedInstances] =
    useState<Instance[]>(instances);

  const handleTransitionEnd = () => {
    if (!isSidebarOpen) {
      setShowSidebarOpen(true);
    }
  };

  useEffect(() => {
    async function updateDisplayedInstances() {
      const instances = await fetch('/api/instances').then((res) => res.json());
      setDisplayedInstances(instances);
    }

    updateDisplayedInstances();
  }, [pathname]);

  return (
    <div
      className={cn(
        'h-full overflow-x-hidden transition-[width] duration-200 flex-shrink-0',
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
        <PastStories instances={displayedInstances} />
        <AudioSidebar />
        <UserInfo user={user} />
      </div>
    </div>
  );
}
