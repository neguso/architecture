import { NgModule } from '@angular/core';
import { CoreModule } from '../magenta/core/core.module';
import { IBaseObject, ModelApplication } from '../magenta/core';
import { Book, Test1Module } from './test1.module';


@NgModule({
  declarations: [],
  imports: [CoreModule, Test1Module]
})
export class Test2Module
{
  constructor(model: ModelApplication)
  {
    // module initialization
    //...

    // update application model
    this.UpdateApplicationModel(model);
  }

  public UpdateApplicationModel(model: ModelApplication): void
  {
    model.RegisterDataModel(Library, { });
    model.RegisterDataModelMembers(Library, {
      Name: { },
      Address: { }
    });

    model.RegisterListView('Library-List', Library, { });
    model.RegisterListViewColumns('Library-List', {
      Name: { },
      Address: { },
    });
    //model.Views['Library-List'].Caption;
  }
}



export class Library implements IBaseObject
{
  public Id: string;
  public Name: string;
  public Address: string | null;
  public Books: Array<Book> = [];


  constructor(id: string, name: string, address: string | null = null)
  {
    this.Id = id;
    this.Name = name;
    this.Address = address;
  }
}
