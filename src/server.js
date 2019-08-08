import Koa from 'koa'
import Router from 'koa-router'
import bodyParser from 'koa-bodyparser'
import Sequelize from 'sequelize'
import { ApolloServer, gql } from 'apollo-server-koa'

const app = new Koa()
const router = new Router()
const sequelize = new Sequelize('postgres', 'postgres', 'xiaozei', {
    host: 'localhost',
    dialect: 'postgres',
    timestamps: false,
})

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.')
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err)
    })

const Model = Sequelize.Model

class User extends Model {}
User.init(
    {
        UserId: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        UserName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        UserAge: {
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: 'User',
        timestamps: true,
    }
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
        try {
            User.create({
                UserId: uid,
                UserName: `Droid NO.${uid}`,
                UserAge: id * uid,
            })
            ctx.body = {
                code: 1,
                data: {
                    UserId: uid,
                    UserName: `Droid NO.${uid}`,
                    UserAge: id * uid,
                },
            }
        } catch (error) {
            ctx.body = {
                code: 0,
                data: {},
                error,
            }
        }
    })

router.get('/find', async (ctx, next) => {
    const dataList = await User.findAll()
    const data = {
        list: dataList,
    }
    ctx.body = data
    await next()
})

const typeDefs = gql`
    type User {
        id: Int
        UserName: String
        UserAge: Int
    }
    type Query {
        Users: [User]
    }
`
const resolvers = {
    Query: {
        Users: async () => await User.findAll(),
    },
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.applyMiddleware({ app })

app.use(async (ctx, next) => {
    try {
        await User.sync()
        await next()
    } catch (error) {
        console.log(error)
    }
})
app.use(bodyParser())
app.use(router.routes()).use(router.allowedMethods())

app.listen(4545, () => {
    console.log(`🚀 Server ready at http://localhost:4545${server.graphqlPath}`)
})
