import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreModule } from '../../magenta/core';
import { ArrayStore, ColumnSortOrder, DataService, ModelAction, ModelApplication } from '../../magenta/core';

import { MyApplication } from './application';
import { About, Book, booksdata, Customer, librariesdata, Library, MainModel } from './data';
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
    //
    dataService.RegisterStore(About, new ArrayStore<About>([
      { Id: '0', Title: 'app title', Description: 'some app description', Logo: 'https://lh3.googleusercontent.com/ogw/ADGmqu_yMhxJnXXLDx2mQfoDzNGRPVVrxYsZ47yA9Jzlc-0=s32-c-mo' }
    ]));

    // Library
    model.RegisterDataModel(Library);
    model.RegisterDataModelMembers(Library, {
      Name: { }
    });
    dataService.RegisterStore(Library, new ArrayStore<Library>(librariesdata));

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
    //
    dataService.RegisterStore(Book, new ArrayStore<Book>(booksdata));

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
    model.RegisterStaticTextColumn(books, 'Title', { Index: 0, SortIndex: 0, SortOrder: ColumnSortOrder.Ascending });
    model.RegisterStaticTextColumn(books, 'ISDN', { Index: 2 });
    model.RegisterStaticTextColumn(books, 'Published', { Index: 1 });
    model.RegisterStaticTextColumn(books, 'Copies', { Index: 3 });
    model.RegisterStaticTextColumn(books, 'First Edition', { Index: 4 });

    model.RegisterAction('google', { Caption: 'Google', Container: 'listview-actions' });
    model.RegisterAction('search', { Caption: 'Search', Container: 'listview-actions' });

    const libraries = 'Libraries_ListView';
    model.RegisterListView(libraries, Library);
    //...

    // Navigation //

    model.RegisterNavigationItems(model.Navigation, [{ id: 'Main' }]);
    const navMain = model.Navigation.Items.find(e => e.Id === 'Main');
    if(typeof navMain !== 'undefined')
      model.RegisterNavigationItems(navMain, [
        { id: 'Books', item: { View: 'Books_ListView', Path: ['books'] } },
        { id: 'Libraries', item: { View: 'Libraries_ListView', Path: ['libraries'] } }
      ]);
    model.RegisterNavigationItems(model.Navigation, [{ id: 'Administration' }]);
    const navAdmin = model.Navigation.Items.find(e => e.Id === 'Administration');
    if(typeof navAdmin !== 'undefined')
    model.RegisterNavigationItems(navAdmin, [
      { id: 'About', item: { View: 'About_DetailView', Path: ['about'] } }
    ]);
  }
}
