# WebSocket with Nest and Redis

## Components

1. In-memory database (Redis)
2. Propagator (Redis)
3. WebSocket client (Socket.io)

## Context

Whenever using a stateless back-end and using WebSockets for real-time communication, you need a way to keep track of session in some way. Redis Pub/Sub can help in keeping track of client connecting to you back, without having to create a session.

The idea of stateless application is thougher to setup but easier to maintain. It also makes the scaling up way easier when containerizing your application on hundreds of containers that can be easily disposed.

Redis will support in managing and keeping track of open connections (WebSockt connections).

![fb-websocket-flow](https://user-images.githubusercontent.com/22135261/114315842-184e7680-9b01-11eb-95f9-a0d3cb6d6aa5.png)
