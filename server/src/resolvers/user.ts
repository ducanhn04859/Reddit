/** @format */

import { User } from "../entities/User"
import { Arg, Mutation, Resolver } from "type-graphql"
import * as argon2 from "argon2"

@Resolver()
export class UserResolver {
  @Mutation((_returns) => User, { nullable: true })
  async register(
    //transform email:string (Type Script) into graphQL need add @Arg("name of variable")
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string
  ) {
    try {
      //check exits username duplicated userName or email
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      })
      if (existingUser) return null

      //hash password by argon2 package
      const hashPassword = await argon2.hash(password)

      const newUser = User.create({
        username,
        password: hashPassword,
        email,
      })
      //save user into BD
      return await User.save(newUser)
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
