import 'reflect-metadata'
import { createKoaServer } from 'routing-controllers'
import { UserController } from './controller/UserController'

const PORT = 5000

const app = createKoaServer({
  controllers: [UserController]
})

console.log('server run on localhost:', PORT)
app.listen(PORT)

