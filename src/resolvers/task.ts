import { Resolver, Query } from "type-graphql";

@Resolver()
export class TaskResolver {
  @Query(() => String)
  hello(): string{
    return "Hello World!";
  }
}
