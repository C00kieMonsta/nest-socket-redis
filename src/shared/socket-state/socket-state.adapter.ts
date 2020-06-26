import { INestApplicationContext, WebSocketAdapter, INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';

import { SocketStateService } from './socket-state.service';

export interface AuthenticatedSocket extends socketio.Socket {
  auth: any;
}

export class SocketStateAdapter extends IoAdapter implements WebSocketAdapter {
  public constructor(
    private readonly socketStateService: SocketStateService,
  ) {
    super();
  }

  private server: socketio.Server;

  /**
   * Create an instance of a WebSocket server with port and additional configurations
   * @param port port number of WebSocket server
   * @param options additional options to cinfigure the instance
   */
  public create(port: number, options: socketio.ServerOptions = {}): socketio.Server {
    this.server = super.createIOServer(port, options);

    // set up of a middleware for authentication
    this.server.use(async (socket: AuthenticatedSocket, next) => {
      const token = socket.handshake.query?.token || socket.handshake.headers?.authorization;

      if (!token) {
        socket.auth = null;

        // not authenticated connection is still valid
        // thus no error
        return next();
      }

      try {
        // **TODO**: Remove mock and Validate user

        // fake auth
        socket.auth = {
          userId: '1234',
        };

        return next();
      } catch (e) {
        return next(e);
      }
    });

    return this.server;
  }

  /**
   * This method takes care of registering connections listeners in our socket server
   * @param server passing the server to listen to
   * @param callback
   */
  public bindClientConnect(server: socketio.Server, callback): void {
    server.on('connection', (socket: AuthenticatedSocket) => {
      if (socket.auth) {
        this.socketStateService.addUserToSocket(socket.auth.userId, socket);

        // register an event listener for the disconnect event to remove the socket from the state
        server.on('disconnect', () => {
          this.socketStateService.removeUserFromSocket(socket.auth.userId, socket);
        });
      }

      callback(socket);
    });
  }

  public close(server: any) {
    throw new Error('Method not implemented.');
  }

}
