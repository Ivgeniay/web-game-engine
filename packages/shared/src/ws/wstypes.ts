export type WsRoomEvent =
  | { type: "user.joined"; userId: number; username: string }
  | { type: "user.left"; userId: number; username: string };

export interface RoomMember {
  ws: WebSocket;
  userId: number;
  username: string;
}
