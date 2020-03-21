import { Server } from 'ws';

export default class RemoteWebTerminalBackend {
  constructor(defaultWorkingDirectory: string, port: number) {
    const wsServer = new Server({ port: port });

    wsServer.on('connection', (ws) => {
      ws.on('message', this.onMessage);
    });
  }

  private onMessage(message: string) {

  }
}
