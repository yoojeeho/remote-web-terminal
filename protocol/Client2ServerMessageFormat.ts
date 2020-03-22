export interface Client2ServerMessageFormat {
    type: 'command-push' | 'command-abort';
}

export interface CommandPushMessageFormat extends Client2ServerMessageFormat {
    command: string;
    type: 'command-push';
}
