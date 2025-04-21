'use client';

import { NavBar } from '@/components/NavBar/NavBar';
import { toast, Toaster } from 'react-hot-toast';
import styles from '@/app/room/[slug]/Page.module.scss';
import { CharacterName, CharacterSelector } from '@/components/CharacterSelector';
import { Input } from '@/components/Input/Input';
import UserIcon from '@/components/icons/user.svg';
import { Button } from '@/components/Button';
import { Footer } from '@/components/Footer/Footer';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ConnectionDetails, ConnectionDetailsBody } from '@/app/api/createRoom/route';
import { getCookie, setCookie } from '@/app/actions';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMobile } from '@/util/useMobile';
import { push } from 'mnemonist/heap';

export default function Page() {
  const query = useSearchParams();
  const router = useRouter();
  const roomName = query.get('roomName') || "";
  const [username, setUsername] = useState("");  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterName>("doux");
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const isMobile = useMobile();

  useEffect(() => {
    getCookie("username").then((cookie) => {
      setUsername(cookie || "");
    });
  },[]);

  const requestConnectionDetails = useCallback(
    async (username: string) => {
      const body: ConnectionDetailsBody = {
        roomName: roomName as string,
        username,
        character: selectedCharacter,
        randomIp: query.get('randomIp') || undefined,
      };
      const response = await fetch("/api/createRoom", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (response.status === 200) {
        await setCookie('username', username || '', window.location.origin);
        return response.json();
      }

      const { error } = await response.json();
      throw error;
    },
    [selectedCharacter]
  );
  return (
    <>
      <NavBar />
      <Toaster />
      <div
        style={{
          flex: isMobile ? '1' : undefined
        }}
        className={styles.container}
      >
        <h2 className="text-4xl font-bold break-all text-center px-2 max-w-2xl">{roomName}</h2>

        <div className="mb-2.5"></div>

        <CharacterSelector
          selectedCharacter={selectedCharacter}
          onSelectedCharacterChange={setSelectedCharacter}
        />

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              const connectionDetails = await requestConnectionDetails(
                username
              );

              router.push(`/room/${connectionDetails.slug}?wsUrl=${encodeURIComponent(connectionDetails.wsUrl)}&token=${encodeURIComponent(connectionDetails.token)}&roomName=${encodeURIComponent(roomName)}`);
            } catch (e: any) {
              toast.error(e);
            }
          }}
        >
          <Input
            placeholder={"Enter your name"}
            value={username}
            setValue={setUsername}
            startIcon={<UserIcon />}
          />
          <Button
            type={"submit"}
            variant={"default"}
            size={"lg"}
            className={styles.button}
            disabled={!username && username.length < 3}
          >
            Join Room
          </Button>
        </form>
      </div>

      <Footer />
    </>
  );
}
