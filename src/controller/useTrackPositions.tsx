import { Player } from "@/model/Player";
import { TrackReference } from "@dtelecom/components-core";
import { useTracks } from "@dtelecom/components-react";
import { RoomEvent, Track, } from "@dtelecom/livekit-client";
import { useMemo, useState } from "react";
import { TrackPosition } from "./SpatialAudioController";

type Props = {
  remotePlayers: Player[];
};

export const useTrackPositions = ({
  remotePlayers,
}: Props) => {
  const [sourceFilter] = useState([
    Track.Source.Camera,
    Track.Source.Microphone,
    Track.Source.Unknown,
    Track.Source.ScreenShare
  ]);
  const [sourceOptions] = useState({
    updateOnlyOn: [
      RoomEvent.TrackPublished,
      RoomEvent.TrackUnpublished,
      RoomEvent.ParticipantConnected,
      RoomEvent.Connected,
    ],
    onlySubscribed: false,
  });
  const trackParticipantPairs = useTracks(sourceFilter, sourceOptions);

  const trackPositions: TrackPosition[] = useMemo(() => {
    const microphoneTrackLookup = new Map<string, TrackReference>();

    // Memoize all of the remote microphone tracks
    trackParticipantPairs.forEach((tpp) => {
      microphoneTrackLookup.set(tpp.participant.identity, tpp);
    });

    const res = remotePlayers
      .filter((p) => microphoneTrackLookup.has(p.username))
      .map((p) => {
        return {
          trackPublication: microphoneTrackLookup.get(p.username)!.publication,
          participant: microphoneTrackLookup.get(p.username)!.participant,
          position: p.position,
        };
      });

    return res;
  }, [trackParticipantPairs, remotePlayers]);

  return trackPositions;
};
