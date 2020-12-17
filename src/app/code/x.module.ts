import { NgModule } from '@angular/core';
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

  public abstract Load(options?: LoadOptions): Promise<Array<T>>;

}


export class LoadOptions
{
  public Search: string | null = null;
  public Skip: number = 0;
  public Take: number = 20;

  public FilterPredicate(search: string): boolean
  {
    return true;
  }
}




export class ArrayStore<T extends IBaseObject> extends DataStore<T>
{
  public Data: Array<T> = [];

  public Load(options?: LoadOptions): Promise<Array<T>>
  {
    if(typeof options === 'undefined')
    {
      return new Promise<Array<T>>((resolve, reject) => {
        resolve(this.Data);
      });
    }
    else
    {
      //this.Data.filter(e => e.)

      return new Promise<Array<T>>((resolve, reject) => {
        resolve(this.Data);
      });
    }
  }


}


export class BooksDataStore extends ArrayStore<Book>
{

  public Load(): Promise<Array<Book>>
  {
    throw '';
  }
}


