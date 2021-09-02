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
export class User extends BaseEntity {
  @Field((_type) => ID) //for graphQL
  @PrimaryGeneratedColumn() // for postgreSQL
  id!: number //! cannot null

  @Field((_type) => String) //method1
  @Column({ unique: true })
  username!: string

  @Field() // method2: auto recognize type is String
  @Column({ unique: true })
  email!: string

  @Column()
  password!: string

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @UpdateDateColumn()
  updatedAt: Date
}
