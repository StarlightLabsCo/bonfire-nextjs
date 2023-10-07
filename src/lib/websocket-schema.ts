enum WebSocketResponseType {
  'instance',
  'message',
  'message-append',
  'delete-messages',
  'image',
  'suggestions',
  'audio',
  'transcription',
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
