"use client";

import { MicrophoneProvider } from "@/audio/microphone";
import { PlaybackProvider } from "@/audio/playback";
import { WebAudioProvider } from "@/audio/webAudio";
import { BottomBar } from "@/components/BottomBar";
import { GameView } from "@/components/GameView";
import { ParticipantList } from "@/components/ParticipantList";
import { RoomInfo } from "@/components/RoomInfo";
import { UsernameInput } from "@/components/UsernameInput";
import {
  ConnectionDetails,
  ConnectionDetailsBody,
} from "@/pages/api/connection_details";
import { LiveKitRoom } from "@livekit/components-react";
import dynamic from "next/dynamic";
import { useCallback, useMemo, useState } from "react";

type Props = {
  params: { room_name: string };
};

export default function Page({ params: { room_name } }: Props) {
  const [connectionDetails, setConnectionDetails] =
    useState<ConnectionDetails | null>(null);

  const humanRoomName = useMemo(() => {
    return decodeURI(room_name);
  }, [room_name]);

  const requestConnectionDetails = useCallback(
    async (username: string) => {
      const body: ConnectionDetailsBody = { room_name, username };
      try {
        const response = await fetch("/api/connection_details", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        return response.json();
      } catch (e) {
        console.log("NEIL error", e);
      }
    },
    [room_name]
  );

  // If we don't have any connection details yet, show the username form
  if (connectionDetails === null) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        <h2 className="text-4xl mb-4">{humanRoomName}</h2>
        <RoomInfo roomName={room_name} />
        <div className="divider"></div>
        <UsernameInput
          submitText="Join Room"
          onSubmit={async (username) => {
            const connectionDetails = await requestConnectionDetails(username);
            setConnectionDetails(connectionDetails);
          }}
        />
      </div>
    );
  }

  // Show the room UI
  return (
    <div>
      <LiveKitRoom
        token={connectionDetails.token}
        serverUrl={connectionDetails.ws_url}
        connect={true}
        connectOptions={{ autoSubscribe: false }}
      >
        <WebAudioProvider>
          <PlaybackProvider>
            <MicrophoneProvider>
              <div className="flex h-screen w-screen">
                <div className="flex flex-col w-full h-full">
                  <div className="grow flex">
                    <div className="grow">
                      <GameView />
                    </div>
                    <div className="w-1/5">
                      <ParticipantList />
                    </div>
                  </div>
                  <div className="bg-neutral">
                    <BottomBar />
                  </div>
                </div>
              </div>
            </MicrophoneProvider>
          </PlaybackProvider>
        </WebAudioProvider>
      </LiveKitRoom>
    </div>
  );
}
