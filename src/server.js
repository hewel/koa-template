import { printName, printId } from './foo'
import Koa from 'koa'

const app = new Koa()
const name = 'World'

app.use(async ctx => {
    ctx.body = await `Hello ${name}!`
})

printName(name)
printId(5)

app.listen(4545)
