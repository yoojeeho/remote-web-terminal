import * as React from 'react'
import update from 'react-addons-update' 

import WebSocketManager from '../service/WebSocketManager';

type Props = {
  server: string;
  injectedCommand?: string;
  onStart?: (command: string) => void;
  onStdout?: (command: string, stdout: string) => void;
  onStderr?: (command: string, stderr: string) => void;
  onExit?: (command: string, exitCode: number) => void;
}

export default function TerminalComponent(props: Props) {
  const wsMgr = new WebSocketManager(props.server);

  const [directory, setDirectory] = React.useState("");
  const [command, setCommand] = React.useState("");
  const [output, setOutput] = React.useState([] as string[]);

  React.useEffect(() => setDirectory(wsMgr.getDefaultDirectory()), []);
  React.useEffect(() => wsMgr.sendCommand(props.injectedCommand), [props.injectedCommand]);

  wsMgr.onStart = (command) => {
    props.onStart && props.onStart(command);
  };

  wsMgr.onStdout = (command, stdout) => {
    setOutput(update(output, { $push: [ stdout ] }));
    props.onStdout && props.onStdout(command, stdout);
  };

  wsMgr.onStderr = (command, stderr) => {
    setOutput(update(output, {$push: [ stderr ]}));
    props.onStderr && props.onStderr(command, stderr);
  };

  wsMgr.onExit = (command, code) => {
    props.onExit && props.onExit(command, code);
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

        wsMgr.sendCommand(command);

        setCommand("");
      }}>
        <label>{directory} > </label>
        <input type="text" value={command} onChange={e =>setCommand(e.target.value)} />
        <input type="submit" style={{ "display": "none" }} />
      </form>
    </div>
  )
}
