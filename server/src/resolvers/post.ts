/** @format */

import { Arg, Mutation, Query, Resolver } from "type-graphql"
import { Post } from "../entities/Post"
import { CreatePostInput } from "../types/CreatePostInput"
import { PostMutationResponse } from "../types/PostMutationResponse"

@Resolver()
export class PostResolver {
  @Mutation((_return) => PostMutationResponse)
  async createPost(
    @Arg("createPostInput") { title, text }: CreatePostInput
  ): Promise<PostMutationResponse> {
    try {
      const newPost = Post.create({ title, text })

      await newPost.save()

      return {
        code: 200,
        success: true,
        message: `Post created successfully`,
        post: newPost,
      }
    } catch (error) {
      return {
        code: 500,
        success: false,
        message: `Internal server ${error.message}`,
      }
    }
  }

  @Query((_return) => [Post])
  async posts(): Promise<Post[]> {
    return Post.find()
  }
}
