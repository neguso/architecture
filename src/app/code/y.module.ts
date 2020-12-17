import { NgModule } from '@angular/core';
import { AppFrameworkModule, IBaseObject, ModelApplication } from './app-framework.module';
import { Book, XModule } from './x.module';


@NgModule({
  declarations: [],
  imports: [AppFrameworkModule, XModule]
})
export class YModule
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
      'Name': { },
      'Address': { },
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
