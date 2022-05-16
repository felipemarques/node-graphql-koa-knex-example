import { Field, ObjectType, ID, Int } from 'type-graphql'
import { FlightType } from '../types/FlightType'
import BaseModel from './BaseModel';
import Booking from './Booking';
import Pagination from './Pagination';
import SpaceCenter from './SpaceCenter';

@ObjectType()
export default class Flight extends BaseModel implements FlightType {

  static entity:any = Flight;
  static table:string = 'flights';

  @Field(type => Int)
  id: number

  //TODO: a unique 16 byte hexadecimal code generated for each flight.
  @Field({nullable: false})
  code: string

  @Field(type => SpaceCenter,{nullable: false})
  launchSite: SpaceCenter
  launchsite_id: number

  @Field(type => SpaceCenter,{nullable: false})
  landingSite: SpaceCenter
  landingsite_id: number

  @Field({nullable: false})
  departureAt: Date
  departure_at: Date

  @Field({nullable: true, defaultValue: 0})
  seatCount: number
  seat_count: number

  @Field({nullable: true, defaultValue: 0})
  availableSeats: number

}

@ObjectType()
export class FlightPagination {

  @Field(type => Pagination)
  pagination: Pagination

  @Field(type => [Flight])
  nodes: Flight[]

}