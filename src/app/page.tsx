'use client';

import Button from "@/components/button";
import Input from "@/components/input";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidV4 } from 'uuid';

const HomePage: React.FC = () => {
  const router = useRouter();

  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const createNewRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
  };

  const joinRoom = () => {
    if (!roomId || !username) {
      toast.error('Please enter username and room ID');
      return;
    }

    router.push(`/room/${roomId}?username=${username}`);
  };

  const handleInputEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      joinRoom();
    }
  };

  return (
    <div className="flex flex-col bg-dark min-h-screen gap-16 p-6 items-center justify-center">
      <h1 className="text-center text-white font-bold text-4xl">Realtime Code Editor Playground</h1>
      <div className="flex flex-col gap-6">
        <Input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleInputEnter}
        />
        <Input
          type="text"
          placeholder="Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          onKeyDown={handleInputEnter}
        />
        <div className="flex gap-4">
          <Button onClick={createNewRoom}>Create New Room Id</Button>
          <Button variant="secondary" onClick={joinRoom}>Join Room</Button>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
