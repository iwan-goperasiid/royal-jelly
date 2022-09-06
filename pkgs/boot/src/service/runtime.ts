import { Service } from './service'
import { join } from 'path'
import { existsAsync } from 'fs-jetpack'
import { ChildProcess, spawn } from 'child_process'
import cuid from 'cuid'

export const g = global as typeof global & {
  services: Record<string, Service>
  outpath: string
}

export type RuntimeState = {
  pid: string
  type: 'process'
  process: ChildProcess
  call: () => Promise<any>
}

export type ServiceManager = {
  start: (...args: string[]) => Promise<RuntimeState | false>
  stop: (pid: string) => Promise<boolean>
  stopAll: () => Promise<boolean>
  state: Service
  runtime: Record<string, RuntimeState>
}

export const createRuntime = (service: Service) => {
  return {
    runtime: {},
    async start(...args: string[]) {
      try {
        const idxpath = join(g.outpath, 'services', service.name, 'index.js')

        const nmpath = join(g.outpath, 'services', service.name, 'node_modules')
        if (!(await existsAsync(nmpath))) {
          await new Promise((done) => {
            console.log(`Installing ${service.name} dependencies:`)
            const npm = spawn(
              /^win/.test(process.platform) ? 'npm.cmd' : 'npm',
              ['i'],
              {
                stdio: 'inherit',
                cwd: join(g.outpath, 'services', service.name),
              }
            )

            npm.on('exit', done)
          })
        }

        let pid = cuid()

        // prevent id collision.
        while (this.runtime[pid]) {
          pid = cuid()
        }

        if ((service.type = 'process')) {
          const proc = spawn(process.execPath, [idxpath, ...(args || [])], {
            stdio: 'inherit',
          })
          this.runtime[pid] = {
            pid,
            type: 'process',
            process: proc,
          }
        }

        return this.runtime[pid]
      } catch (e) {
        console.error(e)
        return false
      }
    },
    stopAll() {
      return new Promise<boolean>(async (resolve) => {
        try {
          const stopper = Object.values(this.runtime).map(
            (s) =>
              new Promise((stopped) => {
                const e = this.runtime[s.pid]
                if (!e.process.killed) {
                  e.process.once('exit', () => resolve(true))
                  e.process.kill()
                }
              })
          )
          await Promise.all(stopper)
          resolve(true)
        } catch (e) {
          console.error(e)
          resolve(false)
        }
      })
    },
    stop(pid: string) {
      return new Promise<boolean>((resolve) => {
        try {
          const s = this.runtime[pid]
          if (!s.process.killed) {
            s.process.once('exit', () => resolve(true))
            s.process.kill()
          }
        } catch (e) {
          console.error(e)
          resolve(false)
        }
      })
    },
    state: service,
  } as ServiceManager
}
