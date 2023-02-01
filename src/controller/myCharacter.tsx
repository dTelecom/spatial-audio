import { useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";

const MAX_SPEED = 1;

export function useMyCharacter() {
  //const { setMyPosition } = usePosition();
  const [position, setPosition] = useState<{ x: number; y: number } | null>(
    null
  );
  const inputs = useRef({ x: 0, y: 0 });

  const keyDownListener = useRef((e: KeyboardEvent) => {
    if (e.key === "ArrowUp" || e.key === "w") {
      inputs.current.y = -1;
    } else if (e.key === "ArrowDown" || e.key === "s") {
      inputs.current.y = 1;
    }

    if (e.key === "ArrowLeft" || e.key === "a") {
      inputs.current.x = -1;
    } else if (e.key === "ArrowRight" || e.key === "d") {
      inputs.current.x = 1;
    }
  });

  const keyUpListener = useRef((e: KeyboardEvent) => {
    if ((e.key === "ArrowUp" || e.key === "w") && inputs.current.y === -1) {
      inputs.current.y = 0;
    } else if (
      (e.key === "ArrowDown" || e.key === "s") &&
      inputs.current.y === 1
    ) {
      inputs.current.y = 0;
    }

    if ((e.key === "ArrowLeft" || e.key === "a") && inputs.current.x === -1) {
      inputs.current.x = 0;
    } else if (
      (e.key === "ArrowRight" || e.key === "d") &&
      inputs.current.x === 1
    ) {
      inputs.current.x = 0;
    }
  });

  useEffect(() => {
    const kd = keyDownListener.current;
    const ku = keyUpListener.current;
    document.addEventListener("keydown", kd);
    document.addEventListener("keyup", ku);

    return () => {
      document.removeEventListener("keydown", kd);
      document.removeEventListener("keyup", ku);
    };
  }, []);

  useTick((delta) => {
    if (!position) {
      setPosition({ x: 0, y: 0 });
      return;
    }

    const magnitude = Math.sqrt(inputs.current.x ** 2 + inputs.current.y ** 2);
    if (magnitude === 0) {
      return;
    }
    const velocity = {
      x: (inputs.current.x * MAX_SPEED) / magnitude,
      y: (inputs.current.y * MAX_SPEED) / magnitude,
    };

    setPosition((prev) => ({
      x: prev!.x + velocity.x * delta,
      y: prev!.y + velocity.y * delta,
    }));
    //setMyPosition({ x: position.x, y: position.y });
  });

  return { position };
}