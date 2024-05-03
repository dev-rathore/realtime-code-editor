import { io } from 'socket.io-client';

export const initializeSocket = async () => {
  const options = {
    'force new connection': true,
    reconnectionAttempt: 'Infinity',
    timeout: 10000,
    transports: ['websocket'],
  };

  return io(process.env.NEXT_PUBLIC_BACKEND_URL!, options);
};
