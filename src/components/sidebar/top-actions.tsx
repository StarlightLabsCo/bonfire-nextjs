'use client';

import { useRouter } from 'next/navigation';
import { Icons } from '../icons';
import { useSidebar } from '../contexts/sidebar-context';

export function TopActions() {
  const { closeSidebar } = useSidebar();
  const router = useRouter();

  return (
    <div className="w-full h-12 p-2 flex items-center gap-x-2">
      <div
        className="h-8 flex grow p-2 gap-x-2 items-center rounded-md border border-white/10 hover:cursor-pointer"
        onClick={() => {
          router.push('/');
        }}
      >
        <Icons.plus className="w-4 h-4" />
        <div className="text-xs font-light">New Story</div>
      </div>
      <div
        className="h-8 flex p-2 items-center justify-center rounded-md border border-white/10 hover:cursor-pointer"
        onClick={() => closeSidebar()}
      >
        <Icons.sidepanel className="w-4 h-4" />
      </div>
    </div>
  );
}
