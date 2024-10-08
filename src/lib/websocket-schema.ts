enum WebSocketResponseType {
  'adventure-suggestions',
  'instance',
  'stop-audio',
  'message',
  'message-append',
  'image',
  'suggestions',
  'audio',
  'transcription',
  'outOfCredits',
  'error',
}

type WebSocketResponse = {
  type: WebSocketResponseType;
  payload: {
    id: string;
    content: string | object;
  };
};

export { WebSocketResponseType };
export type { WebSocketResponse };
