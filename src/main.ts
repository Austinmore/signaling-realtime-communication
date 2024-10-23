import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ExpressPeerServer } from 'peer';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as express from 'express';
import * as http from 'http';
import rateLimit from 'express-rate-limit';

async function bootstrap() {
  // Create the Express app
  const expressApp = express();

  // Create a separate HTTP server for PeerJS
  const peerHttpServer = http.createServer(expressApp);

  // Initialize the NestJS application
  const app = await NestFactory.create(AppModule);

  // Enable CORS with restricted settings for production
  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  // Apply rate limiting to prevent abuse
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
    }),
  );

  // Use WebSocket Adapter for NestJS
  app.useWebSocketAdapter(new IoAdapter(app));

  // Set up Swagger for API documentation
  const config = new DocumentBuilder()
    .setTitle('Signaling and Real-Time Communication API')
    .setDescription('API documentation for the signaling and real-time communication service')
    .setVersion('1.0')
    .addTag('Signaling')
    .addTag('WebSocket')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Set up PeerJS server
  const peerServer = ExpressPeerServer(peerHttpServer, {
    path: '/peerjs',
  });
  expressApp.use('/peerjs', peerServer);

  // Start the NestJS app server
  await app.listen(4000);
  console.log(`API and WebSocket server running on: ${await app.getUrl()}`);
  console.log(`Swagger documentation is available at: ${await app.getUrl()}/api`);

  // Start the PeerJS server
  peerHttpServer.listen(9000, () => {
    console.log('PeerJS server is running on: http://localhost:9000/peerjs');
  });
}

bootstrap();
