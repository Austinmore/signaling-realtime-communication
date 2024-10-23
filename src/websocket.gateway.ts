import {
    WebSocketGateway,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
    OnGatewayConnection,
    OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Socket } from 'socket.io';
  import { Logger } from '@nestjs/common';
  import { RoomService } from './room.service';
  
  @WebSocketGateway({ cors: { origin: '*' } })
  export class WebSocketService implements OnGatewayConnection, OnGatewayDisconnect {
    private logger: Logger = new Logger('WebSocketService');
  
    constructor(private readonly roomService: RoomService) {}
  
    handleConnection(client: Socket) {
      this.logger.log(`Client connected: ${client.id}`);
    }
  
    handleDisconnect(client: Socket) {
      this.logger.log(`Client disconnected: ${client.id}`);
      this.roomService.handleDisconnect(client.id);
    }
  
    @SubscribeMessage('joinRoom')
    handleJoinRoom(@MessageBody() data: { roomId: string; userId: string }, @ConnectedSocket() client: Socket) {
      const { roomId, userId } = data;
      this.roomService.joinRoom(roomId, userId);
      client.join(roomId);
      client.to(roomId).emit('userJoined', { userId });
      this.logger.log(`User ${userId} joined room ${roomId}`);
    }
  
    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(@MessageBody() data: { roomId: string; userId: string }, @ConnectedSocket() client: Socket) {
      const { roomId, userId } = data;
      this.roomService.leaveRoom(roomId, userId);
      client.leave(roomId);
      client.to(roomId).emit('userLeft', { userId });
      this.logger.log(`User ${userId} left room ${roomId}`);
    }
  
    @SubscribeMessage('sendMessage')
    handleMessage(@MessageBody() data: { roomId: string; userId: string; message: string }, @ConnectedSocket() client: Socket) {
      const { roomId, userId, message } = data;
      client.to(roomId).emit('newMessage', { userId, message });
    }
  }
  