'use client';

import { useContext, useEffect, useState, useRef } from 'react';
import { MessagesContext } from '@/components/app/messages-context';
import { WebSocketContext } from '@/components/app/ws-context';
import { Message } from '@prisma/client'; // Assuming RoleType exists
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
  const lastMessageDivRef = useRef<HTMLDivElement>(null);
  const lastImageRef = useRef<HTMLImageElement>(null);

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
    if (
      messages.length > 0 &&
      messages[messages.length - 1].role !== 'function' &&
      lastMessageDivRef.current
    ) {
      lastMessageDivRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [messages]);

  const handleImageLoad = () => {
    if (lastImageRef.current) {
      lastImageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  return (
    <div className="h-full flex flex-col items-center w-full px-8 pb-2 md:px-16">
      <div
        className={`${cormorantGaramond.className} h-[calc(100%-2.25rem)] flex flex-col items-center w-full overflow-y-auto gap-y-8 leading-8 font-[400] text-base md:text-lg`}
      >
        {messages.map((message, index: number) => {
          const isLastMessage = index === messages.length - 1;

          switch (message.role) {
            case 'user':
              return (
                <div
                  key={index}
                  className="w-full pl-6 border-l-2 border-neutral-700"
                >
                  <p className="text-neutral-500">{message.content}</p>
                </div>
              );
            case 'assistant':
              return (
                <div key={index} className="w-full">
                  <p>{message.content}</p>
                </div>
              );
            case 'function':
              return (
                <div key={index} className="w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={message.content}
                    className="rounded-2xl fade-in-image"
                    onLoad={isLastMessage ? handleImageLoad : undefined}
                    ref={isLastMessage ? lastImageRef : null}
                    alt="Generated image"
                  />
                </div>
              );
            default:
              return null;
          }
        })}
        <div ref={lastMessageDivRef as React.RefObject<HTMLDivElement>}></div>
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
