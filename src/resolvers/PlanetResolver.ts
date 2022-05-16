import { ApolloError } from 'apollo-server'
import { Max } from 'class-validator';
import { Context } from 'mocha'
import { Arg, Args, ArgsType, Query, Resolver, Ctx, FieldResolver, Root, Field } from 'type-graphql'
import Planet from '../models/Planet'
import SpaceCenter from '../models/SpaceCenter';

@ArgsType()
class GetPlanetArgs {
    @Field({defaultValue: 5})
    @Max(10)
    limit: number
}

@Resolver((of) => Planet)
export default class PlanetResolver {

    @Query(returns => [Planet])
    async planets(
        @Ctx() ctx: Context,
        @Args() {limit}: GetPlanetArgs,
    ) {
        return await Planet.getConnection().select('*').whereRaw('id > 0');
    }
    
    @Query(() => Planet)
    async planet(@Arg('id') id: number) {
        return await Planet.getConnection().select('*').where('id', id).first()
    }

    @FieldResolver()
    async spaceCenters(
        @Root() planet: Planet,
        @Arg('limit') limit: number = 5
    ) {

        //@TODO: add pagination support
        //@TODO: Returns a paginated list of space centers.

        /**
        arguments:
        page: page index (starting at 1) (default: 1, min: 1).
        pageSize: number of items returned per page (default: 10, min: 1, max: 100). 
         */

        if (limit > 10) {
            throw new ApolloError('Max limit exceeded, allowed is 10');
        }

        return await SpaceCenter.getConnection().select('*').where('planet_code', planet.code ).limit(limit)
    }
}