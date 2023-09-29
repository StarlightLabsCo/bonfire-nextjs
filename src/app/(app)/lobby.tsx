'use client';

import { useContext, useState } from 'react';
import { WebSocketContext } from './ws-context';
import { User } from 'next-auth';

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
    <div className="flex flex-col">
      <button onClick={createInstance}>Create Instance</button>
    </div>
  );
}
