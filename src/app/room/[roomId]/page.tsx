'use client';

import Button from "@/components/button";
import Editor from "@/components/code-editor";
import UserAvatar from "@/components/user-avatar";
import { initializeSocket } from "@/socket";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
const EVENTS = require('@/socket-events/events.ts');

const RoomPage: React.FC = () => {
  const searchParams = useSearchParams();
  const currentUsername = searchParams.get('username');
  const { roomId } = useParams();

  const socketRef = useRef<any>(null);
  const codeRef = useRef(null);
  const router = useRouter();
  const [editors, setEditors] = useState<any>([]);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initializeSocket();
      socketRef.current.on('connect_error', (err: string) => handleErrors(err));
      socketRef.current.on('connect_failed', (err: string) => handleErrors(err));

      function handleErrors(e: string) {
        console.log('socket error', e);
        toast.error('Socket connection failed, try again later');
        router.push('/');
      }

      socketRef.current.emit(EVENTS.JOIN, {
        roomId,
        username: currentUsername,
      });

      socketRef.current.on(
        EVENTS.JOINED, ({
          editors,
          username,
          socketId
        }: any) => {
          if (username !== currentUsername) {
            toast.success(`${username} joined the room`);
          }
          setEditors(editors);
          socketRef.current.emit(EVENTS.SYNC_CODE, {
            code: codeRef.current,
            socketId,
          });
        },
      );

      socketRef.current.on(
        EVENTS.DISCONNECTED, ({
          socketId,
          username,
        }:{
          socketId: string;
          username: string;
        }) => {
          toast.success(`${username} left the room`);
          setEditors((prev: any) => {
            return prev.filter(
              (editor: any) => editor.socketId !== socketId
            );
          });
        }
      );
    };

    init();
    return () => {
      socketRef.current?.disconnect();
      socketRef.current?.off(EVENTS.JOINED);
      socketRef.current?.off(EVENTS.DISCONNECTED);
    };
  }, []);

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId as string);
      toast.success('Room ID has been copied to your clipboard');
    } catch (err) {
      toast.error('Failed to copy the Room ID');
      console.error(err);
    }
  }

  function leaveRoom() {
    router.push('/');
  }

  if (!currentUsername) {
    router.push('/');
  }

  return (
    <div className="flex flex-col md:flex-row bg-dark">
      <div className="flex flex-col gap-4 min-w-full md:min-w-74 pb-8">
        <div className="p-5 bg-dark text-white">
          <h1 className="text-center font-bold text-2xl">Realtime Code Editor<br /> Playground</h1>
        </div>
        <div className="grow">
          <div className="flex flex-wrap md:grid md:grid-cols-2 gap-3 p-3">
            {editors.map((editor: any) => (
              <UserAvatar
                key={editor.socketId}
                username={editor.username}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-row md:flex-col justify-center items-center gap-5">
          <Button onClick={copyRoomId}>
            Copy Room ID
          </Button>
          <Button variant="secondary" onClick={leaveRoom}>
            Leave Room
          </Button>
        </div>
      </div>
      <div className="w-full md:grow">
        <Editor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code: any) => {
            codeRef.current = code;
          }}
        />
      </div>
    </div>
  );
}

export default RoomPage;
