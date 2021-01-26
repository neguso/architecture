import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../magenta/core';
import { ArrayStore, ColumnSortOrder, DataService, ModelAction, ModelApplication } from '../../magenta/core';

import { MyApplication } from './application';
import { About, Book, Customer, Library, MainModel } from './data';
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
    model.RegisterDataModel(About);
    model.RegisterDataModelMembers(About, {
      Title: { },
      Description: { },
      Logo: { }
    });
    dataService.RegisterStore(About, new ArrayStore<About>([
      { Id: '0', Title: 'app title', Description: 'some app description', Logo: 'https://lh3.googleusercontent.com/ogw/ADGmqu_yMhxJnXXLDx2mQfoDzNGRPVVrxYsZ47yA9Jzlc-0=s32-c-mo' }
    ]));

    // Library
    model.RegisterDataModel(Library);
    model.RegisterDataModelMembers(Library, {
      Name: { }
    });

    // Book
    model.RegisterDataModel(Book, { Caption: 'Book' });
    model.RegisterDataModelMembers(Book, {
      Title: { Type: String, Caption: 'Book Title', Index: 0 },
      Description: { Type: String, AllowNull: true },
      ISDN: {},
      Published: {},
      Copies: {},
      FirstEdition: {},
      LibraryId: {}
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
    //
    model.RegisterAction('hello', { Caption: 'Hello!', Container: 'about-actions' });
    model.RegisterAction('bye', { Caption: 'Bye Bye!', Container: 'about-actions' });

    const main = 'Main_DetailView';
    model.RegisterDetailView(main, MainModel);

    const books = 'Books_ListView';
    model.RegisterListView(books, Book);
    model.RegisterStaticTextColumn(books, 'Title', { SortIndex: 0, SortOrder: ColumnSortOrder.Ascending });
    model.RegisterStaticTextColumn(books, 'ISDN');
    model.RegisterStaticTextColumn(books, 'Published');
    model.RegisterStaticTextColumn(books, 'Copies');
    model.RegisterStaticTextColumn(books, 'FirstEdition');

    const libraries = 'Libraries_ListView';
    model.RegisterListView(libraries, Library);
    //...

    // Navigation //

    model.RegisterNavigationItems(model.Navigation, [{ id: 'Main' }]);
    const navMain = model.Navigation.Items.find(e => e.Id === 'Main');
    if(typeof navMain !== 'undefined')
      model.RegisterNavigationItems(navMain, [
        { id: 'About', item: { View: 'About_DetailView', Path: ['about'] } },
        { id: 'Books', item: { View: 'Books_ListView', Path: ['books'] } },
        { id: 'Libraries', item: { View: 'Libraries_ListView', Path: ['libraries'] } }
      ]);

  }
}
