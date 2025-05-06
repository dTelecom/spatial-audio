import {MicrophoneMuteButton} from "./MicrophoneMuteButton";
import {MicrophoneSelector} from "./MicrophoneSelector";
import {PoweredBy} from "./PoweredBy";
import {useMobile} from "@/util/useMobile";
import { useRoomContext } from '@dtelecom/components-react';
import styles from './BottomBar.module.scss';

export function BottomBar() {
  const isMobile = useMobile();

  const roomCtx = useRoomContext();

  return (
    <div
      className="flex w-full h-full gap-2 p-4 items-center"
      style={{background: '#000'}}
    >
      <div className={`${isMobile ? 'w-full ' : ''}flex gap-2`}>
        <MicrophoneSelector/>

        <MicrophoneMuteButton/>

        <button onClick={() => {
          roomCtx.disconnect()
        }} className={styles.disconnectButton}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="none"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M2 2.75A2.75 2.75 0 0 1 4.75 0h6.5A2.75 2.75 0 0 1 14 2.75v10.5A2.75 2.75 0 0 1 11.25 16h-6.5A2.75 2.75 0 0 1 2 13.25v-.5a.75.75 0 0 1 1.5 0v.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V2.75c0-.69-.56-1.25-1.25-1.25h-6.5c-.69 0-1.25.56-1.25 1.25v.5a.75.75 0 0 1-1.5 0z"
              clipRule="evenodd"
            ></path>
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M8.78 7.47a.75.75 0 0 1 0 1.06l-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H1.75a.75.75 0 0 1 0-1.5h4.69l-.97-.97a.75.75 0 0 1 1.06-1.06z"
              clipRule="evenodd"
            ></path>
          </svg>
          </button>
      </div>

      <div
        style={{
          marginLeft: 'auto',
          paddingLeft: '20px'
        }}
      >
        <PoweredBy/>
      </div>
    </div>
  );
}
