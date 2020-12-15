import { NgModule } from '@angular/core';
import { AppFrameworkModule, BaseObject, ModelApplication } from './app-framework.module';

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

  public UpdateApplicationModel(model: ModelApplication)
  {
    // update application model
    model.Title = 'My Application';
    model.Options.ProtectedContentText = '[Protected]';

    // create data model nodes
    model.RegisterDataModel(Book, { Caption: 'Book' });
    model.RegisterDataModelMembers(Book, {
      Title: { Caption: 'Book Title', Index: 0 },
      Description: { }
    });

    // create views
    //model.RegisterView();
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




