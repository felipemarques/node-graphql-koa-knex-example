import { Arg, Field, FieldResolver, ObjectType } from 'type-graphql'
import { SpaceCenterType } from '../types/SpaceCenterType'
import BaseModel from './BaseModel'
import Planet from './Planet'
import Pagination from './Pagination'

@ObjectType()
export class SpaceCenterStatistic {

  //average flight count per week launched from this space center.
  @Field()
  averageWeeklyFlightCount: number

  //the average filing rate (number of seats booked) per weekday (monday, tuesday...) of the flights launched from this space center.
  @Field()
  dailyFilingRatePerWeekDay: number

}

@ObjectType()
export class SpaceCenterPagination {

  @Field(type => Pagination)
  pagination: Pagination

  @Field(type => [SpaceCenter])
  nodes: SpaceCenter[]

}

@ObjectType()
export default class SpaceCenter extends BaseModel implements SpaceCenterType {

  static entity:any = SpaceCenter;
  static table:string = 'space_centers';
  
  @Field()
  id: number

  @Field({nullable: false})
  uid: string

  @Field({nullable: false})
  name: string

  @Field()
  description: string

  @Field({nullable: false})
  latitude: number

  @Field({nullable: false})
  longitude: number

  //@Field({nullable: false})
  planet_code: string

  @Field(type => Planet)
  planet: Planet

  @Field(type => SpaceCenterStatistic, {nullable: true})
  statistics: SpaceCenterStatistic
}

