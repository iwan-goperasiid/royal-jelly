import { join } from 'path'
import { cwd } from 'process'
import { g } from './service/runtime'
import { createService } from './service/service'
;(async () => {
  g.outpath = join(cwd(), '.output')

  const web = await createService({
    name: 'web',
    path: join(cwd(), 'app', 'web', 'index.ts'),
  })

  const web1 = await web.start('4000')
  const web2 = await web.start('3000')

  //   setTimeout(() => {
  //     web.stopAll()
  //   }, 2000)
})()
