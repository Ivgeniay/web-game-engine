import type { WsRoomEvent } from "@proton/shared";

type WsEventHandler = (event: WsRoomEvent) => void;

class WsServiceClass {
  private ws: WebSocket | null = null;
  private handlers: Set<WsEventHandler> = new Set();
  private projectId: string | null = null;

  connect(projectId: string, token: string): void {
    if (this.ws) this.disconnect();

    const apiUrl = import.meta.env.VITE_API_URL as string;
    const wsUrl = apiUrl.replace(/^http/, "ws");

    this.projectId = projectId;
    const ws = new WebSocket(
      `${wsUrl}/projects/${projectId}/ws?token=${token}`,
    );
    this.ws = ws;

    this.ws.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data as string) as WsRoomEvent;
        for (const handler of this.handlers) {
          handler(event);
        }
      } catch {
        // ignore malformed messages
      }
    };

    this.ws.onclose = () => {
      if (this.ws === ws) {
        this.ws = null;
        this.projectId = null;
      }
    };
  }

  disconnect(): void {
    console.log("disconnect called, ws:", this.ws?.readyState);
    if (!this.ws) return;
    this.ws.close();
    console.log("ws.close() called, readyState:", this.ws.readyState);
    this.ws = null;
    this.projectId = null;
  }

  on(handler: WsEventHandler): () => void {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN;
  }

  getProjectId(): string | null {
    return this.projectId;
  }
}

export const WsService = new WsServiceClass();
