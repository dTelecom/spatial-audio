import { CharacterName } from "@/components/CharacterSelector";
import { AnimationState } from "./AnimationState";
import { Vector2 } from "./Vector2";

export type Player = {
  name: string;
  username: string;
  position: Vector2;
  animation: AnimationState;
  character: CharacterName;
};
