import {MicrophoneMuteButton} from "./MicrophoneMuteButton";
import {MicrophoneSelector} from "./MicrophoneSelector";
import {PoweredBy} from "./PoweredBy";

export function BottomBar() {
  return (
    <div className="flex w-full h-full justify-between" style={{background: '#000'}}>
      <div className="flex h-full">
        <MicrophoneMuteButton/>
        <div className="">
          <MicrophoneSelector/>
        </div>
      </div>
      <div className="pr-2 flex">
        <PoweredBy/>
      </div>
    </div>
  );
}
