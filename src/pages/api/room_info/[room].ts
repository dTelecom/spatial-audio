// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { RoomServiceClient } from "@dtelecom/server-sdk-js";

export type RoomInfo = {
  num_participants: number;
};

type ErrorResponse = {
  error: string;
};

type Query = {
  room: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RoomInfo | ErrorResponse>
) {
  if (req.method !== "GET") {
    return res.status(400).json({ error: "Invalid method" });
  }

  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;
  const { room } = req.query as Query;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: "Server misconfigured" });
  }

  // const livekitHost = wsUrl?.replace("wss://", "https://");
  // const roomService = new RoomServiceClient(livekitHost, apiKey, apiSecret);

  try {
    const participants = 0; // await roomService.listParticipants(room);
    return res.status(200).json({ num_participants: participants });
  } catch {
    return res.status(200).json({ num_participants: 0 });
  }
}
