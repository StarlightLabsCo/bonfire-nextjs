'use client';

import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from './ws-context';
import { User } from 'next-auth';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const images = [
  'https://cdn.midjourney.com/9ed73ce9-cea2-46f3-b846-f5a7dc7d56ce/0_0_384_N.webp',
  'https://cdn.midjourney.com/1ffb835f-93e3-4e3b-9427-2e43787bc1c0/0_2_384_N.webp',
  'https://cdn.midjourney.com/9c9708a2-e2b4-40a9-a79e-d4ad540aa8c6/0_0_384_N.webp',
];

export function Lobby({
  user,
}: {
  user: {
    id: string;
  } & User;
}) {
  const [imageIndex, setImageIndex] = useState(
    Math.floor(Math.random() * images.length),
  );
  const [imageURL, setImageURL] = useState(images[imageIndex]);

  const [description, setDescription] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const socket = useContext(WebSocketContext);

  const createInstance = (description: string) => {
    if (!socket) {
      console.log('socket not connected');
      return;
    }

    socket.send(
      JSON.stringify({
        type: 'create-instance',
        payload: {
          userId: user.id,
          description: description,
        },
      }),
    );
  };

  useEffect(() => {
    // cycle through images every few seconds
    const interval = setInterval(() => {
      setImageIndex((imageIndex) => (imageIndex + 1) % images.length);
      setImageURL(images[imageIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }),
    [];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 grow">
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="relative">
          <img
            className="absolute aspect-1 w-3/4 h-3/4 inset-0 object-cover mx-auto rounded-full opacity-100 blur-lg"
            src={imageURL}
          />
          <img
            className="relative aspect-1 w-3/4 h-3/4 object-cover mx-auto rounded-full -z-1"
            src={imageURL}
          />
        </div>
      </div>
      <div
        className={cn(
          `relative w-full max-w-xl mt-8 bg-neutral-900 rounded-2xl`,
          collapsed ? 'collapse-input' : '',
        )}
      >
        <Input
          placeholder="Describe an adventure or leave it blank for a surprise"
          className="w-full py-6 pl-4 pr-10 align-middle border-none placeholder:text-neutral-500"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <PaperPlaneIcon
          className="absolute w-4 h-4 translate-y-1/2 cursor-pointer text-neutral-500 right-4 bottom-1/2"
          onClick={() => {
            createInstance(description);
            setCollapsed(true);
          }}
        />
      </div>
    </div>
  );
}
