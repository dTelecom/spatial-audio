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
import { ConnectionDetailsBody } from '@/app/api/join/route';
import { getCookie, setCookie } from '@/app/actions';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMobile } from '@/util/useMobile';
import { Loader } from '@dtelecom/components-react';

export default function Page() {
  const router = useRouter();
  const { slug } = useParams();
  const query = useSearchParams();
  const roomName = query.get('roomName') || "";
  const [username, setUsername] = useState("");
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterName>("doux");
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMobile();

  useEffect(() => {
    getCookie("username").then((cookie) => {
      setUsername(cookie || "");
    });
  }, []);

  const humanRoomName = useMemo(() => {
    return decodeURI(roomName as string);
  }, [roomName]);

  const requestConnectionDetails = useCallback(
    async (username: string) => {
      const body: ConnectionDetailsBody = {
        slug: slug as string,
        username,
        character: selectedCharacter,
        randomIp: query.get('randomIp') || undefined,
      };
      const response = await fetch("/api/join", {
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
    [slug, selectedCharacter]
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
        <h2 className="text-4xl font-bold break-all text-center px-2 max-w-2xl">{humanRoomName}</h2>

        <div className="mb-2.5"></div>

        <CharacterSelector
          selectedCharacter={selectedCharacter}
          onSelectedCharacterChange={setSelectedCharacter}
        />

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              setIsLoading(true);
              const connectionDetails = await requestConnectionDetails(
                username
              );
              router.push(
                `/room/${slug}?token=${connectionDetails.token}&wsUrl=${connectionDetails.wsUrl}&roomName=${roomName}`
              );
            } catch (e: any) {
              toast.error(e);
              setIsLoading(false);
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
            disabled={!username || username.length < 3 || isLoading}
          >
            {isLoading ? <Loader /> : "Join Room"}
          </Button>
        </form>
      </div>

      <Footer />
    </>
  );
}
