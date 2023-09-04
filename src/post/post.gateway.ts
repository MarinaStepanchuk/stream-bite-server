import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({
  namespace: 'feeds',
  cors: {
    origin: '*',
  },
  maxHttpBufferSize: 1e8,
})
export class PostGateway {
  constructor() {}
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('sendPost')
  async updatePostList(post) {
    this.server.emit('getPosts', post);
  }
}
