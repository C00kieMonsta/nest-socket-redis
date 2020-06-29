import { Inject, Injectable } from '@nestjs/common';
import { Observable, Observer } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import {
  REDIS_PUBLISHER_CLIENT,
  REDIS_SUBSCRIBER_CLIENT,
} from '../constants';
import { RedisClient } from './redis.providers';

export interface RedisSubscribeMessage {
  readonly message: string;
  readonly channel: string;
}

/**
 * Service to abstract all logic away to connect to the underlying Redis clients
 */
@Injectable()
export class RedisService {

  // inject subscriber and publisher redis client
  constructor(
    @Inject(REDIS_SUBSCRIBER_CLIENT) private readonly redisSubscriberClient: RedisClient,
    @Inject(REDIS_PUBLISHER_CLIENT) private readonly redisPublisherClient: RedisClient,
  ) { }

  /**
   * Listening for events of type eventName
   * @param eventName name of the event to keep an eye on
   */
  public fromEvent<T>(eventName: string): Observable<T> {

    // subscribe to certain event
    this.redisSubscriberClient.subscribe(eventName);

    // make it an observable and return "observer" to catch events of type 'message'
    return Observable.create((observer: Observer<RedisSubscribeMessage>) => {
      this.redisSubscriberClient.on('message', (channel, message) => observer.next({channel, message}));
    }).pipe(
      // then we filter to only get events where the channel is equal to the eventName
      filter(({ channel }) => channel === eventName),
      map(({ message }) => JSON.parse(message)),
    );
  }

  /**
   * Publishing messages on channels identified by a specific eventName
   * @param channel channel through which the message is published
   * @param value value being published
   */
  public publish(channel: string, value: any): Promise<number> {
    // returning a promise to make sure that we wait for the message to be published and can catch the error otherwise
    return new Promise<number>((resolve, reject) => {
      return this.redisPublisherClient.publish(channel, JSON.stringify(value), (error, res) => {
        if (error) {
          return reject(error);
        }
        return resolve(res);
      });
    });
  }

}
