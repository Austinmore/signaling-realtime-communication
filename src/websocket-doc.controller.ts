import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('WebSocket')
@Controller('websocket-doc')
export class WebSocketDocController {
  
  @ApiOperation({ summary: 'WebSocket event for joining a room' })
  @Get('join-room')
  joinRoomDoc() {
    return {
      event: 'joinRoom',
      description: 'Allows a user to join a specific room by specifying the roomId and userId.',
      payload: {
        roomId: 'string',
        userId: 'string',
      },
    };
  }

  @ApiOperation({ summary: 'WebSocket event for leaving a room' })
  @Get('leave-room')
  leaveRoomDoc() {
    return {
      event: 'leaveRoom',
      description: 'Allows a user to leave a specific room by specifying the roomId and userId.',
      payload: {
        roomId: 'string',
        userId: 'string',
      },
    };
  }

  @ApiOperation({ summary: 'WebSocket event for sending a message' })
  @Get('send-message')
  sendMessageDoc() {
    return {
      event: 'sendMessage',
      description: 'Allows a user to send a message to a room.',
      payload: {
        roomId: 'string',
        userId: 'string',
        message: 'string',
      },
    };
  }

  @ApiOperation({ summary: 'WebSocket event for toggling audio' })
  @Get('toggle-audio')
  toggleAudioDoc() {
    return {
      event: 'toggleAudio',
      description: 'Toggles the audio state for a user in a room.',
      payload: {
        roomId: 'string',
        userId: 'string',
        isMuted: 'boolean',
      },
    };
  }

  @ApiOperation({ summary: 'WebSocket event for toggling video' })
  @Get('toggle-video')
  toggleVideoDoc() {
    return {
      event: 'toggleVideo',
      description: 'Toggles the video state for a user in a room.',
      payload: {
        roomId: 'string',
        userId: 'string',
        isVideoOff: 'boolean',
      },
    };
  }
}
