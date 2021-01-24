import { Injectable, Type } from '@angular/core';

import { IDictionary } from './common';
import { Event, EventArgs } from './core';


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




type BinaryOp = '=' | '<>' | '>' | '>=' | '<' | '<=' | 'startswith' | 'endswith' | 'contains' | 'isblank';
type UnaryOp = '!';
type LogicalOp = 'and' | 'or';
type EmptyExpression = [];
type BinaryExpression = [string, BinaryOp, null | boolean | number | string | Date];
type UnaryExpression = [UnaryOp, LogicalExpression];
type LogicalExpression =
  EmptyExpression
  | UnaryExpression
  | BinaryExpression
  | [LogicalExpression, LogicalOp, LogicalExpression]
  | [LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression]
  | [LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression]
  | [LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression]
  | [LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression, LogicalOp, LogicalExpression];



export interface ILoadOptions
{
  Filter?: LogicalExpression;
  Skip?: number;
  Take?: number;
  Sort?: Array<ISortExpression>;
}

export class LoadOptions implements ILoadOptions
{
  public Filter: LogicalExpression = [];
  public Skip: number = 0;
  public Take: number = 0;
  public Sort: Array<ISortExpression> = [];


  constructor(init: ILoadOptions)
  {
    Object.assign(this, init);
  }
}


export interface ICountOptions
{
  Filter: any;
}

export class CountOptions implements ICountOptions
{
  public Filter: any;
}


export interface ISortExpression
{
  Field: string;
  Descending: boolean;
}


export class SortExpression implements ISortExpression
{
  public Field: string;
  public Descending: boolean;


  constructor(field: string, descending: boolean = false)
  {
    this.Field = field;
    this.Descending = descending;
  }
}



export abstract class DataStore<T extends IBaseObject>
{
  public abstract Get(key: string): Promise<T | null>;
  public abstract Load(options?: ILoadOptions): Promise<Array<T>>;
  public abstract Insert(item: T): Promise<T>;
  public abstract Update(key: string, item: T): Promise<T | null>;
  public abstract Remove(key: string): Promise<number>;
  public abstract Count(options?: ICountOptions): Promise<number>;
}



export class ArrayStore<T extends IBaseObject> extends DataStore<T>
{
  public readonly Data: Array<T> = [];


  constructor(data?: Array<T>)
  {
    super();

    if(typeof data !== 'undefined')
      this.Data = data;
  }


  public async Get(key: string): Promise<T | null>
  {
    return this.Data.find(e => e.Id === key) ?? null;
  }

  public async Load(options?: ILoadOptions): Promise<Array<T>>
  {
    if(typeof options === 'undefined')
      return this.Data;

    let items = this.Data;

    items = this.Filter(items, options.Filter ?? []);
    items = this.Sort(items, options.Sort ?? []);
    items = this.Slice(items, options.Skip ?? 0, options.Take ?? 0);

    return items;
  }

  public async Insert(item: T): Promise<T>
  {
    if(this.Data.findIndex(e => e.Id === item.Id))
      throw new Error('Duplicate primary key.');

    this.Data.push(item);
    return item;
  }

  public async Update(key: string, item: T): Promise<T | null>
  {
    const i = this.Data.findIndex(e => e.Id === key);
    if(i === -1)
      return null;

    this.Data.splice(i, 1, item);
    return item;
}

  public async Remove(key: string): Promise<number>
  {
    const i = this.Data.findIndex(e => e.Id === key);
    if(i === -1)
      return 0;

    return this.Data.splice(i, 1).length;
  }

  public async Count(options?: ICountOptions): Promise<number>
  {
    if(typeof options === 'undefined')
      return this.Data.length;
    return (await this.Load({ Filter: options.Filter })).length;
  }


  protected Filter(array: Array<T>, filter: LogicalExpression): Array<T>
  {
    if(filter.length === 0)
      return array;
    else
    {
      const expr = this.Compile(filter);
      console.log(expr);
      return eval('array.filter(object => ' + expr + ')');
    }
  }

  protected Sort(array: Array<T>, fields: Array<ISortExpression>): Array<T>
  {
    if(fields.length === 0)
      return array;

    return array.sort((a, b) => {
      for(const field of fields)
      {
        if(a[field.Field] < b[field.Field])
          return field.Descending ? 1 : -1;
        else if(a[field.Field] > b[field.Field])
          return field.Descending ? -1 : 1;
      }
      return 0;
    });
  }

  protected Slice(array: Array<T>, skip: number, take: number): Array<T>
  {
    return array.slice(skip, take === 0 ? array.length : skip + take);
  }


  protected IsUnaryOperator(value: string): boolean
  {
    return ['!'].indexOf(value) !== -1;
  }

  protected Compile(expr: LogicalExpression): string
  {
    if(typeof expr[0] === 'string')
    {
      if(this.IsUnaryOperator(expr[0]))
        return this.UnaryExpr(expr as UnaryExpression);
      else
        return this.BinaryExpr(expr as BinaryExpression);
    }
    else
      return this.LogicalExpr(expr);
  }

