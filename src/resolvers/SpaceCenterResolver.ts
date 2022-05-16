import { Context } from 'mocha'
import { Arg, Args, ArgsType, Query, Resolver, Field, Int, FieldResolver, Root, Ctx } from 'type-graphql'
import SpaceCenter, { SpaceCenterPagination, SpaceCenterStatistic } from '../models/SpaceCenter';
import Planet from '../models/Planet';
import { Min, Max } from 'class-validator';

@ArgsType()
class GetAllSpaceCentersArgs {
  @Field(type => Int, { nullable: true, defaultValue: 1 })
  @Min(1)
  page: number = 1;

  @Field(type => Int, { nullable: true, defaultValue: 10 })
  @Min(1)
  @Max(100)
  pageSize: number = 10;
}

@Resolver((of) => SpaceCenter)
export default class SpaceCenterResolver {

    @Query(returns => [SpaceCenterPagination])
    async spaceCenters(
        @Ctx() ctx: Context,
        @Args() {page, pageSize}: GetAllSpaceCentersArgs
    ) {
        const db = ctx.db

        if (page < 1) page = 1
        const offset = (page - 1) * pageSize

        return Promise.all([
            db.count('* as count').from("space_centers").first(),
            SpaceCenter.getConnection().select().limit(pageSize).offset(offset)
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

    @FieldResolver()
    async statistics(
        @Root() spaceCenter: SpaceCenter,
    ):Promise<SpaceCenterStatistic> {

        const averageWeeklyFlightCount = 0
        const dailyFilingRatePerWeekDay = 0

        return {
            averageWeeklyFlightCount,
            dailyFilingRatePerWeekDay
        }
    }

    @FieldResolver()
    async planet(
        @Root() spaceCenter: SpaceCenter,
    ) {
        return await Planet.getConnection().select('*').where('code', spaceCenter.planet_code).first()
    }

    @Query(() => SpaceCenter)
    async spaceCenter(
        @Arg('id', {nullable: true}) id?: number,
        @Arg('uid', {nullable: true}) uid?: string
    ) {

        const query = SpaceCenter.getConnection().select('*');

        if (id && id > 0)
            return await query.where('id', id).first()
        else 
            return await query.where('uid', uid).first()
    }   
    
}
