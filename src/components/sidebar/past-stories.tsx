'use client';

import { Instance } from '@prisma/client';
import { Icons } from '../icons';
import { useRouter } from 'next/navigation';

export function PastStories({ instances }: { instances: Instance[] }) {
  const router = useRouter();

  return (
    <div className="w-full grow px-2 flex flex-col overflow-y-scroll">
      <div className="text-xs p-2">Past Stories</div>
      <div className="flex flex-col gap-y-2">
        {instances.map((instance, index) => (
          <div
            key={index}
            className="h-10 w-full p-2 flex items-center hover:bg-white/10 rounded-md text-xs font-light hover:cursor-pointer"
            onClick={() => {
              router.push(`/instances/${instance.id}`);
            }}
          >
            <Icons.logo className="w-4 h-4 mr-2 flex-shrink-0" />
            <div className="overflow-hidden text-ellipsis whitespace-nowrap">
              {instance.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
