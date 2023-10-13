'use client';

import { useEffect, useState } from 'react';
import { useWebSocket } from '../contexts/ws-context';
import { User } from 'next-auth';
import { Input } from '@/components/input/input';
import { useMessages } from '../contexts/messages-context';
import { cn } from '@/lib/utils';
import { useAudioProcessor } from '../contexts/audio-context';
import { OpenSidebar } from '../open-sidebar';

const images = [
  'https://cdn.midjourney.com/e5622218-4a2e-454c-b363-fb2eb5ac19d4/0_3_384_N.webp',
  'https://cdn.midjourney.com/ef41d5b0-9fd9-4d49-ae0c-ed00c7edf203/0_1_384_N.webp',
  'https://cdn.midjourney.com/00fb46a6-9381-429e-8214-19ad54115646/0_2_384_N.webp',
  'https://cdn.midjourney.com/556bd42f-9628-4cfe-9746-192b22adc7cc/0_1_384_N.webp',
  'https://cdn.midjourney.com/69fe04d3-b7d2-459a-8a03-20eca7e15da4/0_0_384_N.webp',
  'https://cdn.midjourney.com/d5f5d1ec-4e0d-42ad-89ac-7d864f267823/0_1_384_N.webp',
  'https://cdn.midjourney.com/d586ee37-b92a-4bef-80d2-39a5134052a9/0_3_384_N.webp',
  'https://cdn.midjourney.com/46c00113-6238-4ec8-917d-f8e4c30891fb/0_2_384_N.webp',
  'https://cdn.midjourney.com/8ccbac33-1cfa-4fc5-9063-bbff1bd51fa1/0_1_384_N.webp',
  'https://cdn.midjourney.com/5b4a2220-b0f4-4f84-8695-4dfc108f85d0/0_2_384_N.webp',
  'https://cdn.midjourney.com/f3ca868e-d134-4acc-885d-becbc69870be/0_1_384_N.webp',
  'https://cdn.midjourney.com/9cff748a-f758-448a-9980-765bac88f6ef/0_0_384_N.webp',
  'https://cdn.midjourney.com/2a30621c-64cb-41a6-9bdb-d82efa8f2e61/0_0_384_N.webp',
  'https://cdn.midjourney.com/ff9a8a58-87b9-4f03-8bde-134aaf00d03c/0_3_384_N.webp',
  'https://cdn.midjourney.com/9ed73ce9-cea2-46f3-b846-f5a7dc7d56ce/0_0_384_N.webp',
  'https://cdn.midjourney.com/1ffb835f-93e3-4e3b-9427-2e43787bc1c0/0_2_384_N.webp',
  'https://cdn.midjourney.com/e1405baf-c725-40ab-9683-e867901c8469/0_1_384_N.webp',
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
  const [animated, setAnimated] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [description, setDescription] = useState('');

  const { sendJSON } = useWebSocket();
  const { setMessages } = useMessages();
  const { setTranscription } = useAudioProcessor();

  const createWelcome = (description: string) => {
    sendJSON({
      type: 'welcome',
      payload: {},
    });
  };

  const createInstance = (description: string) => {
    sendJSON({
      type: 'create-instance',
      payload: {
        userId: user.id,
        description: description,
      },
    });
  };

  const submit = () => {
    setSubmitted(true);
    createWelcome(description);
    createInstance(description);
  };

  useEffect(() => {
    setMessages([]);
    setTranscription('');
  }, []);

  useEffect(() => {
    const cycleImage = () => {
      setAnimated(true);

      // Set timeout for 2.5s (halfway through the animation) to swap the image
      setTimeout(() => {
        setImageIndex((oldIndex) => {
          const newIndex = (oldIndex + 1) % images.length;
          setImageURL(images[newIndex]);

          return newIndex;
        });
      }, 2500);

      // After 5s, end the animation (this will align with the completion of the CSS animation)
      setTimeout(() => {
        setAnimated(false);
      }, 5000);
    };

    cycleImage();

    const interval = setInterval(cycleImage, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-5 gap-y-5 grow">
      <OpenSidebar />
      <div className="relative flex items-center justify-center w-full">
        <div className="relative">
          <img
            className={`absolute inset-0 object-cover w-3/4 h-full mx-auto rounded-full opacity-100 aspect-1 blur-lg ${
              animated ? 'animate-background-transition' : ''
            }`}
            src={imageURL}
          />
          <img
            className={`relative object-cover w-3/4 mx-auto rounded-full aspect-1 h-3/4 -z-1 ${
              animated ? 'animate-image-transition' : ''
            }`}
            src={imageURL}
          />
        </div>
      </div>
      <Input
        value={description}
        setValue={setDescription}
        submit={submit}
        placeholder="Describe your adventure..."
        disabled={submitted}
        className={cn(submitted && 'cursor-not-allowed fade-out-2s')}
      />
    </div>
  );
}
