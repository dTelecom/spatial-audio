import {NetcodeController} from "@/controller/NetcodeController";
import {
  TrackLoop,
  useConnectionState,
  useIsSpeaking,
  useLocalParticipant,
  useParticipantInfo,
  useSpeakingParticipants,
  useTracks,
} from "@livekit/components-react";
import {Container} from "@pixi/react";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import useResizeObserver from "use-resize-observer";
import {Character} from "./Character";
import {InputController} from "@/controller/InputController";
import {useGameState} from "@/model/GameState";
import {MyCharacterController} from "@/controller/MyCharacterController";
import {MyPlayerSpawnController} from "@/controller/MyPlayerSpawnController";
import {ConnectionState, RoomEvent, Track} from "livekit-client";
import {SpatialAudioController} from "@/controller/SpatialAudioController";
import {RemotePlayersController} from "@/controller/RemotePlayersController";
import {WorldBoundaryController} from "@/controller/WorldBoundaryController";
import {World} from "./World";
import {Camera} from "./Camera";
import {EarshotRadius} from "./EarshotRadius";
import {AnimationsProvider} from "@/providers/animations";
import {Shadows} from "./Shadows";
import {DPad} from "./DPad";
import {Inputs} from "@/model/Inputs";
import {useMobile} from "@/util/useMobile";
import {useTrackPositions} from "@/controller/useTrackPositions";
import {ParticipantTile} from "@/components/ParticipantTile/ParticipantTile";
import {Stage} from "@/components/Stage";
import ArrowLeftIcon from "@/components/icons/arrowLeft.svg";
import ArrowRightIcon from "@/components/icons/arrowRight.svg";

