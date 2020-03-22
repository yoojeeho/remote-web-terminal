import { Server2ClientMessageFormat, ConnectionInitMessageFormat, CommandOutputMessageFromat, CommandExitMessageFromat } from "../../../protocol/Server2ClientMessageFormat";
import { CommandPushMessageFormat } from "../../../protocol/Client2ServerMessageFormat";

export default class WebSocketManager {
  private webSocket: WebSocket;

  public onConnectionInit?: (workingDirectory: string) => void;
  public onCommandStart?: (command: string) => void;
  public onCommandStdout?: (command: string, stdout: string) => void;
  public onCommandStderr?: (command: string, stderr: string) => void;
  public onCommandExit?: (command: string, exitCode: number, workingDirectory: string) => void;

  constructor(server: string) {
    this.webSocket = new WebSocket(server);

    this.webSocket.onmessage = this.onMessage;
  }

  public sendCommand(workingDirectory: string, command?: string) {
    if (!command) return;

    alert(workingDirectory + "> " + command);

    const msgObj: CommandPushMessageFormat = { type: 'command-push', command: command };
    const msgStr = JSON.stringify(msgObj);

    this.webSocket.send(msgStr);
  }

  private onMessage = (e: MessageEvent) => {
    let message = e.data as Server2ClientMessageFormat;

    switch (message.type) {
      case 'connection-init':
        this.onConnectionInit && this.onConnectionInit((message as ConnectionInitMessageFormat).workingDirectory);
        break;
      case 'command-start':
        this.onCommandStart && this.onCommandStart((message as CommandOutputMessageFromat).command);
        break;
      case 'command-stdout':
        let stdoutMsg = message as CommandOutputMessageFromat;

        this.onCommandStdout && this.onCommandStdout(stdoutMsg.command, stdoutMsg.output);
        break;
      case 'command-stderr':
        let stderrMsg = message as CommandOutputMessageFromat;

        this.onCommandStderr && this.onCommandStderr(stderrMsg.command, stderrMsg.output);
        break;
      case 'command-exit':
        let exitMsg = message as CommandExitMessageFromat;

        this.onCommandExit && this.onCommandExit(exitMsg.command, exitMsg.code, exitMsg.workingDirectory);
        break;
    }
  }
}
