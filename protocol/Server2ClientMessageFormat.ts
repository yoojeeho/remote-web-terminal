export interface Server2ClientMessageFormat {
    type: 'connection-init' | 'command-start' | 'command-stdout' | 'command-stderr' | 'command-exit';
}

export interface ConnectionInitMessageFormat extends Server2ClientMessageFormat {
    type: 'connection-init';
    workingDirectory: string;
}


export interface CommandMessageFormat extends Server2ClientMessageFormat {
    command: string;
    type: 'command-start' | 'command-stdout' | 'command-stderr' | 'command-exit';
}


export interface CommandOutputMessageFormat extends CommandMessageFormat {
    type: 'command-stdout' | 'command-stderr';
    output: string;
}

export interface CommandExitMessageFromat extends CommandMessageFormat {
    type: 'command-exit';
    code: number;
    workingDirectory: string;
}
