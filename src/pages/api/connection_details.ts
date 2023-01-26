// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import livekitServer, {
  AccessToken,
  RoomServiceClient,
} from "livekit-server-sdk";

export type ConnectionDetailsBody = {
  room_name: string;
  username: string;
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

  const { username, room_name: room } = req.body as ConnectionDetailsBody;
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const wsUrl = process.env.LIVEKIT_WS_URL;

  if (!apiKey || !apiSecret || !wsUrl) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  const livekitHost = wsUrl?.replace("wss://", "https://");

  const at = new AccessToken(apiKey, apiSecret, { identity: username });
  const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

  try {
    await roomService.getParticipant(room, username);
    return res.status(401).json({ error: "Username already exists in room" });
  } catch {
    // If participant doesn't exist, we can continue
  }

  at.addGrant({ room, roomJoin: true, canPublish: true, canSubscribe: true });
  res.status(200).json({ token: at.toJwt(), ws_url: wsUrl });
}
