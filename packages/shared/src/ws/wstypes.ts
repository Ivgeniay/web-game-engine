export const WsEventName = {
  userJoined: "user.joined",
  userLeft: "user.left",
  fsFileCreated: "fs.file.created",
  fsFileDeleted: "fs.file.deleted",
  fsFileMoved: "fs.file.moved",
  fsFileRenamed: "fs.file.renamed",
  fsFileOverwritten: "fs.file.overwritten",
  fsDirCreated: "fs.dir.created",
  fsDirDeleted: "fs.dir.deleted",
  fsDirMoved: "fs.dir.moved",
  fsDirRenamed: "fs.dir.renamed",
} as const;

export type WsEventName = (typeof WsEventName)[keyof typeof WsEventName];

export type WsRoomEvent =
  | { type: typeof WsEventName.userJoined; userId: number; username: string }
  | { type: typeof WsEventName.userLeft; userId: number; username: string }
  | { type: typeof WsEventName.fsFileCreated; path: string }
  | { type: typeof WsEventName.fsFileDeleted; path: string }
  | { type: typeof WsEventName.fsFileMoved; fromPath: string; toPath: string }
  | { type: typeof WsEventName.fsFileRenamed; path: string; newName: string }
  | { type: typeof WsEventName.fsFileOverwritten; path: string }
  | { type: typeof WsEventName.fsDirCreated; path: string }
  | { type: typeof WsEventName.fsDirDeleted; path: string }
  | { type: typeof WsEventName.fsDirMoved; fromPath: string; toPath: string }
  | { type: typeof WsEventName.fsDirRenamed; path: string; newName: string };

export interface RoomMember {
  ws: WebSocket;
  userId: number;
  username: string;
}
