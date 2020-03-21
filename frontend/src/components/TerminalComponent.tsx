import * as React from 'react'
import update from 'react-addons-update' 

import WebSocketManager from '../service/WebSocketManager';

type Props = {
  server: string;
  injectedCommand?: string;
  onStart?: (command: string) => void;
  onStdout?: (command: string, stdout: string) => void;
  onStderr?: (command: string, stderr: string) => void;
  onExit?: (command: string, exitCode: number, workingDirectory: string) => void;
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
      //Go to output bottom
    }

    callback && callback(command, newOutput);
  }

  React.useEffect(() => setDirectory(wsMgr.getDefaultDirectory()), []);
  React.useEffect(() => wsMgr.sendCommand(directory, props.injectedCommand), [props.injectedCommand]);

  wsMgr.onStart = (command) => {
    setOutput(update(output, { $push: [ directory + "> " + command ] }));

    props.onStart && props.onStart(command);
  };

  wsMgr.onStdout = (command, stdout) => {
    handleCommandOutput(command, stdout, props.onStdout);
  };

  wsMgr.onStderr = (command, stderr) => {
    handleCommandOutput(command, stderr, props.onStdout);
  };

  wsMgr.onExit = (command, code, workingDirectory) => {
    setDirectory(workingDirectory);

    props.onExit && props.onExit(command, code, workingDirectory);
  };

  return (
    <div style={{"height": "100%"}}>
      <div style={{"height": "100%"}} /* Scrollable, expanded height */>
        output here
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
