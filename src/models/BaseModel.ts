
import database from '../database'

export default class BaseModel  {

   static entity:any;
   static table:string;

  static getConnection() {
    return database<typeof this.entity>(this.table);
  }

  save() {
    console.log(this)
  }
}