/** @format */

import { User } from "../entities/User"
import { Arg, Mutation, Resolver } from "type-graphql"
import * as argon2 from "argon2"
import { UserMuntationResponse } from "../types/UserMutationResponse"

@Resolver()
export class UserResolver {
  @Mutation((_returns) => UserMuntationResponse, { nullable: true })
  async register(
    //transform email:string (Type Script) into graphQL need add @Arg("name of variable")
    @Arg("email") email: string,
    @Arg("username") username: string,
    @Arg("password") password: string
  ): Promise<UserMuntationResponse> {
    try {
      //check exits username duplicated userName or email
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      })
      if (existingUser)
        return {
          code: 400,
          success: false,
          message: "Duplicate Username or Email",
          error: [
            {
              field: existingUser.username === username ? "username" : "email",
              message: "Username or Email already taken",
            },
          ],
        }

      //hash password by argon2 package
      const hashPassword = await argon2.hash(password)

      const newUser = User.create({
        username,
        password: hashPassword,
        email,
      })
      return {
        code: 200,
        success: true,
        message: "User registration successful",
        user: await User.save(newUser), //save user into BD
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server ${error.message}`,
      }
    }
  }
}
