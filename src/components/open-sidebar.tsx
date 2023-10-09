'use client';

import { useSidebar } from './contexts/sidebar-context';
import { Icons } from './icons';

export function OpenSidebar() {
  const { showSidebarOpen, openSidebar } = useSidebar();

  if (showSidebarOpen) {
    return (
      <div
        className="absolute top-2 left-2 h-8 flex p-2 items-center justify-center rounded-md border border-white/10 hover:cursor-pointer"
        onClick={() => openSidebar()}
      >
        <Icons.sidepanel className="w-4 h-4" />
      </div>
    );
  }
}
