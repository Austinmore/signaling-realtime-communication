import { Injectable } from '@nestjs/common';

@Injectable()
export class RoomService {
  private rooms: Map<string, Set<string>> = new Map();

  joinRoom(roomId: string, userId: string) {
    if (!this.rooms.has(roomId)) {
      this.rooms.set(roomId, new Set());
    }
    this.rooms.get(roomId).add(userId);
  }

  leaveRoom(roomId: string, userId: string) {
    if (this.rooms.has(roomId)) {
      this.rooms.get(roomId).delete(userId);
      if (this.rooms.get(roomId).size === 0) {
        this.rooms.delete(roomId);
      }
    }
  }

  getRoomUsers(roomId: string): string[] {
    return Array.from(this.rooms.get(roomId) || []);
  }

  handleDisconnect(clientId: string) {
    for (const [roomId, users] of this.rooms.entries()) {
      if (users.has(clientId)) {
        this.leaveRoom(roomId, clientId);
        break;
      }
    }
  }
}
