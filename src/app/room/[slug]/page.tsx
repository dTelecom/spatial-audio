"use client";

import { WebAudioContext } from "@/providers/audio/webAudio";
import { BottomBar } from "@/components/BottomBar";
import { LiveKitRoom } from "@dtelecom/components-react";
import React, { useEffect, useState } from "react";
import { GameView } from "@/components/GameView";
import styles from "./Page.module.scss";
import { RoomNavBar } from "@/components/RoomNavBar/RoomNavBar";
import { useParams, useRouter, useSearchParams } from "next/navigation";

const useRoomParams = () => {
  const params = useSearchParams();
  const router = useRouter();
  const p = useParams();
  const slug = p.slug as string || "";

  const token = params.get("token") || "";
  const wsUrl = params.get("wsUrl") || "";
  const roomName = params.get("roomName") || "";


  // store everything in state
  const [roomState,] = React.useState({
    token,
    wsUrl,
    roomName,
  });

  useEffect(() => {
    if (!roomState.wsUrl) {
      void router.push(`/join/${slug}`);
    }
  }, [router, slug, roomState.wsUrl]);

  return { ...roomState };
};
export default function Page() {
  const router = useRouter();
  const { slug } = useParams();
  const { token, wsUrl, roomName } = useRoomParams();

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, [router, slug]);

  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    setAudioContext(new AudioContext());
    return () => {
      setAudioContext((prev) => {
        prev?.close();
        return null;
      });
    };
  }, []);


  if (!audioContext) {
    return null;
  }

  return (
    <div className={styles.container}>
      <LiveKitRoom
        token={token}
        serverUrl={wsUrl}
        connect={true}
        connectOptions={{ autoSubscribe: false }}
        options={{ expWebAudioMix: { audioContext }, dynacast: false }}
        video={false}
        audio={true}
        activityModalEnabled
        onDisconnected={async () => {
          await audioContext?.close();
          router.push(`/`);
        }}
      >
        <RoomNavBar
          title={roomName}
          small
          slug={slug as string}
        />

        <WebAudioContext.Provider value={audioContext}>
          <div
            className="flex h-screen lk-room-wrapper"
            style={{
              width: "100%",
            }}
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
