export interface CommandMessageFormat {
    command: string;
    type: 'start' | 'stdout' | 'stderr' | 'exit';
}

export interface OutputMessageFromat extends CommandMessageFormat {
    output: string;
}

export interface ExitMessageFromat extends CommandMessageFormat {
    code: number;
    workingDirectory: string;
}
