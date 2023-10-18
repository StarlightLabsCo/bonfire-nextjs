'use client';

import { WebSocketResponseType } from '@/lib/websocket-schema';
import { createContext, useState, useContext, useEffect } from 'react';
import { useWebSocket } from './ws-context';

interface DialogContextProps {
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const DialogContext = createContext<DialogContextProps | undefined>(
  undefined,
);

type DialogProviderProps = {
  children: React.ReactNode;
};

export const DialogProvider: React.FC<DialogProviderProps> = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket } = useWebSocket();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  function handleMessage(event: MessageEvent) {
    const data = JSON.parse(event.data);

    if (data.type === WebSocketResponseType.outOfCredits) {
      setIsDialogOpen(true);
    }
  }

  useEffect(() => {
    if (socket) {
      socket.addEventListener('message', handleMessage);
    }

    return () => {
      socket?.removeEventListener('message', handleMessage);
    };
  }, [socket]);

  return (
    <DialogContext.Provider
      value={{
        isDialogOpen,
        setIsDialogOpen,
      }}
    >
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = () => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
};
