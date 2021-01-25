import { Inject, Injectable, NgModule } from '@angular/core';

import {
  Event,
  BaseObject,
  ModelApplication,
  ModelDataModelMember,
  Controller,
  ComponentController,
  ControllerManager,
  IComponent,
  IController,
  ActionBase,
  ArrayStore,
  StateManager,
  BoolList,
  EventArgs
} from '../magenta/core';
import { BooksComponent } from '../app/books/books.component';
import { CoreModule } from '../magenta/core/core.module';


@NgModule({
  declarations: [],
  imports: [CoreModule]
})
export class Test1Module
{
  constructor(model: ModelApplication)
  {
    // module initialization
    //...

    // update application model
    //this.UpdateApplicationModel(model);


    const libraries = new ArrayStore<Library>(librariesdata);
    const books = new ArrayStore<Book>(booksdata);

    const s = Date.now();
    books.Load({ Filter: ['ISDN', 'contains', '0'], Sort: [ { Field: 'Title', Descending: false }, { Field: 'Description', Descending: true } ] })
      .then(data => {
        const e = Date.now();
        console.log(`${data.length} items loaded in: ${e - s}ms`);
        data.forEach((book, index) => console.log(`${book.Id}`));
      });
  }

  public UpdateApplicationModel(model: ModelApplication): void
  {
    // update application model
    model.Title = 'My Application';
    model.Options.ProtectedContentText = '[Protected]';

    // create data model nodes
    model.RegisterDataModel(Book, { Caption: 'Book' });
    model.RegisterDataModelMembers(Book, {
      Title: { Type: String, Caption: 'Book Title', Index: 0 },
      Description: { Type: String, AllowNull: true }
    });
    model.DataModels['Book'].Members['ISDN'] = new ModelDataModelMember(model, 'ISDN');

    // create a list view
    model.RegisterListView('Books_ListView', Book, {
      Caption: 'Books List'
    });
    model.RegisterStaticTextColumn('Books_ListView', 'Title', { Index: 1, Caption: 'The Title' });
    model.RegisterStaticTextColumn('Books_ListView', 'Description', { Index: 2, Caption: 'Short description' });

    // create a detail view
    model.RegisterDetailView('Book_DetailView', Book, {
      Caption: 'View Book'
    });
    // model.RegisterDetailViewItems('Book_DetailView', {
    //   Title: { Caption: 'Input Title' },
    //   Description: { MaxLength: 100 }
    // });


  }
}



export class Book extends BaseObject
{
  public Title: string;
  public Description: string | null = null;
  public ISDN: string | null = null;
  public Published: Date | null = null;
  public Copies: number = 0;
  public FirstEdition: boolean = false;
  //
  public LibraryId: string;
  public Library?: Library;


  constructor(id: string, title: string, libraryId: string)
  {
    super(id);

    this.Title = title;
    this.LibraryId = libraryId;
  }
}

export class Library extends BaseObject
{
  public Name: string;
  //
  public Books?: Array<Book>;


  constructor(id: string, name: string)
  {
    super(id);

    this.Name = name;
  }
}



const librariesdata: Array<Library> = [
  { Id: '1', Name: 'library 1' },
  { Id: '2', Name: 'library 2' },
  { Id: '3', Name: 'library 3' }
];

const booksdata: Array<Book> = [
  { Id: '01', Title: 'book 2', Description: 'alpha', ISDN: '001', Published: new Date('2020-01-01'), Copies: 1234567, FirstEdition: true, LibraryId: '1' },
  { Id: '02', Title: 'book 3', Description: 'beta', ISDN: '002', Published: new Date('2020-01-02'), Copies: 2345678, FirstEdition: true, LibraryId: '2' },
  { Id: '03', Title: 'book 1', Description: 'gamma', ISDN: '003', Published: new Date('2020-01-01'), Copies: 1234567, FirstEdition: true, LibraryId: '2' }
];


@Injectable()
@Controller(BooksComponent)
class BooksListController extends ComponentController
{
  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication)
  {
    super(component, model);

    this.Activated.Subscribe(() => this.OnActivated());
  }

  protected OnActivated(): void
  {

  }



}



/*

@Injectable()
@Controller(HomeComponent)
class OneController extends ComponentController
{
  constructor(component: HomeComponent, model: ModelApplication)
  {
    super(component, model);

    this.Created.Subscribe(() => {
      // tslint:disable-next-line: max-line-length
      console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.GetControllers(component).length} controllers registered for component`);
    });
    this.Activated.Subscribe(() => {
      console.log(`${this.constructor.name} controller activated`);
    });
  }
}

@Injectable()
@Controller(HomeComponent)
class TwoController extends ComponentController
{
  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication)
  {
    super(component, model);

    this.Created.Subscribe(() => { console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.GetControllers(component).length} controllers registered for component`); });
  }
}

@Injectable()
@Controller(HomeComponent)
class ThreeController implements IController
{
  public Name: string = '';
  public Component: IComponent;
  public Model: ModelApplication;
  public readonly Active: BoolList = new BoolList();
  public readonly Actions: Array<ActionBase> = [];
  public readonly Created: Event<EventArgs> = new Event<EventArgs>();
  public readonly Activated: Event<EventArgs> = new Event<EventArgs>();
  public readonly Deactivated: Event<EventArgs> = new Event<EventArgs>();


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication)
  {
    this.Component = component;
    this.Model = model;

    this.Created.Subscribe(() => {
      // tslint:disable-next-line: max-line-length
      console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.GetControllers(component).length} controllers registered for component`);

      // non-declarative controller registration
      ControllerManager.Register(FourController, HomeComponent);
    });
  }
}

@Injectable()
class FourController extends ComponentController
{
  constructor(component: HomeComponent, model: ModelApplication)
  {
    super(component, model);

    this.Created.Subscribe(() => {
      // tslint:disable-next-line: max-line-length
      console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.GetControllers(component).length} controllers registered for component`);
    });
  }
}

*/
