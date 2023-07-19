import * as React from 'react';
import {useMemo} from 'react';
import type {Participant, TrackPublication} from 'livekit-client';
import {Track} from 'livekit-client';
import type {ParticipantClickEvent, TrackReferenceOrPlaceholder} from '@livekit/components-core';
import {isParticipantSourcePinned, setupParticipantTile} from '@livekit/components-core';
import {
  AudioTrack,
  FocusToggle,
  ParticipantContext,
  ParticipantName,
  useEnsureParticipant,
  useIsMuted,
  useIsSpeaking,
  useMaybeLayoutContext,
  useMaybeParticipantContext,
  useMaybeTrackContext,
  useSpeakingParticipants,
  VideoTrack
} from "@livekit/components-react";
import {mergeProps} from "./utils";
import {Vector2} from "@/model/Vector2";
import {TrackPosition} from "@/controller/SpatialAudioController";
import {Text} from "@pixi/react";
import {TextStyle} from "pixi.js";
import ParticipantPlaceholder from "./ParticipantPlaceholder";

type SpatialAudioControllerProps = {
  trackPositions: TrackPosition[];
  myPosition?: Vector2;
  maxHearableDistance: number;
};

/** @public */
export type ParticipantTileProps = React.HTMLAttributes<HTMLDivElement> & SpatialAudioControllerProps & {
  disableSpeakingIndicator?: boolean;
  participant?: Participant;
  source?: Track.Source;
  publication?: TrackPublication;
  onParticipantClick?: (event: ParticipantClickEvent) => void;
};

/** @public */
export type UseParticipantTileProps<T extends HTMLElement> = TrackReferenceOrPlaceholder & {
  disableSpeakingIndicator?: boolean;
  publication?: TrackPublication;
  onParticipantClick?: (event: ParticipantClickEvent) => void;
  htmlProps: React.HTMLAttributes<T>;
};

/** @public */
export function useParticipantTile<T extends HTMLElement>({
                                                            participant,
                                                            source,
                                                            publication,
                                                            onParticipantClick,
                                                            disableSpeakingIndicator,
                                                            htmlProps,
                                                          }: UseParticipantTileProps<T>) {
  const p = useEnsureParticipant(participant);
  const mergedProps = React.useMemo(() => {
    const {className} = setupParticipantTile();
    return mergeProps(htmlProps, {
      className,
      onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // @ts-ignore
        htmlProps.onClick?.(event);
        if (typeof onParticipantClick === 'function') {
          const track = publication ?? p.getTrack(source);
          onParticipantClick({participant: p, track});
        }
      },
    });
  }, [htmlProps, source, onParticipantClick, p, publication]);
  const isVideoMuted = useIsMuted(Track.Source.Camera, {participant});
  const isAudioMuted = useIsMuted(Track.Source.Microphone, {participant});
  const isSpeaking = useIsSpeaking(participant);
  return {
    elementProps: {
      'data-lk-audio-muted': isAudioMuted,
      'data-lk-video-muted': isVideoMuted,
      'data-lk-speaking': disableSpeakingIndicator === true ? false : isSpeaking,
      'data-lk-local-participant': participant.isLocal,
      'data-lk-source': source,
      ...mergedProps,
    } as React.HTMLAttributes<HTMLDivElement>,
  };
}

/** @public */
export function ParticipantContextIfNeeded(
  props: React.PropsWithChildren<{
    participant?: Participant;
  }>,
) {
  const hasContext = !!useMaybeParticipantContext();
  return props.participant && !hasContext ? (
    <ParticipantContext.Provider value={props.participant}>
      {props.children}
    </ParticipantContext.Provider>
  ) : (
    <>{props.children}</>
  );
}

/**
 * The ParticipantTile component is the base utility wrapper for displaying a visual representation of a participant.
 * This component can be used as a child of the `TrackLoop` component or by spreading a track reference as properties.
 *
 * @example
 * ```tsx
 * <ParticipantTile source={Track.Source.Camera} />
 *
 * <ParticipantTile {...trackReference} />
 * ```
 * @public
 */
export const ParticipantTile = ({
                                  participant,
                                  children,
                                  source = Track.Source.Camera,
                                  onParticipantClick,
                                  publication,
                                  disableSpeakingIndicator,
                                  myPosition,
                                  trackPositions,
                                  maxHearableDistance,
                                  ...htmlProps
                                }: ParticipantTileProps) => {
  const p = useEnsureParticipant(participant);
  const trackRef: TrackReferenceOrPlaceholder = useMaybeTrackContext() ?? {
    participant: p,
    source,
    publication,
  };

  const {elementProps} = useParticipantTile<HTMLDivElement>({
    participant: trackRef.participant,
    htmlProps,
    source: trackRef.source,
    publication: trackRef.publication,
    disableSpeakingIndicator,
    onParticipantClick,
  });

  const layoutContext = useMaybeLayoutContext();

  const handleSubscribe = React.useCallback(
    (subscribed: boolean) => {
      if (
        trackRef.source &&
        !subscribed &&
        layoutContext &&
        layoutContext.pin.dispatch &&
        isParticipantSourcePinned(trackRef.participant, trackRef.source, layoutContext.pin.state)
      ) {
        layoutContext.pin.dispatch({msg: 'clear_pin'});
      }
    },
    [trackRef.participant, layoutContext, trackRef.source],
  );

  const speakingParticipants = useSpeakingParticipants();
  const speakingLookup = useMemo(() => {
    const lookup = new Set<string>();
    for (const p of speakingParticipants) {
      lookup.add(p.identity);
    }
    return lookup;
  }, [speakingParticipants]);

  const position = useMemo(() => {
    // @ts-ignore
    return trackPositions.find(tp => tp.participant?.identity === trackRef.participant?.identity)?.position;
  }, [trackPositions, trackRef.participant?.identity]);

  const distance = useMemo(() => {
    if (!myPosition || !position) return maxHearableDistance + 1;

    const dx = myPosition.x - position.x;
    const dy = myPosition.y - position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }, [maxHearableDistance, myPosition, position]);

  const hearable = useMemo(
    () => distance <= maxHearableDistance,
    [distance, maxHearableDistance]
  );

  const speaking = useMemo(() => speakingLookup.has(p.identity), [p.identity, speakingLookup]);

  if (!hearable && !trackRef.participant.isLocal) return null;

  return (
    <div style={{position: 'relative', borderColor: speaking ? '#59E970' : undefined}} {...elementProps}>
      <ParticipantContextIfNeeded participant={trackRef.participant}>
        {children ?? (
          <>
            {trackRef.publication?.kind === 'video' ||
            trackRef.source === Track.Source.Camera ||
            trackRef.source === Track.Source.ScreenShare ? (
              <VideoTrack
                participant={trackRef.participant}
                source={trackRef.source}
                publication={trackRef.publication}
                onSubscriptionStatusChanged={handleSubscribe}
              />
            ) : (
              <AudioTrack
                participant={trackRef.participant}
                source={trackRef.source}
                publication={trackRef.publication}
                onSubscriptionStatusChanged={handleSubscribe}
              />
            )}
            <div className="lk-participant-placeholder">
              <ParticipantPlaceholder />
            </div>
            <div className="lk-participant-metadata">
              <div className="lk-participant-metadata-item">
                {trackRef.source === Track.Source.Camera && (
                  <>
                    <ParticipantName className={'font-mono'}/>
                  </>
                )}
              </div>
            </div>
          </>
        )}
        <FocusToggle trackSource={trackRef.source}/>
      </ParticipantContextIfNeeded>
    </div>
  );
};
