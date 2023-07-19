import Link from "next/link";
import React from "react";
import styles from "./RoomNavBar.module.scss";
import {clsx} from "clsx";
import Logo from '../icons/logo.svg';
import {RoomEvent, Track} from "livekit-client";
import {useTracks} from "@livekit/components-react";
import ParticipantsIcon from "../icons/participants.svg";

interface Props extends React.PropsWithChildren {
  title?: string;
  small?: boolean;
  showCounter?: boolean;
}

export function RoomNavBar({title, small}: Props) {
  const tracks = useTracks(
    [
      {source: Track.Source.Camera, withPlaceholder: true},
      {source: Track.Source.ScreenShare, withPlaceholder: false}
    ],
    {updateOnlyOn: [RoomEvent.ActiveSpeakersChanged]}
  );

  return (
    <header className={clsx(styles.container, small && styles.small)}>
      <Link
        href="/"
        className={styles.link}
      >
        <Logo/>
      </Link>

      {title && (
        <h2>{title}</h2>
      )}

      <div className={styles.counter}>
        <div className={styles.counterContent}>
          <ParticipantsIcon/>
          {tracks.length}
        </div>
      </div>
    </header>
  );
}
