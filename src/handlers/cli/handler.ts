import { ChildProcess, spawn } from 'child_process'
import { BrowserWindow, ipcMain, ipcRenderer } from 'electron'
import { CLI_CHANNELS } from './channels'
import { getCliFlags, getCliPath } from './helpers'
import type { CliApi, CliEvent, CliRunArgs } from './types'

const cliProcesses = new Map<string, ChildProcess>()

function runCli(args: CliRunArgs, onEvent: (e: CliEvent) => void): void {
  const flags = getCliFlags(args)

  const proc = spawn(getCliPath(), flags)
  cliProcesses.set(args.runId, proc)

  let buf = ''
  proc.stdout.on('data', (chunk) => {
    buf += chunk.toString()
    const lines = buf.split('\n')
    buf = lines.pop() ?? ''
    for (const line of lines) {
      if (!line.trim()) continue
      try {
        onEvent(JSON.parse(line))
      } catch {
        /* ignore non-JSON lines */
      }
    }
  })

  proc.on('close', () => cliProcesses.delete(args.runId))
}

function cancelCli(runId: string): void {
  cliProcesses.get(runId)?.kill()
  cliProcesses.delete(runId)
}

export function registerCli(win: BrowserWindow): void {
  ipcMain.on(CLI_CHANNELS.RUN, (_e, args: CliRunArgs) => {
    runCli(args, (event) => win.webContents.send(CLI_CHANNELS.PROGRESS, event))
  })

  ipcMain.on(CLI_CHANNELS.CANCEL, (_e, runId: string) => {
    cancelCli(runId)
  })
}

export function cliPreload(): CliApi {
  return {
    run: (args: CliRunArgs): void => ipcRenderer.send(CLI_CHANNELS.RUN, args),
    cancel: (runId: string): void => ipcRenderer.send(CLI_CHANNELS.CANCEL, runId),
    onProgress: (callback: (e: CliEvent) => void) => {
      ipcRenderer.on(CLI_CHANNELS.PROGRESS, (_e, event) => callback(event))
      return () => ipcRenderer.removeAllListeners(CLI_CHANNELS.PROGRESS)
    }
  }
}
