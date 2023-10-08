'use client';

import { useContext, useEffect, useState } from 'react';
import { WebSocketContext } from '../contexts/ws-context';
import { User } from 'next-auth';
import { Input } from '@/components/input/input';
import { MessagesContext } from '../contexts/messages-context';
import { cn } from '@/lib/utils';
import { AudioProcessorContext } from '../contexts/audio-context';

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
  const [submitted, setSubmitted] = useState(false);

  const [description, setDescription] = useState('');

  const { sendJSON } = useContext(WebSocketContext);
  const { setMessages } = useContext(MessagesContext);
  const { setTranscription } = useContext(AudioProcessorContext);

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
