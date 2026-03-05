import type { WebSocket } from "@fastify/websocket";
import type { WsRoomEvent } from "@proton/shared";

interface RoomMember {
  ws: WebSocket;
  userId: number;
  username: string;
}

class RoomManagerClass {
  private rooms: Map<string, Set<RoomMember>> = new Map();

  join(projectId: string, member: RoomMember): void {
    if (!this.rooms.has(projectId)) {
      this.rooms.set(projectId, new Set());
    }
    this.rooms.get(projectId)!.add(member);
  }

  leave(projectId: string, member: RoomMember): void {
    const room = this.rooms.get(projectId);
    if (!room) return;
    room.delete(member);
    if (room.size === 0) {
      this.rooms.delete(projectId);
    }
  }

  broadcast(projectId: string, event: WsRoomEvent, exclude?: RoomMember): void {
    const room = this.rooms.get(projectId);
    if (!room) return;
    const payload = JSON.stringify(event);
    for (const member of room) {
      if (member === exclude) continue;
      if (member.ws.readyState === member.ws.OPEN) {
        member.ws.send(payload);
      }
    }
  }

  getMembers(projectId: string): RoomMember[] {
    const room = this.rooms.get(projectId);
    if (!room) return [];
    return [...room];
  }
}

export const RoomManager = new RoomManagerClass();
