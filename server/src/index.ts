require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { createConnection } from 'typeorm'

const main = async () => {
    await createConnection({
      type: "postgres",
      database: "reddit",
      username: "postgres",
      password: "123",
      logging: true,
      synchronize: true,
    })

    
    const app = express()
    
    app.listen(4000, () => console.log('Server is running in port 4000'))
    
}

main().catch(err =>console.log(err))