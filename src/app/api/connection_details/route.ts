// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { CharacterName } from "@/components/CharacterSelector";
import { generateUUID } from "@/util/generateUUID";
import { getClientIP } from '@/lib/getClientIp';
import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromHeaders } from "@/lib/dtel-auth/server";
import { formatUserId } from "@/lib/dtel-auth/helpers";

const { AccessToken } = require("@dtelecom/server-sdk-js");

export type ConnectionDetailsBody = {
  room_name: string;
  username: string;
  character: CharacterName;
  randomIp?: string;
};

export type ConnectionDetails = {
  token: string;
  ws_url: string;
};

type ErrorResponse = {
  error: string;
};

export async function POST(
  req: NextRequest
) {
  const body = await req.json();
  const {
    username,
    room_name: room,
    character,
    randomIp,
  } = body as ConnectionDetailsBody;
  const apiKey = process.env.API_KEY;
  const apiSecret = process.env.API_SECRET;

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ error: "Server misconfigured 1" }, { status: 500 });
  }


  if (!username) return NextResponse.json({ error: "Missing username" }, { status: 400 });
  if (!character) return NextResponse.json({ error: "Missing character" }, { status: 400 });
  if (!room) return NextResponse.json({ error: "Missing room_name" }, { status: 400 });

  const userId = await getUserIdFromHeaders(req);
  const formattedUserId = formatUserId(userId);

  const identity = formattedUserId || generateUUID();

  const token = new AccessToken(
    apiKey,
    apiSecret,
    { identity, name: username }
  );

  const clientIp = randomIp !== undefined ? undefined : getClientIP(req) || undefined;

  const wsUrl = await token.getWsUrl(clientIp);


  if (!wsUrl) {
    return NextResponse.json({ error: "Server misconfigured, ws url" }, { status: 500 });
  }

  token.addGrant({
    room: room,
    roomJoin: true,
    canPublish: true,
    canPublishData: true,
  });
  token.metadata = JSON.stringify({ character });
  token.webHookURL = userId && process.env.NEXT_PUBLIC_POINTS_BACKEND_URL
    ? `https://${process.env.NEXT_PUBLIC_POINTS_BACKEND_URL}/api/webhook`
    : undefined;
  return NextResponse.json({ token: token.toJwt(), ws_url: wsUrl }, { status: 200 });
}
