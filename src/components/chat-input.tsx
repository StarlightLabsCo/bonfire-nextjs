import React, { useState } from 'react';
import { PaperPlaneIcon } from '@radix-ui/react-icons';
import { Input } from './ui/input';
import '@/app/globals.css';
import { cn } from '@/lib/utils';

export function ChatInput({
  value,
  onValueChange,
  onSubmit,
}: {
  value: string;
  onValueChange: (value: string) => void;
  onSubmit: () => void;
}) {
  return (
    <div
      className={cn(`relative w-full max-w-xl mt-8 bg-neutral-900 rounded-2xl`)}
    >
      <Input
        placeholder="Describe an adventure or leave it blank for a surprise"
        className="w-full py-6 pl-4 pr-10 align-middle border-none placeholder:text-neutral-500"
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
      />
      <PaperPlaneIcon
        className="absolute w-4 h-4 translate-y-1/2 cursor-pointer text-neutral-500 right-4 bottom-1/2"
        onClick={() => {
          onSubmit();
        }}
      />
    </div>
  );
}
