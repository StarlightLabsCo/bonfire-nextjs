'use client';

import { useContext, useEffect, useState, useRef } from 'react';
import { MessageLike, MessagesContext } from '../contexts/messages-context';
import { WebSocketContext } from '../contexts/ws-context';
import { Message } from '@prisma/client'; // Assuming RoleType exists
import { IBM_Plex_Serif } from 'next/font/google';
import { Input } from '@/components/input/input';

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

  const { sendJSON, setInstanceId } = useContext(WebSocketContext);
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

    setMessages([...messages, { id: '', role: 'user', content: input }]);

    setInput('');
  };

  useEffect(() => {
    if (instanceId && setInstanceId) {
      setInstanceId(instanceId);
    }
  }, [instanceId, setInstanceId]);

  useEffect(() => {
    if (messages.length > 0 && lastMessageDivRef.current) {
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

  function findLastIndex<T>(
    array: T[],
    predicate: (value: T, index: number, array: T[]) => boolean,
  ): number {
    let l = array.length;
    while (l--) {
      if (predicate(array[l], l, array)) return l;
    }
    return -1;
  }

  // Find the last valid message index
  const lastValidMessageIndex = findLastIndex(
    messages,
    (message: MessageLike) =>
      message.role === 'user' ||
      message.role === 'assistant' ||
      (message.role === 'function' &&
        JSON.parse(message.content).type === 'generate_image'),
  );

  return (
    <div className="flex flex-col items-center w-full h-full px-8 pb-2 md:px-16">
      <div
        className={`${cormorantGaramond.className} h-[calc(100%-2.25rem)] flex flex-col items-center w-full overflow-y-auto gap-y-8 leading-8 font-[400] text-base md:text-lg`}
      >
        {messages.map((message: MessageLike, index: number) => {
          const isLastValidMessage = index === lastValidMessageIndex;

          switch (message.role) {
            case 'user':
              return (
                <div
                  key={index}
                  className="w-full pl-6 border-l-2 border-neutral-700"
                  // Attach the ref if it's the last valid message
                  ref={isLastValidMessage ? lastMessageDivRef : null}
                >
                  <p className="text-neutral-500">{message.content}</p>
                </div>
              );
            case 'assistant':
              return (
                <div
                  key={index}
                  className="w-full"
                  // Attach the ref if it's the last valid message
                  ref={isLastValidMessage ? lastMessageDivRef : null}
                >
                  <p>{message.content}</p>
                </div>
              );
            case 'function':
              const data = JSON.parse(message.content);
              if (data.type === 'generate_image') {
                return (
                  <div key={index} className="w-full">
                    {data.payload['imageURL'] && (
                      <img
                        src={data.payload['imageURL']}
                        className="rounded-2xl fade-in-2s"
                        onLoad={
                          isLastValidMessage ? handleImageLoad : undefined
                        }
                        ref={isLastValidMessage ? lastImageRef : null}
                        alt="Generated image"
                      />
                    )}
                  </div>
                );
              } else return null;

            default:
              return null;
          }
        })}
        <div ref={lastMessageDivRef}></div>
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
