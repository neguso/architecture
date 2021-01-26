import { Type } from '@angular/core';



export interface IDictionary<T>
{
  [key: string]: T;
}



export class Utils
{
  public static Extends(derived: Type<any>, base: Type<any>): boolean
  {
    return derived === base || derived.prototype instanceof base;
  }
}
