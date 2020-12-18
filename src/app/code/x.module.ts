import { Injectable, NgModule } from '@angular/core';
import { AppFrameworkModule, BaseObject, ModelApplication, FieldType, ModelDataModelMember, IBaseObject } from './app-framework.module';


@NgModule({
  declarations: [],
  imports: [AppFrameworkModule]
})
export class XModule
{
  constructor(model: ModelApplication)
  {
    // module initialization
    //...

    // update application model
    this.UpdateApplicationModel(model);

    // tests
    model.DataModels['Book'].Index = 0;
  }

  public UpdateApplicationModel(model: ModelApplication): void
  {
    // update application model
    model.Title = 'My Application';
    model.Options.ProtectedContentText = '[Protected]';

    // create data model nodes
    model.RegisterDataModel(Book, { Caption: 'Book' });
    model.RegisterDataModelMembers(Book, {
      Title: { Type: FieldType.String, Caption: 'Book Title', Index: 0 },
      Description: { Type: FieldType.String, AllowNull: true }
    });
    model.DataModels['Book'].Members['aa'] = new ModelDataModelMember(model, 'a');

    // create a list view
    model.RegisterListView('Books_ListView', Book, {
      Caption: 'Books List'
    });
    model.RegisterListViewColumns('Books_ListView', {
      Title: { Index: 1, Caption: 'The Title' },
      Description: { Index: 2, Caption: 'Short description' }
    });

    // create a detail view
    model.RegisterDetailView('Book_DetailView', Book, {
      Caption: 'View Book'
    });
    model.RegisterDetailViewItems('Book_DetailView', {
      Title: { Caption: 'Input Title' },
      Description: { MaxLength: 100 }
    });


  }
}



export class Book extends BaseObject
{
  public Title: string;
  public Description: string | null;


  constructor(id: string, title: string, description: string | null = null)
  {
    super(id);

    this.Title = title;
    this.Description = description;
  }
}




export abstract class DataStore<T extends IBaseObject>
{
  public abstract Get(key: string): Promise<T | null>;
  public abstract Load(options?: LoadOptions): Promise<Array<T>>;
  public abstract Insert(item: T): Promise<T>;
  public abstract Update(key: string, item: T): Promise<T | null>;
  public abstract Remove(key: string): Promise<number>;
  public abstract Count(options?: CountOptions): Promise<number>;
}


export interface ILoadOptions
{
  Search?: string;
  Skip?: number;
  Take?: number;
}


class LoadOptions implements ILoadOptions
{
  public Search: string = '';
  public Skip: number = 0;
  public Take: number = 0;


  constructor(init: ILoadOptions)
  {
    Object.assign(this, init);
  }
}

class CountOptions
{
  public Filter: any;
}



export class ArrayStore<T extends IBaseObject> extends DataStore<T>
{
  public Data: Array<T> = [];


  constructor(data?: Array<T>)
  {
    super();

    if(typeof data !== 'undefined')
      this.Data = data;
  }


  public Get(key: string): Promise<T | null>
  {
    return new Promise<T | null>((resolve, reject) => { resolve(this.Data.find(value => value.Id === key) ?? null); });
  }

  public Load(options?: ILoadOptions): Promise<Array<T>>
  {
    if(typeof options === 'undefined')
      return new Promise<Array<T>>((resolve, reject) => { resolve(this.Data); });

    let items = this.Data;

    items = this.Search(items, options.Search ?? '');
    items = this.Paging(items, options.Skip ?? 0, options.Take ?? 0);

    return new Promise<Array<T>>((resolve, reject) => { resolve(items); });
  }

  public Insert(item: T): Promise<T>
  {
    return new Promise<T>((resolve, reject) => {
      this.Data.push(item);
      resolve(item);
    });
  }

  public Update(key: string, item: T): Promise<T | null>
  {
    return new Promise<T | null>((resolve, reject) => {
      const i = this.Data.findIndex(value => value.Id === key);
      if(i === -1)
      {
        resolve(null);
        return;
      }

      this.Data.splice(i, 1, item);
      resolve(item);
    });
  }

  public Remove(key: string): Promise<number>
  {
    return new Promise<number>((resolve, reject) => {
      const i = this.Data.findIndex(value => value.Id === key);
      if(i === -1)
      {
        resolve(0);
        return;
      }

      resolve(this.Data.splice(i, 1).length);
    });
  }

  public Count(options?: CountOptions): Promise<number>
  {
    return new Promise<number>((resolve, reject) => { resolve(this.Data.length); });
  }


  protected Search(array: Array<T>, text: string): Array<T>
  {
    return array;
  }

  protected Paging(array: Array<T>, skip: number, take: number): Array<T>
  {
    return array.slice(skip, take === 0 ? array.length : Math.min(skip + take, array.length));
  }
}


@Injectable({ providedIn: 'root' })
export class BooksDataStore extends ArrayStore<Book>
{

  protected Search(array: Array<Book>, text: string): Array<Book>
  {
    return array.filter(e => e.Title.indexOf(text) !== -1 || (e.Description !== null && e.Description.indexOf(text) !== -1));
  }
}








