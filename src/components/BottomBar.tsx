import {MicrophoneMuteButton} from "./MicrophoneMuteButton";
import {MicrophoneSelector} from "./MicrophoneSelector";
import {PoweredBy} from "./PoweredBy";
import {useMobile} from "@/util/useMobile";

export function BottomBar() {
  const isMobile = useMobile();

  return (
    <div
      className="flex w-full h-full gap-2 p-4 items-center"
      style={{background: '#000'}}
    >
      <div className={`${isMobile ? 'w-full ' : ''}flex gap-2`}>
        <MicrophoneSelector/>

        <MicrophoneMuteButton/>
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
