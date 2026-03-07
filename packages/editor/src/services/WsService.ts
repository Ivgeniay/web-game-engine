import type { WsRoomEvent } from "@proton/shared";
import { WsEventName } from "@proton/shared";

type WsEventMap = {
  [K in WsRoomEvent["type"]]: Extract<WsRoomEvent, { type: K }>;
};

type WsEventHandler<K extends keyof WsEventMap> = (
  event: WsEventMap[K],
) => void;

class WsServiceClass {
  private ws: WebSocket | null = null;
  private projectId: string | null = null;
  private handlers: Map<string, Set<WsEventHandler<any>>> = new Map();

  connect(projectId: string, token: string): void {
    if (this.ws) this.disconnect();

    const apiUrl = import.meta.env.VITE_API_URL as string;
    const wsUrl = apiUrl.replace(/^http/, "ws");

    this.projectId = projectId;
    const ws = new WebSocket(
      `${wsUrl}/projects/${projectId}/ws?token=${token}`,
    );
    this.ws = ws;

    ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data as string) as WsRoomEvent;
        const handlers = this.handlers.get(event.type);
        if (!handlers) return;
        for (const handler of handlers) {
          handler(event);
        }
      } catch {
        // ignore malformed messages
      }
    };

    ws.onclose = () => {
      if (this.ws === ws) {
        this.ws = null;
        this.projectId = null;
      }
    };
  }

  disconnect(): void {
    if (!this.ws) return;
    this.ws.close();
    this.ws = null;
    this.projectId = null;
  }

  on<K extends keyof WsEventMap>(
    type: K,
    handler: WsEventHandler<K>,
  ): () => void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set());
    }
    this.handlers.get(type)!.add(handler);
    return () => this.handlers.get(type)?.delete(handler);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getProjectId(): string | null {
    return this.projectId;
  }
}

export const WsService = new WsServiceClass();
