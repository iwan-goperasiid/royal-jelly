import express, { Express, Request, Response } from 'express'
import dotenv from 'dotenv'

import { call } from 'service'

dotenv.config()

const app: Express = express()
const port = process.argv.pop()

let name = 'iwan'

let panggil = () => {
  name = 'rizky'
}

app.get('/', (req: Request, res: Response) => {
  res.send(`Express + TypeScript Server ${name} `)
})

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`)
})
