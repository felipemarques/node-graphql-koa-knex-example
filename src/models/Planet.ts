import { MaxLength } from 'class-validator';
import { Field, ObjectType, Int } from 'type-graphql'
import { PlanetType } from '../types/PlanetType'
import BaseModel from './BaseModel'
import SpaceCenter from './SpaceCenter';

@ObjectType()
export default class Planet extends BaseModel implements PlanetType {

  static entity:any = Planet;
  static table:string = 'planets';

  @Field(type => Int)
  id!: number

  @Field({nullable: false})
  name!: string

  @Field({nullable: false})
  @MaxLength(3)
  code!: string

  @Field(type => [SpaceCenter])
  spaceCenters: SpaceCenter[]

}