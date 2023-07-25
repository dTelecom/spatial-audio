import Link from "next/link";
import React, {useState} from "react";
import styles from "./RoomNavBar.module.scss";
import {clsx} from "clsx";
import Logo from '../icons/logo.svg';
import {RoomEvent, Track} from "livekit-client";
import {useTracks} from "@livekit/components-react";
import ParticipantsIcon from "../icons/participants.svg";
import {Button} from "@/components/Button";
import TickIcon from "@/components/icons/tick.svg";
import ChainIcon from "@/components/icons/chain.svg";
import {useMobile} from "@/util/useMobile";

interface Props extends React.PropsWithChildren {
  title?: string;
  small?: boolean;
  showCounter?: boolean;
}

export function RoomNavBar({title, small}: Props) {
  const isMobile = useMobile();
  const tracks = useTracks(
    [
      {source: Track.Source.Camera, withPlaceholder: true},
      {source: Track.Source.ScreenShare, withPlaceholder: false}
    ],
    {updateOnlyOn: [RoomEvent.ActiveSpeakersChanged]}
  );
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    const url = `${window.location.origin}/room/${title}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className={clsx(styles.container, small && styles.small)}>
      <Link
        href="/"
        className={styles.link}
      >
        <Logo height={32} width={98}/>
      </Link>

      {title && !isMobile && (
        <h2>{decodeURI(title)}</h2>
      )}

      <div className={styles.counter}>
        {title && isMobile && (
          <h2>{decodeURI(title)}</h2>
        )}

        <div className={styles.counterContent}>
          <ParticipantsIcon/>
          {tracks.length}
        </div>

        <Button
          onClick={() => {
            void copy();
          }}
          className={clsx("lk-button", styles.copyButton, copied && styles.copied)}
          size={"sm"}
          variant={"default"}
        >
          {copied ? <TickIcon/> : <ChainIcon />}{copied ? "Copied" : "Copy invite link"}
        </Button>
      </div>
    </header>
  );
}
