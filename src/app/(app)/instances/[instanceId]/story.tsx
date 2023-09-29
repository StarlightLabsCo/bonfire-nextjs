'use client';

import { Input } from '@/components/ui/input';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { useContext, useState } from 'react';
import { MessagesContext } from '../../messages-context';
import { WebSocketContext } from '../../ws-context';
import { Message } from '@prisma/client';

export function Story({
  instanceId,
  dbMessages,
}: {
  instanceId: string;
  dbMessages: Message[];
}) {
  const [input, setInput] = useState('');

  const socket = useContext(WebSocketContext);
  const { messages, setMessages } = useContext(MessagesContext);

  if (messages.length === 0) {
    setMessages(dbMessages);
  }

  const submit = () => {
    if (!socket) {
      console.log('socket not connected');
      return;
    }

    socket.send(
      JSON.stringify({
        type: 'add-player-message',
        payload: {
          instanceId,
          content: input,
        },
      }),
    );

    setMessages([...messages, { role: 'user', content: input }]);

    setInput('');
  };

  return (
    <div className="h-full flex flex-col items-center p-5">
      <div className="flex flex-col items-center w-full max-w-xl h-full gap-y-5 p-5 grow">
        {messages.map((message, index: number) =>
          message.role === 'user' ? (
            <div key={index} className="w-full text-right">
              <span className="text-slate-500">{message.content}</span>
            </div>
          ) : (
            <div key={index} className="w-full text-left">
              <span>{message.content}</span>
            </div>
          ),
        )}
      </div>
      <div className="justify-self-end relative w-full max-w-xl mt-8 bg-neutral-900 rounded-2xl">
        <Input
          placeholder="What do you do?"
          className="w-full py-6 pl-4 pr-10 align-middle border-none placeholder:text-neutral-500"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              submit();
            }
          }}
        />
        <PaperPlaneIcon
          className="absolute w-4 h-4 translate-y-1/2 cursor-pointer text-neutral-500 right-4 bottom-1/2"
          onClick={() => {
            submit();
          }}
        />
      </div>
    </div>
  );
}
