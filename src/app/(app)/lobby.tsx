'use client';

import { useContext, useState } from 'react';
import { WebSocketContext } from './ws-context';
import { User } from 'next-auth';
import { Textarea } from '@/components/ui/textarea';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Input } from '@/components/ui/input';

export function Lobby({
  user,
}: {
  user: {
    id: string;
  } & User;
}) {
  const socket = useContext(WebSocketContext);

  // TODO: make it so we send a welcome message once user's audio is enabled.
  //  socket.send(
  //    JSON.stringify({
  //      type: 'welcome',
  //      payload: {},
  //    }),
  //  );

  const createInstance = () => {
    if (!socket) {
      console.log('socket not connected');
      return;
    }

    socket.send(
      JSON.stringify({
        type: 'create-instance',
        payload: {
          userId: user.id,
          description: 'test instance', // TODO: hardcoded
        },
      }),
    );
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 grow">
      <div className="relative flex items-center justify-center w-full h-full">
        <div className="relative">
          <img
            className="absolute inset-0 object-cover w-3/4 mx-auto rounded-full opacity-100 blur-lg"
            src="https://cdn.midjourney.com/9ed73ce9-cea2-46f3-b846-f5a7dc7d56ce/0_0_384_N.webp"
          />
          <img
            className="relative object-cover w-3/4 mx-auto rounded-full -z-1"
            src="https://cdn.midjourney.com/9ed73ce9-cea2-46f3-b846-f5a7dc7d56ce/0_0_384_N.webp"
          />
        </div>
      </div>
      <div className="relative w-full max-w-xl mt-8 bg-neutral-900 rounded-2xl">
        <Input
          placeholder="Describe an adventure or leave it blank for a surprise"
          className="w-full py-6 pl-4 pr-10 align-middle border-none placeholder:text-neutral-500"
        />
        <PaperPlaneIcon className="absolute w-4 h-4 translate-y-1/2 cursor-pointer text-neutral-500 right-4 bottom-1/2" />
      </div>
    </div>
  );
}
