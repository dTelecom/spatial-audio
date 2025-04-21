"use client";

import { WebAudioContext } from "@/providers/audio/webAudio";
import { BottomBar } from "@/components/BottomBar";
import { ConnectionDetails, ConnectionDetailsBody, } from "@/app/api/connection_details/route";
import { LiveKitRoom } from "@dtelecom/components-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { CharacterName, CharacterSelector, } from "@/components/CharacterSelector";
import { GameView } from "@/components/GameView";
import { Input } from "@/components/Input/Input";
import UserIcon from "@/components/icons/user.svg";
import { Button } from "@/components/Button";
import styles from "./Page.module.scss";
import { NavBar } from "@/components/NavBar/NavBar";
import { Footer } from "@/components/Footer/Footer";
import { RoomNavBar } from "@/components/RoomNavBar/RoomNavBar";
import { useParams, useSearchParams } from "next/navigation";
import { useMobile } from "@/util/useMobile";
import { getCookie, setCookie } from '@/app/actions';

export default function Page() {
  const { room_name } = useParams();
  const query = useSearchParams();
  const [username, setUsername] = useState("");
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<CharacterName>("doux");
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const isMobile = useMobile();

  useEffect(() => {
    setAudioContext(new AudioContext());
    getCookie("username").then((cookie) => {
      setUsername(cookie || "");
    });
    return () => {
      setAudioContext((prev) => {
        prev?.close();
        return null;
      });
    };
  }, []);

  const humanRoomName = useMemo(() => {
    return decodeURI(room_name as string);
  }, [room_name]);

  const requestConnectionDetails = useCallback(
    async (username: string) => {
      const body: ConnectionDetailsBody = {
        room_name: room_name as string,
        username,
        character: selectedCharacter,
        randomIp: query.get('randomIp') || undefined,
      };
      const response = await fetch("/api/connection_details", {
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
    [room_name, selectedCharacter]
  );

  if (!audioContext) {
    return null;
  }

  // If we don't have any connection details yet, show the username form
  if (connectionDetails === null) {
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
                // TODO unify this kind of pattern across examples, either with the `useToken` hook or an equivalent
                const connectionDetails = await requestConnectionDetails(
                  username
                );
                setConnectionDetails(connectionDetails);
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

  // Show the room UI
  return (
    <div className={styles.container}>
      <LiveKitRoom
        token={connectionDetails.token}
        serverUrl={connectionDetails.ws_url}
        connect={true}
        connectOptions={{ autoSubscribe: false }}
        options={{ expWebAudioMix: { audioContext }, dynacast: false }}
        video={false}
        audio={true}
      >
        <RoomNavBar
          title={room_name as string}
          small
        />

        <WebAudioContext.Provider value={audioContext}>
          <div
            className="flex h-screen w-screen lk-room-wrapper"
          >
            <div
              className={`flex flex-col w-full h-full`}
            >
              <div className="grow flex">
                <div className="grow">
                  <GameView />
                </div>
              </div>
              <div className="bg-neutral">
                <BottomBar />
              </div>
            </div>
          </div>
        </WebAudioContext.Provider>
      </LiveKitRoom>
    </div>
  );
}
