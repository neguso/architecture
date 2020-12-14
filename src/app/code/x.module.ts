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
    //TODO: initialize module

    // create data model node
    model.RegisterDataModel(Book, { Index: 0, Caption: 'Book' });

    // update data model


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




