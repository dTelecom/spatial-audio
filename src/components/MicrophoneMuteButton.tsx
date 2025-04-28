import { TrackToggle } from "@dtelecom/components-react";
import { Track } from "@dtelecom/livekit-client";
import styles from "./MicrophoneMuteButton.module.scss";
import { clsx } from 'clsx';
export function MicrophoneMuteButton() {
  return (
    <div className="flex items-center gap-2">
      <TrackToggle
        source={Track.Source.Microphone}
        className={clsx(styles.muteButton, "btn button-primary w-10 h-full p-0 m-0")}
      />
      <TrackToggle
        source={Track.Source.Camera}
        className={clsx(styles.muteButton, "btn button-primary w-10 h-full p-0 m-0")}
      />
    </div>
  );
}
