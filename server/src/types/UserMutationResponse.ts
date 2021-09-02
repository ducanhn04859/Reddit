/** @format */

import { User } from "../entities/User"
import { Field, ObjectType } from "type-graphql"
import { IMutationResponse } from "./MutationResponse"
import { FieldError } from "./FeildError"

@ObjectType({ implements: IMutationResponse })
export class UserMuntationResponse implements IMutationResponse {
  code: number
  success!: boolean
  message?: string

  @Field({ nullable: true })
  user?: User

  @Field((_type) => [FieldError], { nullable: true }) // return array of FieldError (type graphQL)
  errors?: FieldError[] // return array of FieldError (type typeScript)
}