export function GameView() {
  const {ref, width = 1, height = 1} = useResizeObserver<HTMLDivElement>();
  const mobile = useMobile();
  const connectionState = useConnectionState();
  const {localParticipant} = useLocalParticipant();
  const {metadata: localMetadata} = useParticipantInfo({
    participant: localParticipant,
  });
  const localSpeaking = useIsSpeaking(localParticipant);
  const speakingParticipants = useSpeakingParticipants();

  const tracks = useTracks(
    [
      {source: Track.Source.Camera, withPlaceholder: true},
      {source: Track.Source.ScreenShare, withPlaceholder: false}
    ],
    {
      updateOnlyOn: [
        RoomEvent.TrackPublished,
        RoomEvent.TrackUnpublished,
        RoomEvent.ParticipantConnected,
        RoomEvent.Connected,
      ],
    }
  );

  const videoContainerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);

  const {
    inputs,
    remotePlayers,
    myPlayer,
    networkAnimations,
    networkPositions,
    worldBoundaries,
    earshotRadius,
    backgroundZIndex,
    playerSpeed,
    setMyPlayer,
    setInputs,
    setNetworkAnimations,
    setNetworkPositions,
    setRemotePlayers,
  } = useGameState();

  const [mobileInputs, setMobileInputs] = useState<Inputs>({
    direction: {x: 0, y: 0},
  });

  const speakingLookup = useMemo(() => {
    const lookup = new Set<string>();
    for (const p of speakingParticipants) {
      lookup.add(p.identity);
    }
    return lookup;
  }, [speakingParticipants]);

  useEffect(() => {
    if (localParticipant) {
      setMyPlayer((prev) => prev && {...prev, character: "targ"});
    }
  }, [localParticipant, setMyPlayer]);

  const localCharacter = useMemo(
    () => JSON.parse(localMetadata || "{}").character || null,
    [localMetadata]
  );

  const onMobileInput = useCallback((x: number, y: number) => {
    setMobileInputs({direction: {x, y: -y}});
  }, []);

  const trackPositions = useTrackPositions({remotePlayers});

  useEffect(() => {
    const element = videoContainerRef.current;
    if (element) {
      if (element.offsetHeight < element.scrollHeight ||
        element.offsetWidth < element.scrollWidth) {
        setShowArrows(true);
      } else {
        setShowArrows(false);
      }
    }
  }, [tracks]);

  if (connectionState !== ConnectionState.Connected) {
    return null;
  }

  return (
    <div
      ref={ref}
      className="relative h-full w-full bg-red-400"
    >
      {myPlayer && (
        <SpatialAudioController
          myPosition={myPlayer.position}
          trackPositions={trackPositions}
          maxHearableDistance={earshotRadius}
        />
      )}
      {myPlayer && (
        <NetcodeController
          setNetworkAnimations={setNetworkAnimations}
          setNetworkPositions={setNetworkPositions}
          myPlayer={myPlayer}
        />
      )}
      <RemotePlayersController
        networkAnimations={networkAnimations}
        networkPositions={networkPositions}
        setRemotePlayers={setRemotePlayers}
      />
      <InputController
        mobileInputs={mobileInputs}
        setInputs={setInputs}
      />
      <MyPlayerSpawnController
        localCharacter={localCharacter}
        myPlayer={myPlayer}
        setMyPlayer={setMyPlayer}
        localParticipant={localParticipant}
      />

      {mobile && (
        <div className="absolute bottom-20 left-5 w-[120px] h-[120px] z-10">
          <DPad onInput={onMobileInput}/>
        </div>
      )}

      {showArrows && !mobile && (
        <div
          style={{
            position: 'absolute',
            left: 24,
            cursor: 'pointer',
            zIndex: 1,
            top: 124,
          }}
          onClick={() => {
            videoContainerRef.current?.scrollBy({left: -112, behavior: 'smooth'});
          }}
        >
          <ArrowLeftIcon/>
        </div>
      )}
      <div
        ref={videoContainerRef}
        className={'lk-tracks-row'}
        style={{
          left: mobile ? 0 : 76,
          right: mobile ? 0 : 76,
          margin: mobile ? '0' : '0',
          padding: mobile ? '0 12px' : '0',
          justifyContent: showArrows ? 'initial' : 'center',
        }}

      >
        <TrackLoop tracks={tracks}>
          <ParticipantTile
            myPosition={myPlayer?.position}
            trackPositions={trackPositions}
            maxHearableDistance={earshotRadius}
          />
        </TrackLoop>

      </div>
      {showArrows && !mobile && (
        <div
          style={{
            position: 'absolute',
            right: 24,
            cursor: 'pointer',
            zIndex: 1,
            top: 124,
          }}
          onClick={() => {
            videoContainerRef.current?.scrollBy({left: 112, behavior: 'smooth'});
          }}
        >
          <ArrowRightIcon/>
        </div>
      )}
      <Stage
        className="absolute top-0 left-0 bottom-0 right-0"
        raf={true}
        renderOnComponentChange={false}
        width={width}
        height={height}
        options={{resolution: 2, backgroundColor: 0x509b66}}
      >
        <AnimationsProvider>
          <Camera targetPosition={myPlayer?.position || {x: 0, y: 0}}>
            {/* @ts-ignore */}
            <Container
              anchor={[0.5, 0.5]}
              sortableChildren={true}
            >
              <MyCharacterController
                playerSpeed={playerSpeed}
                inputs={inputs}
                setMyPlayer={setMyPlayer}
              />
              {myPlayer && (
                <WorldBoundaryController
                  worldBoundaries={worldBoundaries}
                  myPlayer={myPlayer}
                  setMyPlayer={setMyPlayer}
                />
              )}
              {myPlayer && (
                <Character
                  speaking={localSpeaking}
                  name={myPlayer.name}
                  username={myPlayer.username}
                  x={myPlayer.position.x}
                  y={myPlayer.position.y}
                  character={myPlayer.character}
                  animation={myPlayer.animation}
                />
              )}

              <World
                backgroundZIndex={backgroundZIndex}
                worldBoundaries={worldBoundaries}
              />
              <Shadows
                backgroundZIndex={backgroundZIndex}
                myPlayer={myPlayer}
                remotePlayers={remotePlayers}
              />
              {remotePlayers.map((player) => (
                <Character
                  speaking={speakingLookup.has(player.username)}
                  name={player.name}
                  username={player.username}
                  key={player.username}
                  x={player.position.x}
                  y={player.position.y}
                  character={player.character}
                  animation={player.animation}
                />
              ))}
              <EarshotRadius
                backgroundZIndex={backgroundZIndex}
                render={true}
                earshotRadius={earshotRadius}
                myPlayerPosition={myPlayer?.position || {x: 0, y: 0}}
              />
            </Container>
          </Camera>
        </AnimationsProvider>
      </Stage>
    </div>
  );
}