  protected BinaryExpr(expr: BinaryExpression): string
  {
    const map: any = { '=': '==', '<>': '!=', '>': '>', '>=': '>=', '<': '<', '<=': '<=' };
    switch(expr[1])
    {
      case 'startswith': return `(${this.FieldExpr(expr[0])} && ${this.FieldExpr(expr[0])}.startsWith(${this.ValueExpr(expr[2])}))`;
      case 'endswith': return `(${this.FieldExpr(expr[0])} && ${this.FieldExpr(expr[0])}.endsWith(${this.ValueExpr(expr[2])}))`;
      case 'contains': return `(${this.FieldExpr(expr[0])} && ${this.FieldExpr(expr[0])}.indexOf(${this.ValueExpr(expr[2])}) !== -1)`;
      case 'isblank': return `(${this.FieldExpr(expr[0])} && ${this.FieldExpr(expr[0])}.trim().length === 0)`;
      default: return `(${this.FieldExpr(expr[0])} ${map[expr[1] as string]} ${this.ValueExpr(expr[2])})`;
    }
  }

  protected UnaryExpr(expr: UnaryExpression): string
  {
    return `${expr[0]}${this.Compile(expr[1])}`;
  }

  protected FieldExpr(field: string): string
  {
    return `object.${field}`;
  }

  protected ValueExpr(value: null | boolean | number | string | Date): string
  {
    if(value === null)
      return 'null';
    if(typeof value === 'string')
      return `'${value}'`;
    return value.toString();
  }

  protected IsLogicalOperator(value: string): boolean
  {
    return ['and', 'or'].indexOf(value) !== -1;
  }

  protected LogicalExpr(expr: LogicalExpression): string
  {
    const map: any = { or: '||', and: '&&' };
    return '(' + (expr as []).map(el => {
      if(this.IsLogicalOperator(el))
        return ` ${map[el]} `;
      else
        return this.Compile(el);
    }).join('') + ')';
  }
}



//export class MapStore<T extends IBaseObject> extends DataStore<T> {}



export class LocalStore<T extends IBaseObject> extends DataStore<T>
{
  public Get(key: string): Promise<T | null> {
    throw new Error('Method not implemented.');
  }
  public Load(options?: ILoadOptions): Promise<T[]> {
    throw new Error('Method not implemented.');
  }
  public Insert(item: T): Promise<T> {
    throw new Error('Method not implemented.');
  }
  public Update(key: string, item: T): Promise<T | null> {
    throw new Error('Method not implemented.');
  }
  public Remove(key: string): Promise<number> {
    throw new Error('Method not implemented.');
  }
  public Count(options?: ICountOptions): Promise<number> {
    throw new Error('Method not implemented.');
  }
}






@Injectable({ providedIn: 'root' })
export abstract class DataService
{
  protected Stores: IDictionary<DataStore<BaseObject>> = {};


  public RegisterStore(type: Type<IBaseObject>, store: DataStore<IBaseObject>): void
  {
    this.Stores[type.constructor.name] = store;
  }

  public UnregisterStore(type: Type<IBaseObject>): void
  {
    if(this.Stores.hasOwnProperty(type.constructor.name))
      delete this.Stores[type.constructor.name];
  }

  public GetStore<T extends IBaseObject>(type: Type<IBaseObject>): DataStore<T> | null
  {
    if(this.Stores.hasOwnProperty(type.constructor.name))
      return this.Stores[type.constructor.name] as DataStore<T>;
    return null;
  }
}




export class DataSourceLoadingErrorArgs extends EventArgs
{
  public Error: any;


  constructor(error: any)
  {
    super();

    this.Error = error;
  }
}


export class DataSource<T extends IBaseObject>
{
  protected DataStore: DataStore<T>;


  public readonly Items: Array<T> = [];
  public Filter: LogicalExpression = [];
  public Skip: number = 0;
  public Take: number = 10;
  public Sort: Array<ISortExpression> = [];
  public TotalCount: number = 0;
  public RequireTotalCount: boolean = true;

  public readonly Loading: Event<EventArgs> = new Event<EventArgs>();
  public readonly Loaded: Event<EventArgs> = new Event<EventArgs>();
  public readonly LoadingError: Event<DataSourceLoadingErrorArgs> = new Event<DataSourceLoadingErrorArgs>();


  constructor(dataStore: DataStore<T>)
  {
    this.DataStore = dataStore;
  }


  public async Load(): Promise<void>
  {
    try
    {
      this.Loading.Trigger(EventArgs.Empty);

      const items = await this.DataStore.Load({ Filter: this.Filter, Skip: this.Skip, Take: this.Take });
      this.Items.splice(0, this.Items.length, ...items);
      if(this.RequireTotalCount)
        this.TotalCount = await this.DataStore.Count({ Filter: [] });

      this.Loaded.Trigger(EventArgs.Empty);
    }
    catch(error)
    {
      this.LoadingError.Trigger(new DataSourceLoadingErrorArgs(error));
    }
  }

}
