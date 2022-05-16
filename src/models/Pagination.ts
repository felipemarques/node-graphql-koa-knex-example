import { Arg, Field, FieldResolver, ObjectType } from 'type-graphql'

@ObjectType()
export default class Pagination {
  @Field({defaultValue: 1})
  total: number

  @Field({defaultValue: 1})
  page: number
  
  @Field({defaultValue: 1})
  pageSize: number
  
}
