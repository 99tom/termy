import type { darkTheme } from '@src/themes'
import { v4 } from 'uuid'
import type { Cell } from '../../types'
import { getTheme, isDev } from '../utils'
import { getDefaultCell } from './helpers'

export interface Tab {
  cells: string[]
  activeCell: string
}

export interface State {
  tabs: {
    [id: string]: Tab
  }
  activeTab: string
  cells: {
    [id: string]: Cell
  }
  theme: typeof darkTheme
}

export const createState = (): State => {
  const tab = v4()
  const cell = { ...getDefaultCell(), value: 'shortcuts' }

  const state: State = {
    tabs: {
      [tab]: {
        cells: [cell.id],
        activeCell: cell.id,
      },
    },
    activeTab: tab,
    cells: {
      [cell.id]: cell,
    },
    theme: getTheme(isDev ? '#fff' : '#000'), // todo: refactor theme and fix circular dependency error
  }

  return state
}
