import { printName, printId } from './foo'
import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const router = new Router()
const name = 'World'

app.use(bodyParser())

// app.use(async ctx => {
//     ctx.body = await `Hello ${name}!`
// })

router.get('/test', async ctx => {
    ctx.body = await 'test page'
})

app.use(router.routes()).use(router.allowedMethods())

printName(name)
printId(5)

app.listen(4545)
