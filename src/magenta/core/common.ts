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



export class EventArgs
{
  public static readonly Empty: EventArgs = new EventArgs();
}

export class CancelEventArgs extends EventArgs
{
  public Cancel: boolean;


  constructor(cancel: boolean = false)
  {
    super();

    this.Cancel = cancel;
  }
}


export class Event<T extends EventArgs>
{
  protected readonly Handlers: Array<(data: T) => void> = [];


  public Subscribe(handler: (data: T) => void): void
  {
    this.Handlers.push(handler);
  }

  public Unsubscribe(handler: (data: T) => void): void
  {
    this.Handlers.splice(this.Handlers.indexOf(handler), 1);
  }

  public UnsubscribeAll(): void
  {
    this.Handlers.length = 0;
  }

  public Trigger(data: T): void
  {
    this.Handlers.slice(0).forEach(handler => handler(data));
  }
}



export class EventAggregator
{
  protected Events: IDictionary<Event<any>> = {};


  public Register(name: string): void
  {
    if(this.Events.hasOwnProperty(name))
      throw new Error(`Duplicate event: ${name}.`);

    this.Events[name] = new Event<any>();
  }

  public Unregister(name: string): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].UnsubscribeAll();
    delete this.Events[name];
  }

  public Subscribe(name: string, handler: (data: any) => void): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].Subscribe(handler);
  }

  public Unsubscribe(name: string, handler: (data: any) => void): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].Unsubscribe(handler);
  }

  public Trigger(name: string, data: any): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].Trigger(data);
  }
}



export class CollectionItemAddedArgs<T> extends EventArgs
{
  public readonly AddedItem: T;


  constructor(item: T)
  {
    super();

    this.AddedItem = item;
  }
}


export class CollectionItemRemovedArgs<T> extends EventArgs
{
  public readonly RemovedItem: T;


  constructor(item: T)
  {
    super();

    this.RemovedItem = item;
  }
}


export class Collection<T>
{
  protected readonly Items: Array<T> = [];


  public get Count(): number
  {
    return this.Items.length;
  }

  public Item(index: number): T
  {
    if(index < 0 || index >= this.Items.length)
      throw new Error('Index out of range.');

    return this.Items[index];
  }

  public ToArray(): Array<T>
  {
    return this.Items.slice();
  }

  public Contains(item: T): boolean
  {
    return this.Items.indexOf(item) !== -1;
  }

  public Clear(): void
  {
    while(this.Items.length > 0)
      this.Remove(this.Items[0]);
  }

  public Add(item: T): void
  {
    this.Items.push(item);
    this.ItemAdded.Trigger(new CollectionItemAddedArgs(item));
  }

  public Insert(index: number, item: T): void
  {
    this.Items.splice(index, 0, item);
    this.ItemAdded.Trigger(new CollectionItemAddedArgs(item));
  }

  public Remove(item: T): void
  {
    const index = this.Items.indexOf(item);
    if(index !== -1)
    {
      this.Items.splice(index, 1);
      this.ItemRemoved.Trigger(new CollectionItemRemovedArgs(item));
    }
  }

  public RemoveAt(index: number): void
  {
    if(index < 0 || index >= this.Items.length)
      throw new Error('Index out of range.');

    const item = this.Items[index];
    this.Items.splice(index, 1);
    this.ItemRemoved.Trigger(new CollectionItemRemovedArgs(item));
  }

  public Set(index: number, item: T): void
  {
    if(index < 0 || index >= this.Items.length)
      throw new Error('Index out of range.');

    const old = this.Items[index];
    this.Items[index] = item;
    this.ItemRemoved.Trigger(new CollectionItemRemovedArgs(old));
    this.ItemAdded.Trigger(new CollectionItemAddedArgs(item));
  }

  public CopyTo(array: Array<T>, index: number): void
  {
    array.splice(index, 0, ...this.Items);
  }

  public readonly ItemAdded: Event<CollectionItemAddedArgs<T>> = new Event<CollectionItemAddedArgs<T>>();
  public readonly ItemRemoved: Event<CollectionItemRemovedArgs<T>> = new Event<CollectionItemRemovedArgs<T>>();
}
