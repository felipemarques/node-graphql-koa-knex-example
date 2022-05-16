import { Context } from 'mocha'
import { v4 as uuidv4 } from 'uuid';
import { Arg, Args, ArgsType, Query, Resolver, Float, Mutation, Field, FieldResolver, Int, InputType, Root, Ctx, ID } from 'type-graphql'
import Flight, { FlightPagination } from '../models/Flight';
import SpaceCenter from '../models/SpaceCenter';
import { Max, Min } from 'class-validator';
import { ApolloError } from 'apollo-server-koa';
import Booking from '../models/Booking';

@InputType()
export class ScheduleFlightInput {
    @Field(type => Int, {defaultValue: 0})
    launchSiteId: number

    @Field(type => Int, {defaultValue: 0})
    landingSiteId: number

    @Field(type => String, {defaultValue: 0})
    departureAt: String

    @Field(type => Int, {defaultValue: 0})
    seatCount: number
}

@ArgsType()
class GetAllFlightsArgs {

  @Field(type => Int, {nullable: true})
  from: string

  @Field(type => Int, {nullable: true})
  to: string

  @Field({nullable: true})
  seatCount: number

  //@TODO: verify how to validate and check ISO date
  @Field({nullable: true})
  departureDay: Date


  @Field(type => Int, { nullable: true, defaultValue: 1 })
  @Min(1)
  page: number = 1;

  @Field(type => Int, { nullable: true, defaultValue: 10 })
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}

@Resolver((of) => Flight)
export default class FlightResolver {

    constructor() {
        console.log('FlightResolver constructor() ...')
    }

    @Query(() => [FlightPagination])
    async flights(
        @Ctx() ctx: Context,
        @Args() { pageSize, page, from, to, departureDay}: GetAllFlightsArgs
    ) {
        const db = ctx.db

        if (page < 1) page = 1
        const offset = (page - 1) * pageSize

        return Promise.all([
            db.count('* as count').from("flights").first(),
            Flight.getConnection().select().limit(pageSize).offset(offset)
        ]).then(([total, nodes]) => {
            return [{
                pagination: {
                    total: total.count,
                    pageSize,
                    page,
                },
                nodes,
            }]
        });
    }
    
    @Query(() => Flight)
    async flight(
        @Ctx() ctx: Context,
        @Arg('id') id: number
    ) {
        const flight = await Flight.getConnection().select('*').where('id', id).first()

        if (!flight) {
            throw new ApolloError('Flight not found')
        }

        return flight
    }   
    
    @FieldResolver()
    async departureAt(
        @Ctx() ctx: Context,
        @Root() flight: Flight,
    ) {
        return new Date(flight.departure_at)
    }

    @FieldResolver()
    async seatCount(
        @Ctx() ctx: Context,
        @Root() flight: Flight,
    ) {
        return flight.seat_count
    }

    @FieldResolver()
    async launchSite(
        @Ctx() ctx: Context,
        @Root() spaceCenter: SpaceCenter,
    ) {
        return await SpaceCenter.getConnection().select('*').where('id', spaceCenter.id).first()
    }
    
    @FieldResolver()
    async landingSite(
        @Ctx() ctx: Context,
        @Root() spaceCenter: SpaceCenter,
    ) {
        return await SpaceCenter.getConnection().select('*').where('id', spaceCenter.id).first()
    }

    @FieldResolver()
    async availableSeats(
        @Ctx() ctx: Context,
        @Root() flight: Flight,
    ) {
        
        const flightSeatsTotal = flight.seat_count

        const bookedSeats = await Booking.getConnection()
            .sum({total: 'seat_count'}).where('flight_id', flight.id).first()

        return flightSeatsTotal - bookedSeats?.total as number;
    }

    @Mutation(() => Flight)
    async scheduleFlight(
        @Ctx() ctx: Context,
        @Arg('flightInfo') flightInfo: ScheduleFlightInput,
    ) {
       
        return Promise.all([
            SpaceCenter.getConnection().select().where('id', flightInfo.launchSiteId).first(),
            SpaceCenter.getConnection().select().where('id', flightInfo.landingSiteId).first(),
        ]).then(async ([launchSite, landingSite]) => {

            if (!launchSite) {
                throw new ApolloError('Launch site not found')
            }
    
            if (!landingSite) {
                throw new ApolloError('Landing site not found')
            }

            const flight:Partial<Flight> = {
                ...(new Flight),
                code: uuidv4(),
                launchsite_id: launchSite.id,
                landingsite_id: landingSite.id,
                seat_count: flightInfo.seatCount,
                departure_at: new Date(flightInfo.departureAt.toString()),
            }
    
            const [result] = await Flight.getConnection().insert(flight).returning('id')
    
            flight.id = result.id;
    
            return flight;

        })
        
    }
}