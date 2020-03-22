import * as React from 'react'
import update from 'react-addons-update' 

import WebSocketManager from '../service/WebSocketManager';

type Props = {
  server: string;
  injectedCommand?: string;
  onCommandStart?: (command: string) => void;
  onCommandStdout?: (command: string, stdout: string) => void;
  onCommandStderr?: (command: string, stderr: string) => void;
  onCommandExit?: (command: string, exitCode: number, workingDirectory: string) => void;
}

export default function TerminalComponent(props: Props) {
  const wsMgr = new WebSocketManager(props.server);

  const [directory, setDirectory] = React.useState("");
  const [manualCommand, setManualCommand] = React.useState("");
  const [output, setOutput] = React.useState([] as string[]);
  const [isAutoScrollMode, setAutoScroll] = React.useState(true);

  const handleCommandOutput = (command: string, newOutput: string, callback?: (command: string, stderr: string) => void) => {
    setOutput(update(output, { $push: [ newOutput ] }));

    if (isAutoScrollMode) {
      setAutoScroll(isAutoScrollMode);
    }

    callback && callback(command, newOutput);
  }

  React.useEffect(() => { /* Block UI */ }, []);
  React.useEffect(() => wsMgr.sendCommand(directory, props.injectedCommand), [props.injectedCommand]);

  wsMgr.onConnectionInit = (workingDirectory) => {
    /* Unblock UI */
    setDirectory(workingDirectory);
  }

  wsMgr.onCommandStart = (command) => {
    setOutput(update(output, { $push: [ directory + "> " + command ] }));

    props.onCommandStart && props.onCommandStart(command);
  };

  wsMgr.onCommandStdout = (command, stdout) => {
    handleCommandOutput(command, stdout, props.onCommandStdout);
  };

  wsMgr.onCommandStderr = (command, stderr) => {
    handleCommandOutput(command, stderr, props.onCommandStdout);
  };

  wsMgr.onCommandExit = (command, code, workingDirectory) => {
    setDirectory(workingDirectory);

    props.onCommandExit && props.onCommandExit(command, code, workingDirectory);
  };

  return (
    <div style={{"height": "100%"}}>
      <div style={{"height": "100%"}} /* Scrollable, expanded height */>
        {
          output.map((line) => <div>{line}</div>)
        }
      </div>
      <form onSubmit={(e) => {
        e.preventDefault();

        wsMgr.sendCommand(directory, manualCommand);

        setManualCommand("");
      }}>
        <label>{directory} > </label>
        <input type="text" value={manualCommand} onChange={e =>setManualCommand(e.target.value)} />
        <input type="submit" style={{ "display": "none" }} />
      </form>
    </div>
  )
}
