import { Server } from 'ws';

import MessageHandler from './message-handler';

export default class RemoteWebTerminalBackend {
  constructor(private defaultWorkingDirectory: string, private port: number) { }

  public listen() {
    const wsServer = new Server({ port: this.port });

    wsServer.on('connection', (ws) => {
      const msgHandler = new MessageHandler(ws);

      ws.on('message', msgHandler.onMessage);
    });
  }

}
