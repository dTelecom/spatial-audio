import { TrackToggle } from "@livekit/components-react";
import { Track } from "livekit-client";

export function MicrophoneMuteButton() {
  return (
    <div className="flex items-center gap-2">
      <TrackToggle
        source={Track.Source.Microphone}
        className="btn button-primary w-10 h-full p-0 m-0"
      />
      <TrackToggle
        source={Track.Source.Camera}
        className="btn button-primary w-10 h-full p-0 m-0"
      />
    </div>
  );
}
