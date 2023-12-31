// adapted context bridge from https://pixijs.io/pixi-react/context-bridge/ for providing LiveKit room context to pixi components
import {Stage as PixiStage} from "@pixi/react";
import {RoomContext} from "@dtelecom/components-react";

interface ContextBridgeProps extends React.PropsWithChildren {
  render: (tree: React.ReactElement) => React.ReactNode;
}

// the context bridge:
const ContextBridge = ({children, render}: ContextBridgeProps) => {
  return (
    <RoomContext.Consumer>
      {(roomValue) => (
        render(
          <RoomContext.Provider value={roomValue}>
            {children}
          </RoomContext.Provider>
        )
      )}
    </RoomContext.Consumer>
  );
};

// custom pixi stage with livekit room context
export const Stage = ({children, ...props}: PixiStage["props"]) => {
  return (
    <ContextBridge
      render={(children) => <PixiStage {...props}>{children}</PixiStage>}
    >
      {children}
    </ContextBridge>
  );
};
