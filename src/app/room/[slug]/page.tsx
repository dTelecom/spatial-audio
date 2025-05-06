"use client";

import { WebAudioContext } from "@/providers/audio/webAudio";
import { BottomBar } from "@/components/BottomBar";
import { LiveKitRoom } from "@dtelecom/components-react";
import React, { useEffect, useMemo, useState } from "react";
import { GameView } from "@/components/GameView";
import styles from "./Page.module.scss";
import { RoomNavBar } from "@/components/RoomNavBar/RoomNavBar";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { isMobileBrowser } from '@dtelecom/components-core';

const useRoomParams = () => {
  const params = useSearchParams();

  const token = params.get("token") || "";
  const wsUrl = params.get("wsUrl") || "";
  const roomName = params.get("roomName") || "";
  const isAdmin = params.get("isAdmin") === "true";

  // store everything in state
  const [roomState,] = React.useState({
    token,
    wsUrl,
    roomName,
    isAdmin,
  });

  return { ...roomState };
};
export default function Page() {
  const isMobile = useMemo(() => isMobileBrowser(), []);
  const router = useRouter();
  const { slug } = useParams();
  const { token, wsUrl, roomName,isAdmin } = useRoomParams();
  const startTime = React.useRef(Date.now());

  useEffect(() => {
    window.history.replaceState(null, '', window.location.pathname);
  }, [router, slug]);

  useEffect(() => {
    if (!wsUrl) {
      void router.push(`/join/${slug}?roomName=${roomName}`);
    }
  }, [router, slug, wsUrl]);

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

  const onDisconnected = async () => {
    await audioContext?.close();

    if (process.env.NEXT_PUBLIC_POINTS_BACKEND_URL) {
      const time = Math.floor((Date.now() - startTime.current) / 1000);
      void router.push("/summary?roomName=" + roomName + "&timeSec=" + time + "&isAdmin=" + isAdmin + "&slug=" + slug);
    } else {
      void router.push("/");
    }
  };


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
        onDisconnected={onDisconnected}
      >
        <RoomNavBar
          token={token}
          roomName={roomName}
          slug={slug as string}
          iconFull={!isMobile}
          isAdmin={isAdmin}
        />

        <WebAudioContext.Provider value={audioContext}>
          <div
            className="flex lk-room-wrapper"
            style={{
              width: "100%",
              height: "100%",
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
