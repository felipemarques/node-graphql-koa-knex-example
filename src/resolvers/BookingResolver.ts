import { ApolloError } from 'apollo-server-koa';
import { Max, Min, IsEmail, isEmail } from 'class-validator';
import { Context } from 'mocha'
import { Arg, Args, ArgsType, Query, Resolver, Ctx, Field, FieldResolver, Int, Mutation, InputType, Root } from 'type-graphql'
import Booking, { BookingPagination } from '../models/Booking';
import Flight from '../models/Flight';

@ArgsType()
class GetAllBookingsArgs {

  @Field({nullable: true})
  @IsEmail()
  email?: string

  @Field(type => Int, { nullable: true, defaultValue: 1 })
  @Min(1)
  page: number = 1

  @Field(type => Int, { nullable: true, defaultValue: 10 })
  @Min(1)
  @Max(100)
  pageSize: number = 10
}

@InputType()
export class BookFlightInput {
    @Field(type => Int, {defaultValue: 0})
    flightId: number

    @Field()
    @IsEmail()
    email: string

    @Field(type => Int, {defaultValue: 0})
    seatCount: number
}

@Resolver((of) => Booking)
export default class BookingResolver {

    constructor(){
        console.log('BookingResolver constructor ...')
    }

    @Query(returns => [BookingPagination])
    async bookings(
        @Ctx() ctx: Context,
        @Args() {email, page, pageSize}: GetAllBookingsArgs
    ) {
        const db = ctx.db

        if (page < 1) page = 1
        const offset = (page - 1) * pageSize

        const query = Booking.getConnection().select().limit(pageSize).offset(offset);
        const queryCount = db.count('* as count').from(Booking.table)

        if (email && isEmail(email)) {
            query.where('email', email)
            queryCount.where('email', email)
        }

        return Promise.all([
            queryCount.first(),
            query
        ]).then(async ([total, nodes]) => {

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

    @Query(() => Booking)
    async booking(
        @Ctx() ctx: Context,
        @Arg('id') id: number
    ) {
        return await Booking.getConnection().select().where('id', id).first()
    }

    @FieldResolver()
    async flight(
        @Root() booking: Booking,
    ) {
        return await Flight.getConnection().select().where('id', booking.flight_id).first()
    }

    @FieldResolver()
    async seatCount(
        @Root() booking: Booking,
    ) {
        return booking.seat_count
    }

    @FieldResolver()
    async availableSeats(
        @Root() booking: Booking,
    ) {
        return 123
    }

    @Mutation(() => Booking)
    async bookFlight(
        @Ctx() ctx: Context,
        @Arg('bookingInfo') bookingInfo: BookFlightInput,
    ) {
        
        const flight = await Flight.getConnection()
            .select().where('id', bookingInfo.flightId).first()

        if (!flight) {
            throw new ApolloError('Flight not found')
        }

        const booking:Partial<Booking> = {
            ...(new Booking),
            flight_id: flight.id,
            seat_count: bookingInfo.seatCount,
            email: bookingInfo.email,
        }

        const [result] = await Booking.getConnection().insert(booking).returning('id')
        booking.id = result.id as number;
        booking.flight = flight;

        return booking;
    }    
}