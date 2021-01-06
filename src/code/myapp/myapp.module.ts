import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../magenta/core/core.module';
import { ModelAction, ModelApplication } from '../../magenta/core';

import { MyApplication } from './application';
import { About, Customer } from './data';
import { MainController } from './controllers';


/**
 * Module to create a simple test application.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule
  ],
  providers: [
    MainController
  ]
})
export class MyAppModule
{
  constructor(application: MyApplication, model: ModelApplication)
  {
    console.log(`Module ${this.constructor.name} created`);

    // module initialization
    //...

    // update application model
    this.UpdateApplicationModel(model);
  }


  public UpdateApplicationModel(model: ModelApplication): void
  {
    // data models //

    // About
    model.RegisterDataModel(About, { });
    model.RegisterDataModelMembers(About, {
      Title: { },
      Description: { },
      Logo: { }
    });

    // Customer
    model.RegisterDataModel(Customer, { });
    model.RegisterDataModelMembers(Customer, {
      Name: { },
      Address: { MaxLength: 100, AllowNull: true },
      NoOfEmployees: { Type: Number },
      Limited: { Type: Boolean },
      Created: { Type: Date }
    });

    // Views, Actions //

    const about = 'About_DetailView';
    model.RegisterDetailView(about, About);
    model.RegisterStaticTextItem(about, 'Title', { Caption: 'The Title' });
    model.RegisterStaticTextItem(about, 'Description');
    model.RegisterStaticImageItem(about, 'Logo');
    model.RegisterActionsContainerItem(about, 'about-actions');

    // actions models are optional
    model.Actions['hello'] = new ModelAction(model, 'hello', { Caption: 'Say Hello', Container: 'about-actions' });
    model.Actions['bye'] = new ModelAction(model, 'byw', { Caption: 'Say Bye Bye', Container: 'about-actions' });

    const customers = 'Customers_ListView';
    model.RegisterListView(customers, Customer);
    //model.RegisterListViewColumns();


    const customer = 'Customer_DetailView';
    //TODO


    // Navigation //

    model.RegisterNavigationItems(model.Navigation, [{ id: 'Main' }]);
    const navMain = model.Navigation.Items.find(e => e.Id === 'Main');
    if(typeof navMain !== 'undefined')
      model.RegisterNavigationItems(navMain, [
      { id: 'About', item: { View: 'About_DetailView' } },
      { id: 'Customers', item: { View: 'Customers_ListView' } }
    ]);

  }
}








