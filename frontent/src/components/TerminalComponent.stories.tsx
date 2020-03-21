import * as React from 'react'

import TerminalComponent from './TerminalComponent'

export default { title: 'TerminalComponent' }

export const basic = () => <TerminalComponent server="ws://localhost:1234" />
