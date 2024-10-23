import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WebSocketDocController } from './websocket-doc.controller'; 

@Module({
  imports: [],
  controllers: [AppController, WebSocketDocController], 
  providers: [AppService],
})
export class AppModule {}
