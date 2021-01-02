import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppFrameworkModule } from './app-framework.module';
import { ArrayStore, BaseObject, ModelApplication } from './core';


/**
 * Module to create a simple web app with a dashboard, list views and detail views.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppFrameworkModule
  ]
})
export class ZModule
{
  constructor(model: ModelApplication)
  {
    console.log(`Module ${this.constructor.name} created`);

    // module initialization
    //...

    // update application model
    this.UpdateApplicationModel(model);
  }


  public UpdateApplicationModel(model: ModelApplication): void
  {
    // data models
    model.RegisterDataModel(About, { });
    model.RegisterDataModelMembers(About, {
      Title: { },
      Description: { }
    });

    // view models
    model.RegisterDetailView('About_DetailView', About, { });
    model.RegisterStaticTextItem('About_DetailView', 'Title', { });
    model.RegisterStaticTextItem('About_DetailView', 'Description', { });


  }
}





export class About extends BaseObject
{
  public Title: string;
  public Description: string;

  constructor(id: string, title: string = '', description: string = '')
  {
    super(id);

    this.Title = title;
    this.Description = description;
  }
}


export class AboutDataStore extends ArrayStore<About>
{
  constructor()
  {
    super([new About('', 'this is title', 'this is description')]);
  }
}
