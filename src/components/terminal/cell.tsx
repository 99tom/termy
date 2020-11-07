import React, { useEffect, useRef, useState } from 'react'
import { Terminal } from 'xterm'
import { FitAddon } from 'xterm-addon-fit'
import {
  CellType,
  FrontendMessage,
  ServerDataMessage,
  ServerStatusMessage,
} from '../../../types'
import { ipc, useListener } from '../../lib'
import { styled } from '../../stitches.config'
import useStore from '../../store'
import List from '../custom/list'
import Prompt from './prompt'

/**
 * 1. Render PTY/API based on type
 * 2. Show status
 *
 * Note: Listening for output happens in child components
 */
const Cell: React.FC<CellType> = cell => {
  console.log('cell', cell)
  const [status, setStatus] = useState<number | null>(null)
  const [type, setType] = useState<'PTY' | 'API' | null>(null)

  useListener(
    `status-${cell.id}`,
    (message: ServerStatusMessage) => {
      setType(message.type)
      setStatus(message.status)
    },
    [type],
  )

  return (
    <Container>
      <Prompt {...cell} />
      <OutputContainer>
        {type === 'PTY' && <PtyRenderer {...cell} />}
        {type === 'API' && <ApiRenderer {...cell} />}
      </OutputContainer>
    </Container>
  )
}

export default Cell

const Container = styled('div', {
  backgroundColor: '#EBECF3',
  p: '$2',
  borderRadius: '$2',

  '& + &': {
    mt: '$1',
  },
})

const OutputContainer = styled('div', {})

const ApiRenderer: React.FC<CellType> = ({ id, currentDir, input }) => {
  const dispatch = useStore(state => state.dispatch)
  const [output, setOutput] = useState('')

  useListener(
    `data-${id}`,
    (message: ServerDataMessage) => {
      console.log('parsing')

      const data = JSON.parse(message.data)
      if (data.cd) {
        dispatch({ type: 'set-current-dir', id, newDir: data.cd })
      }
      setOutput(data.output)
    },
    [],
  )

  switch (input) {
    // check if custom renderer is available
    case 'list':
      return <List path={currentDir} />
    default:
      // default to auto renderer (markdown?)
      return <div>{output}</div>
  }
}

const PtyRenderer: React.FC<CellType> = ({ id, currentDir, input }) => {
  const ref = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<Terminal | null>(null)

  useEffect(() => {
    if (!ref.current) return
    let term = new Terminal({
      convertEol: true,
      cursorStyle: 'block',
      allowTransparency: true, // this can negatively affect performance
      // fontFamily: todo: theme.
      theme: {
        foreground: '#333',
        background: 'rgba(0,0,0,0)',
        // selection: todo: theme.
        selection: 'rgba(249, 99, 49, .4)',
      },
    })

    // todo: https://xtermjs.org/docs/guides/flowcontrol/
    term.onData(key => {
      console.log('key', key)

      const message: FrontendMessage = { type: 'send-stdin', data: { id, key } }
      ipc.send('message', message)
    })

    // fit
    const fitAddon = new FitAddon()
    term.loadAddon(fitAddon)
    fitAddon.fit()

    term.open(ref.current)
    console.log(term.getOption('fontFamily'))
    terminalRef.current = term
  }, [currentDir, id])

  useListener(
    `data-${id}`,
    (message: ServerDataMessage) => {
      if (!terminalRef.current) {
        console.warn('Terminal not available')
        return
      }

      console.log('writing chunk', message.data)
      terminalRef.current.write(message.data)

      //   console.log('Exit status: ', message.exitStatus)
      //   setExitStatus(message.exitStatus)

      //   terminal.write('\u001B[?25l') // hide cursor
      //   terminal.setOption('disableStdin', true)
    },
    [],
  )

  return <XtermContainer tabIndex={0} ref={ref}></XtermContainer>
}

const XtermContainer = styled.div({
  px: '$2',
})
