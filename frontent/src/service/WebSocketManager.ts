interface MessageFormat {
    command: string;
    type: 'start' | 'stdout' | 'stderr' | 'exit';
}

interface OutputMessageFromat extends MessageFormat {
    output: string;
}

interface ExitsMessageFromat extends MessageFormat {
    code: number;
}

export default class WebSocketManager {
    private webSocket: WebSocket;

    public onStart?: (command: string) => void;
    public onStdout?: (command: string, stdout: string) => void;
    public onStderr?: (command: string, stderr: string) => void;
    public onExit?: (command: string, exitCode: number) => void;
  
    constructor(server: string) {
      this.webSocket = new WebSocket(server);
  
      this.webSocket.onmessage = this.onMessage;
    }
  
    public getDefaultDirectory() {
      return "/home/test";
    }
  
    public sendCommand(command?: string) {
      if (!command) return;
    
      alert(command);
      this.onStdout && this.onStdout(command, command);
    }

    private onMessage(e: MessageEvent) {
      let message = e.data as MessageFormat;

      switch (message.type) {
          case 'start':
            let startMsg = message as OutputMessageFromat;
                  
            this.onStart && this.onStart(startMsg.command);
            break;
          case 'stdout':
            let stdoutMsg = message as OutputMessageFromat;
                  
            this.onStdout && this.onStdout(stdoutMsg.command, stdoutMsg.output);
            break;
          case 'stderr':
            let stderrMsg = message as OutputMessageFromat;

            this.onStderr && this.onStderr(stderrMsg.command, stderrMsg.output);
            break;
          case 'exit':
            let exitMsg = message as ExitsMessageFromat;

            this.onExit && this.onExit(exitMsg.command, exitMsg.code);
            break;
      }
    }
  }
  