/** @format */

import { User } from "../entities/User"
import { Arg, Ctx, Mutation, Resolver } from "type-graphql"
import * as argon2 from "argon2"
import { UserMuntationResponse } from "../types/UserMutationResponse"
import { RegisterInput } from "../types/RegisterInput"
import { validateRegisterInput } from "../utils/validataRegisterInput"
import { LoginInput } from "../types/LoginInput"
import { Context } from "../types/Context"
import { COOKIE_NAME } from "../constants"

@Resolver()
export class UserResolver {
  //
  //
  //Mutation for register
  //
  @Mutation((_return) => UserMuntationResponse)
  async register(
    //transform email:string (Type Script) into graphQL need add @Arg("name of variable")
    @Arg("registerInput") registerInput: RegisterInput
    //
  ): Promise<UserMuntationResponse> {
    const validateRegisterInputErrors = validateRegisterInput(registerInput)
    if (validateRegisterInputErrors !== null)
      return {
        code: 400,
        success: false,
        ...validateRegisterInputErrors,
      }

    try {
      const { username, password, email } = registerInput
      //check exits username duplicated userName or email
      const existingUser = await User.findOne({
        where: [{ username }, { email }],
      })
      if (existingUser)
        return {
          code: 400,
          success: false,
          message: "Duplicate Username or Email",
          errors: [
            {
              field: existingUser.username === username ? "username" : "email",
              message: `${
                existingUser.username === username ? "Username" : "Email"
              } already taken !`,
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

  //
  //
  //Mutation for login
  //
  @Mutation((_return) => UserMuntationResponse)
  async login(
    @Arg("loginInput") loginInput: LoginInput,
    @Ctx() { req }: Context
  ): //
  Promise<UserMuntationResponse> {
    try {
      const { usernameOrEmail, password } = loginInput
      const existingUser = await User.findOne(
        usernameOrEmail.includes("@")
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail }
      )

      if (!existingUser)
        return {
          code: 400,
          success: false,
          message: "Not found Username",
          errors: [
            {
              field: "usernameOrEmail",
              message: `Username or Password is not correct`,
            },
          ],
        }

      const passwordValidate = await argon2.verify(
        existingUser.password,
        password
      )
      if (!passwordValidate)
        return {
          code: 400,
          success: false,
          message: "Wrong password",
          errors: [
            {
              field: "password",
              message: `Username or Password is not correct`,
            },
          ],
        }

      //create session and return cookie
      req.session.userId = existingUser.id

      return {
        code: 200,
        success: true,
        message: "Logging successfully",
        user: existingUser,
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server ${error.message}`,
      }
    }
  }

  @Mutation((_return) => Boolean)
  logout(@Ctx() { req, res }: Context): Promise<boolean> {
    return new Promise((resolve, _reject) => {
      res.clearCookie(COOKIE_NAME)
      req.session.destroy((err) => {
        if (err) {
          console.log("DESTROYING SESSION ERROR")
          resolve(false)
        }
        resolve(true)
      })
    })
  }
}
