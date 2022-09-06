import cuid from 'cuid'
import { build } from 'esbuild'
import { existsAsync, readAsync, writeAsync } from 'fs-jetpack'
import { dirname, join } from 'path'
import { createRuntime, g, ServiceManager } from './runtime'

export type Service = {
  path: string
  name: string
  status: 'running' | 'stopped'
  type: 'process'
}

export const createService = async (arg: {
  path: string
  name: string
}): Promise<ServiceManager> => {
  const { path, name } = arg

  if (!g.services) {
    g.services = {}
  }

  let pkgpath = join(dirname(path), 'package.json')
  if (!(await existsAsync(pkgpath))) {
    join(dirname(path), '..', 'package.json')
  }

  const pkg = await readAsync(pkgpath, 'json')

  await build({
    entryPoints: [path],
    platform: 'node',
    format: 'cjs',
    bundle: true,
    outfile: join(g.outpath, 'services', name, 'index.js'),
    external: Object.keys(pkg.dependencies),
  })
  await writeAsync(join(g.outpath, 'services', name, 'package.json'), pkg)

  g.services[name] = { name, path, status: 'stopped', type: 'process' }

  return createRuntime(g.services[name])
}
