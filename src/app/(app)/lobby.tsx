'use client';

import { useContext, useEffect } from 'react';
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

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        console.log('Message from server:', event.data);
      };
    }
  }, [socket]);

  // TODO: have button that sends message to server
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
          description: 'test instance',
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
