/** @format */

require("dotenv").config()
import "reflect-metadata"
import express from "express"
import { createConnection } from "typeorm"
import { User } from "./entities/User"
import { Post } from "./entities/Post"
import { ApolloServer } from "apollo-server-express"
import { buildSchema } from "type-graphql"
import { HelloResolver } from "./resolvers/hello"
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"
import { UserResolver } from "./resolvers/user"
import mongoose from "mongoose"
import MongoStore from "connect-mongo"
import session from "express-session"
import { COOKIE_NAME, __prod__ } from "./constants"
import { Context } from "./types/Context"

const main = async () => {
  await createConnection({
    type: "postgres",
    database: "reddit",
    username: process.env.DB_USERNAME_DEV,
    password: process.env.DB_PASSWORD_DEV,
    logging: true,
    synchronize: true,
    entities: [User, Post],
  })

  const app = express()

  //Session/Cookie store
  const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV_PROD}:${process.env.SESSION_DB_PASSWORD_DEV_PROD}@reddit.jzpay.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
  await mongoose.connect(mongoUrl)
  console.log("Mongodb connected")

  // Database name present in the connection string will be used
  app.use(
    session({
      name: COOKIE_NAME,
      store: MongoStore.create({ mongoUrl }),
      cookie: {
        maxAge: 1000 * 60 * 60, //one hourse
        httpOnly: true, // JS front-end cannot access the cookie
        secure: __prod__, // cookie only work in https,
        sameSite: "lax", //protection against CSRF
      },
      secret: process.env.SESSION_SECRET_DEV_PROD as string,
      saveUninitialized: false, // dont save empty sessions, right from start
      resave: false,
    })
  )

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): Context => ({ req, res }),
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
  })
  await apolloServer.start()

  apolloServer.applyMiddleware({ app, cors: false })

  const PORT = process.env.PORT || 4000

  app.listen(PORT, () =>
    console.log(
      `Server is running in port ${PORT}. GraphQL server started on localhost:${PORT}${apolloServer.graphqlPath}`
    )
  )
}
main().catch((err) => console.log(err))
