import {useMediaDeviceSelect, useRoomContext,} from "@dtelecom/components-react";
import ChevronIcon from './icons/chevron.svg';

export function MicrophoneSelector() {
  // TODO remove roomContext, this is only needed because of a bug in `useMediaDeviceSelect`
  const roomContext = useRoomContext();
  const {devices, activeDeviceId, setActiveMediaDevice} =
    useMediaDeviceSelect({kind: "audioinput", room: roomContext});

  return (
    <div className="overflow-hidden w-full" style={{borderRadius: '5px'}}>
      <div
        className="flex items-center relative"
        style={{background: '#212121'}}
      >
        <select
          id={'select'}
          onChange={(e) => {
            setActiveMediaDevice(e.currentTarget.value);
          }}
          value={activeDeviceId}
          className="select select-sm w-full sm:max-w-[200px] max-w-[100px] m-2 select-none"
          style={{zIndex: 2}}
        >
          <option
            value={-1}
            disabled
          >
            Choose your microphone
          </option>
          {devices.map((m) => (
            <option
              value={m.deviceId}
              key={m.deviceId}
            >
              {m.label}
            </option>
          ))}
        </select>
        <div
          style={{position: 'absolute', right: 0, cursor: 'pointer'}}
        >
          <ChevronIcon/>
        </div>
      </div>
    </div>
  );
}
