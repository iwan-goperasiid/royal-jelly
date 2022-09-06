import type { BaseConfig } from './pkgs/base/src/config'
import 'dotenv/config'

export default {
  app: {
    name: 'app',
    version: '0.0.1',
  },
  prod: {
    server: {
      url: 'http://localhost:3200',
      worker: Number.MAX_VALUE,
    },
    client: {
      web: {
        url: '[server.url]',
      },
    },
    dbs: {
      db: {
        url: 'postgres://postgres:andromedia123oke@db.plansys.co:5432/petroport_live',
      },
    },
  },
  dev: {
    server: {
      url: 'http://localhost:3200',
      worker: 1,
    },
    client: {
      web: {
        url: '[server.url]/',
      },
    },
    dbs: {
      db: {
        url: 'postgres://postgres:andromedia123oke@db.plansys.co:5432/petroport_live',
      },
    },
  },
} as BaseConfig
