/** @format */
import { Field, ID, ObjectType } from "type-graphql"

import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm"

//Mark User can communicate from typeScript to GraphQL
@ObjectType()
//Mark User can communicate from typeScript to typeORM (postgreSQL)
@Entity()
//
export class Post extends BaseEntity {
  @Field((_type) => ID) //for graphQL
  @PrimaryGeneratedColumn()
  id!: number

  @Field((_type) => String) //for graphQL
  @Column()
  title!: string

  @Field() //for graphQL
  @Column()
  text!: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
