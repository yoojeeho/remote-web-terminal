import ChildProcess from 'child_process';

import WebSocket from 'ws';
import { Queue } from 'queue-typescript';

import { Client2ServerMessageFormat, CommandPushMessageFormat } from '../../protocol/Client2ServerMessageFormat';
import { CommandMessageFormat, CommandOutputMessageFormat, CommandExitMessageFormat } from '../../protocol/Server2ClientMessageFormat';

export default class MessageHandler {    
    private commandQueue: Queue<CommandPushMessageFormat> = new Queue();

    constructor(private socket: WebSocket) { }

    public onMessage = (msgStr: string) => {
        const msgObj = JSON.parse(msgStr) as Client2ServerMessageFormat;

        switch (msgObj.type) {
            case 'command-push':
                this.commandQueue.enqueue(msgObj as CommandPushMessageFormat);


                break;
            case 'command-abort':
                break;
        }
    }

    private spawn() {
        const cmdMsg = this.commandQueue.dequeue();
        const cp = ChildProcess.spawn(cmdMsg.command);

        const cmdStartMsgObj: CommandMessageFormat = { type: 'command-start', command: cmdMsg.command };
        const cmdStartMsgStr = JSON.stringify(cmdStartMsgObj);
        
        this.socket.send(cmdStartMsgStr);

        cp.stdout.on('data', (data) => this.responseCommandOutput('command-stdout', cmdMsg.command, data))
        cp.stderr.on('data', (data) => this.responseCommandOutput('command-stderr', cmdMsg.command, data))
        cp.on('exit', (code) => {

            const cmdExitMsgObj: CommandExitMessageFormat = {
                type: 'command-exit',
                code: code || 0,
                command: cmdMsg.command,
                workingDirectory: 'HOW_CAN_I_KNOW_LAST_WORKING_DIRECTORY??? asdasdasdasdiuagsdiiausgdoiausgdoiausgfoiaugsfoiuagsfoiuasgfoiuagsfoiuagsfoiuagsofuig'
            };
            const cmdExitMsgStr = JSON.stringify(cmdExitMsgObj);

            this.socket.send(cmdExitMsgStr);
        });
    }

    private responseCommandOutput = (type: 'command-stdout' | 'command-stderr', command: string, data: string) => {
        const resObj: CommandOutputMessageFormat = {
            type: type,
            command: command,
            output: data
        };
        const resStr = JSON.stringify(resObj);

        this.socket.send(resStr);
    }
}