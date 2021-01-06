
export interface IBaseObject
{
  Id: string;
  [key: string]: any;
}


export abstract class BaseObject implements IBaseObject
{
  public Id: string;


  public constructor(id: string = '')
  {
    this.Id = id;
  }
}
