// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import livekitServer, {
  AccessToken,
  RoomServiceClient,
} from "@dtelecom/server-sdk-js";
import { CharacterName } from "@/components/CharacterSelector";
import {generateUUID} from "@/util/generateUUID";

export type ConnectionDetailsBody = {
  room_name: string;
  username: string;
  character: CharacterName;
};

export type ConnectionDetails = {
  token: string;
  ws_url: string;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ConnectionDetails | ErrorResponse>
) {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Invalid method" });
  }

  const {
    username,
    room_name: room,
    character,
  } = req.body as ConnectionDetailsBody;
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "Server misconfigured 1" });
  }

  if (!username) return res.status(400).json({ error: "Missing username" });
  if (!character) return res.status(400).json({ error: "Missing character" });
  if (!room) return res.status(400).json({ error: "Missing room_name" });

  const token = new AccessToken(
    apiKey,
    apiSecret,
    { identity: generateUUID(), name: username }
  );

  const wsUrl = await token.getWsUrl();

  if (!wsUrl) {
    return res.status(500).json({ error: "Server misconfigured, ws url" });
  }

  const livekitHost = wsUrl?.replace("wss://", "https://");

  const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

  try {
    await roomService.getParticipant(room, username);
    return res.status(401).json({ error: "Username already exists in room" });
  } catch {
    // If participant doesn't exist, we can continue
  }

  token.addGrant({
    room: room,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
  });
  token.metadata = JSON.stringify({ character });
  res.status(200).json({ token: token.toJwt(), ws_url: wsUrl });
}
