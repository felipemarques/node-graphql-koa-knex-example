import { Field, ObjectType, ID, Int } from 'type-graphql'
import { BookingType } from '../types/BookingType'
import BaseModel from './BaseModel'
import Flight from './Flight';
import Pagination from './Pagination';

@ObjectType()
export default class Booking extends BaseModel implements BookingType {

  static entity:any = Booking;
  static table:string = 'bookings';

  @Field(type => Int)
  id: number

  @Field(type => Flight, {nullable: true})
  flight?: Flight
  flight_id?: number

  @Field({nullable: true, defaultValue: 0})
  seatCount: number
  seat_count: number

  @Field({nullable: false})
  email: string

  @Field()
  availableSeats: number
}

@ObjectType()
export class BookingPagination {

  @Field(type => Pagination)
  pagination: Pagination

  @Field(type => [Booking])
  nodes: Booking[]

}