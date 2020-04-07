import 'reflect-metadata'
import { createExpressServer } from 'routing-controllers'
import { UserController } from './controller/UserController'

const PORT = 5000

const app = createExpressServer({
  controllers: [UserController]
})

console.log('server run on localhost:', PORT)
app.listen(PORT)

