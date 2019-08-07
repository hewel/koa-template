import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import Sequelize from 'sequelize'

const app = new Koa()
const router = new Router()
const sequelize = new Sequelize('postgres', 'postgres', 'xiaozei', {
    host: 'localhost',
    dialect: 'postgres',
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })
// app.use(async ctx => {
//     ctx.body = await `Hello ${name}!`
// })

const Model = Sequelize.Model

class User extends Model {}
User.init(
    {
        uid: {
            type: Sequelize.INET,
            allowNull: false,
        },
        name: {
            type: Sequelize.CHAR,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: 'user_name',
    }
)
console.log(
    User.findAll({
        attributes: ['uid', 'name'],
    })
)

router.get('/', async (ctx, next) => {
    ctx.body = ctx
    if (ctx.request.accepts('html')) {
        // ctx.response.type = 'html'
        // ctx.response.body = '<p>Hello World</p>'
        ctx.type = 'html'
        ctx.body = '<p>Hello World</p>'
    }
    await next()
})

router.get('/test', async ctx => {
    ctx.body = ctx.request.body
})
router
    .param('id', (id, ctx, next) => {
        ctx.request.id = id
        return next()
    })
    .post('/test/:id', ctx => {
        const { id } = ctx.request
        const { uid = null } = ctx.query
        if (id) {
            ctx.body = {
                uid,
                id,
                name: `I'm Droid NO.${id * uid}`,
            }
        } else {
            ctx.body = ctx.request.body
        }
    })

app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(4545)

console.log('http://127.0.0.1:4545')
