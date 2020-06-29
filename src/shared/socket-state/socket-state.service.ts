import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

/**
 * Service to abstract all logic away to maintain socket state
 */
@Injectable()
export class SocketStateService {

  // hash table of socket connections mapped with userId's
  private socketState = new Map<string, Socket[]>();

  /**
   * Add user to specific socket
   * @param userId id of user
   * @param socket socket to which user is being added
   */
  public addUserToSocket(userId: string, socket: Socket): boolean {
    const existingSockets = this.socketState.get(userId) || [];
    this.socketState.set(userId, [...existingSockets, socket]);
    return true;
  }

  /**
   * Remove user from specific socket
   * @param userId id of user
   * @param socket socket from which user is being removed
   */
  public removeUserFromSocket(userId: string, socket: Socket) {
    const existingSockets = this.socketState.get(userId);

    if (!existingSockets) {
      return true;
    }

    const filteredSockets = existingSockets.filter(s => s.id !== socket.id);

    if (!filteredSockets.length) {
      this.socketState.delete(userId);
    } else {
      this.socketState.set(userId, filteredSockets);
    }

    return true;
  }

  /**
   * Retrieve sockets of user with userId
   * @param userId id of user
   */
  public getSocketsByUserId(userId: string): Socket[] {
    return this.socketState.get(userId);
  }

  /**
   * Retrieve all sockets of authenticated users
   */
  public getAllSockets(): Socket[] {
    const all = [];
    this.socketState.forEach(sockets => all.push(sockets));
    return all;
  }
}
