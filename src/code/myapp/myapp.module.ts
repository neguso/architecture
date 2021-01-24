import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../magenta/core/core.module';
import { ArrayStore, DataService, ModelAction, ModelApplication } from '../../magenta/core';

import { MyApplication } from './application';
import { About, Book, Customer } from './data';
import { TestController } from './controllers';
//import { AboutViewController, MainController } from './controllers';


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
    //MainController, AboutViewController
    TestController
  ]
})
export class MyAppModule
{
  constructor(application: MyApplication, model: ModelApplication, dataService: DataService)
  {
    console.log(`Module ${this.constructor.name} created`);

    // module initialization
    //...

    // update application model
    this.UpdateApplicationModel(model, dataService);
  }


  public UpdateApplicationModel(model: ModelApplication, dataService: DataService): void
  {
    // Data Models //

    // About
    model.RegisterDataModel(About, { });
    model.RegisterDataModelMembers(About, {
      Title: { },
      Description: { },
      Logo: { }
    });
    dataService.RegisterStore(About, new ArrayStore<About>([
      { Id: '', Title: 'app title', Description: 'some app description', Logo: 'https://lh3.googleusercontent.com/ogw/ADGmqu_yMhxJnXXLDx2mQfoDzNGRPVVrxYsZ47yA9Jzlc-0=s32-c-mo' }
    ]));

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
    model.RegisterAction('hello', { Caption: 'Hello!', Container: 'about-actions' });
    model.RegisterAction('bye', { Caption: 'Bye Bye!', Container: 'about-actions' });

    const books = 'Books_ListView';
    model.RegisterListView(books, Book);
    model.RegisterListViewColumns(books, {
      Title: { },
      ISDN: { },
      Published: { }
    });


    // Navigation //

    model.RegisterNavigationItems(model.Navigation, [{ id: 'Main' }]);
    const navMain = model.Navigation.Items.find(e => e.Id === 'Main');
    if(typeof navMain !== 'undefined')
      model.RegisterNavigationItems(navMain, [
        { id: 'About', item: { View: 'About_DetailView' } },
        { id: 'Books', item: { View: 'Books_ListView', Path: ['books'] } }
      ]);

  }
}
