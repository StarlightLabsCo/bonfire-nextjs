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
  const [imageIndex, setImageIndex] = useState(0);
  const [imageURL, setImageURL] = useState(images[imageIndex]);
  const [animated, setAnimated] = useState(false);

  const [description, setDescription] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const { sendJSON } = useContext(WebSocketContext);

  const createWelcome = () => {
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
    createWelcome();
    createInstance(description);
    setCollapsed(true);
  };

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
      <div
        className={cn(
          `relative w-full max-w-xl mt-8`,
          collapsed ? 'collapse-input' : '',
        )}
      >
        <Input
          placeholder="Describe an adventure or leave it blank for a surprise"
          className="w-full py-6 pl-4 pr-10 align-middle border-none placeholder:text-neutral-500 rounded-2xl bg-neutral-900"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
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