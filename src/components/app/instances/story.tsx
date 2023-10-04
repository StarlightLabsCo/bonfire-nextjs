'use client';

import { useContext, useEffect, useState, useRef } from 'react';
import { MessagesContext } from '@/components/app/messages-context';
import { WebSocketContext } from '@/components/app/ws-context';
import { Message } from '@prisma/client';
import { IBM_Plex_Serif } from 'next/font/google';
import { Input } from '@/components/input';

export const cormorantGaramond = IBM_Plex_Serif({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700'],
});

export function Story({
  instanceId,
  dbMessages,
}: {
  instanceId: string;
  dbMessages: Message[];
}) {
  const [input, setInput] = useState('');
  const containerBottomRef = useRef<HTMLDivElement>(null);

  const { sendJSON } = useContext(WebSocketContext);
  const { messages, setMessages } = useContext(MessagesContext);

  if (messages.length === 0) {
    setMessages(dbMessages);
  }

  const submit = () => {
    sendJSON({
      type: 'add-player-message',
      payload: {
        instanceId,
        content: input,
      },
    });

    setMessages([...messages, { role: 'user', content: input }]);

    setInput('');
  };

  useEffect(() => {
    if (containerBottomRef.current) {
      containerBottomRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-16 py-8">
      <div
        className={`${cormorantGaramond.className} flex flex-col items-center w-full h-full gap-y-8 leading-8 font-[400] text-lg overflow-y-auto`}
      >
        {messages.map((message, index: number) => {
          const messageTypes: Record<
            'user' | 'assistant' | 'function',
            JSX.Element
          > = {
            user: (
              <div
                key={index}
                className="w-full pl-6 border-l-2 border-neutral-700"
              >
                <p className="text-neutral-500">{message.content}</p>
              </div>
            ),
            assistant: (
              <div key={index} className="w-full">
                <p>{message.content}</p>
              </div>
            ),
            function: (
              <div key={index} className="w-full">
                <img src={message.content} />
              </div>
            ),
          };

          return messageTypes[
            message.role as 'user' | 'assistant' | 'function'
          ];
        })}
        <div ref={containerBottomRef} />
      </div>
      <Input
        placeholder="What do you do?"
        value={input}
        setValue={setInput}
        submit={submit}
      />
    </div>
  );
}
