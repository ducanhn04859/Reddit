/** @format */

import { Field, ObjectType } from "type-graphql"
import { IMutationResponse } from "./MutationResponse"
import { FieldError } from "./FeildError"
import { Post } from "../entities/Post"

@ObjectType({ implements: IMutationResponse })
export class PostMutationResponse implements IMutationResponse {
  code: number
  success!: boolean
  message?: string

  @Field({ nullable: true })
  post?: Post

  @Field((_type) => [FieldError], { nullable: true }) // return array of FieldError (type graphQL)
  errors?: FieldError[] // return array of FieldError (type typeScript)
}
