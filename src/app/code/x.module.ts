import { Inject, Injectable, NgModule } from '@angular/core';

import {
  AppFrameworkModule,
  Event,
  BaseObject,
  ModelApplication,
  FieldType,
  ModelDataModelMember,
  Controller,
  ControllerBase,
  ControllerManager,
  IComponent,
  IController,
  ActionBase,
  ControllerCreatedEventArgs,
  ArrayStore,
  StateManager,
  ControllerActiveStateChangedEventArgs,
  BoolList
} from './app-framework.module';
import { HomeComponent } from '../home/home.component';


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
  }

  public UpdateApplicationModel(model: ModelApplication): void
  {
    // update application model
    model.Title = 'My Application';
    model.Options.ProtectedContentText = '[Protected]';

    // create data model nodes
    model.RegisterDataModel(Book, { Caption: 'Book' });
    model.RegisterDataModelMembers(Book, {
      Title: { Type: FieldType.String, Caption: 'Book Title', Index: 0 },
      Description: { Type: FieldType.String, AllowNull: true }
    });
    model.DataModels['Book'].Members['ISDN'] = new ModelDataModelMember(model, 'ISDN');

    // create a list view
    model.RegisterListView('Books_ListView', Book, {
      Caption: 'Books List'
    });
    model.RegisterListViewColumns('Books_ListView', {
      Title: { Index: 1, Caption: 'The Title' },
      Description: { Index: 2, Caption: 'Short description' }
    });

    // create a detail view
    model.RegisterDetailView('Book_DetailView', Book, {
      Caption: 'View Book'
    });
    model.RegisterDetailViewItems('Book_DetailView', {
      Title: { Caption: 'Input Title' },
      Description: { MaxLength: 100 }
    });


  }
}



export class Book extends BaseObject
{
  public Title: string;
  public Description: string | null;
  public ISDN: string | null = null;


  constructor(id: string, title: string, description: string | null = null)
  {
    super(id);

    this.Title = title;
    this.Description = description;
  }
}


@Injectable({ providedIn: 'root' })
export class BooksDataStore extends ArrayStore<Book>
{
  protected Search(array: Array<Book>, text: string): Array<Book>
  {
    return array.filter(e => e.Title.indexOf(text) !== -1 || (e.Description !== null && e.Description.indexOf(text) !== -1));
  }
}


const booksdata: Array<Book> = [{
  Id: '73c5f2fe-2e7a-47e0-aa8e-bc0be5143b45',
  Title: 'Otra Familia, La',
  Description: 'Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante.',
  ISDN: '49884-020'
}, {
  Id: '20eeb20a-e348-4c88-b222-be266dd5bfc2',
  Title: 'Family Thing, A',
  Description: 'Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla.',
  ISDN: '44087-1150'
}, {
  Id: 'e4bcf1f7-e7b7-4a99-bda7-80490c82bd63',
  Title: 'Spy Kids: All the Time in the World in 4D',
  Description: 'In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque.',
  ISDN: '57520-0046'
}, {
  Id: 'd81a7827-90f2-409f-8621-47b2421c7a28',
  Title: 'Summer with Monika (Sommaren med Monika)',
  Description: 'Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio. Donec vitae nisi.',
  ISDN: '37205-538'
}, {
  Id: '76bf3fc4-15e7-4f7f-819d-1d3dcf5a1b46',
  Title: 'Animals are Beautiful People',
  Description: 'In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt.',
  ISDN: '76478-479'
}, {
  Id: '6074a8c9-355b-4907-bd70-175178e6b42a',
  Title: 'Diplomacy (Diplomatie)',
  Description: 'Nam nulla.',
  ISDN: '0338-0129'
}, {
  Id: '79df61d4-652a-4cf9-b339-f0899e1d10fe',
  Title: 'Strayed (égarés, Les)',
  Description: null,
  ISDN: null
}, {
  Id: 'dce48ea3-9d74-4e6a-ae99-b0c81e0a9937',
  Title: 'Léon: The Professional (a.k.a. The Professional) (Léon)',
  Description: 'In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
  ISDN: '36987-2067'
}, {
  Id: '35c21377-7d29-421a-ad8b-b7610b121ac7',
  Title: 'Three Ages',
  Description: 'Suspendisse potenti.',
  ISDN: '42221-0009'
}, {
  Id: 'a43e457f-86c4-45d0-b2ca-71bc05a9e9fd',
  Title: 'Casino Jack',
  Description: 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus.',
  ISDN: '49643-366'
}, {
  Id: 'bfecc8db-4189-4a4b-925d-948a2ab51059',
  Title: 'Ana and the Others (Ana y los otros)',
  Description: null,
  ISDN: null
}, {
  Id: 'dec8c400-b11e-42bd-bd28-56144d750fa5',
  Title: 'Sacro GRA',
  Description: 'Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi.',
  ISDN: '35000-622'
}, {
  Id: 'b9e49367-3589-450a-864d-f0645045686b',
  Title: 'Back to School with Franklin',
  Description: 'Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis. Donec posuere metus vitae ipsum. Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
  ISDN: '0258-4000'
}, {
  Id: 'd7383c4f-27bd-49f6-8c04-ec1bb6dae938',
  Title: 'Nightmaster (Watch the Shadows Dance)',
  Description: 'Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit. Donec diam neque, vestibulum eget, vulputate ut, ultrices vel, augue. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum.',
  ISDN: '55910-655'
}, {
  Id: '08bfba8f-76df-43b7-8651-7f2af71fc751',
  Title: 'If I Were You',
  Description: null,
  ISDN: null
}, {
  Id: '56615f72-df03-4b67-ac32-5e35c3dd98e6',
  Title: 'Little Nemo: Adventures in Slumberland',
  Description: null,
  ISDN: null
}, {
  Id: 'd5e42176-9cfa-4a74-9d05-042ec4fc372c',
  Title: 'Bird of the Air, A (Loop, The)',
  Description: 'Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem.',
  ISDN: '42002-402'
}, {
  Id: 'eadcabb6-d88c-407c-974a-1d02097daf32',
  Title: 'New Year Eve',
  Description: 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.',
  ISDN: '0615-7568'
}, {
  Id: '7a0c13e0-abbd-4e9a-8ddf-fa86de5236a6',
  Title: 'Presenting Lily Mars',
  Description: 'Nullam sit amet turpis elementum ligula vehicula consequat.',
  ISDN: '0378-4160'
}, {
  Id: '11106157-7767-4e1d-980e-ad5db20d1492',
  Title: 'Protector, The (a.k.a. Warrior King) (Tom yum goong)',
  Description: 'Pellentesque at nulla. Suspendisse potenti.',
  ISDN: '54340-777'
}, {
  Id: '4ba2fd90-e2c8-4752-96d9-8e53eee55d1c',
  Title: 'Metropolis',
  Description: 'Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl.',
  ISDN: '52389-263'
}, {
  Id: 'aa30b260-2dd7-4f84-8c3e-174b68091f65',
  Title: 'O Amor das Três Romãs',
  Description: null,
  ISDN: null
}, {
  Id: '17bb819c-275f-44fc-b8a8-8ba317a75f2e',
  Title: 'Cargo',
  Description: 'Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus.',
  ISDN: '0024-0590'
}, {
  Id: 'ff738539-c63e-4580-abe8-e19515fde9f4',
  Title: 'Three Kings',
  Description: 'Nam nulla. Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula. Suspendisse ornare consequat lectus. In est risus, auctor sed, tristique in, tempus sit amet, sem. Fusce consequat. Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus.',
  ISDN: '21695-597'
}, {
  Id: '70b2c303-5a0a-48ed-8199-d59ea02d4456',
  Title: 'Amateur, The',
  Description: 'Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.',
  ISDN: '55648-945'
}, {
  Id: '12a53dbb-f7be-40e5-ba45-fcfefe862ddb',
  Title: 'Bloody Territories (Kôiki bôryoku: ryuuketsu no shima)',
  Description: 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.',
  ISDN: '36987-1106'
}, {
  Id: 'af5db778-f175-4cb5-8d8a-594f9ee3e4c2',
  Title: 'Song Remains the Same, The',
  Description: null,
  ISDN: null
}, {
  Id: '0ea79f36-80d0-4c10-b64c-1c1d85cb0716',
  Title: 'Gran Torino',
  Description: null,
  ISDN: null
}, {
  Id: '5ed31189-04d2-41fb-9ed8-6ce3e8322735',
  Title: 'Robin Hood',
  Description: 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus.',
  ISDN: '43353-289'
}, {
  Id: '19c30b82-9030-4911-99d0-6033c8f655ad',
  Title: 'Immortal Story, The (Histoire immortelle)',
  Description: 'Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum.',
  ISDN: '62756-184'
}, {
  Id: '8fddfb59-a2e6-44af-a7cc-1c7219f219b9',
  Title: 'Stepdaughter, The',
  Description: null,
  ISDN: null
}, {
  Id: '02538277-0d14-4565-8463-0caae57c4f28',
  Title: 'Thor',
  Description: 'Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat.',
  ISDN: '36987-2300'
}, {
  Id: '8e16a617-8e4e-4e06-b171-3a931dbf7099',
  Title: 'Landscape in the Mist (Topio stin omichli)',
  Description: 'Nulla nisl. Nunc nisl. Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.',
  ISDN: '55312-896'
}, {
  Id: '20eb83d8-1643-4f2c-99d9-4da02d88d0b5',
  Title: 'The Big Sleep',
  Description: null,
  ISDN: null
}, {
  Id: '9137265b-f937-4052-bf55-a13371a9cec1',
  Title: 'Live Music',
  Description: 'Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio.',
  ISDN: '60429-146'
}, {
  Id: 'b999c78a-170c-4b9e-b69c-6f474f06d523',
  Title: 'Clockers',
  Description: null,
  ISDN: null
}, {
  Id: '3ab97e1e-819c-4e32-910d-517bf924e970',
  Title: 'Bolt',
  Description: 'Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.',
  ISDN: '59115-030'
}, {
  Id: 'caec20ff-bb96-494b-a032-94a1860bfe92',
  Title: 'Dear White People',
  Description: 'Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet.',
  ISDN: '53346-0515'
}, {
  Id: 'de40b07c-d1bc-4c65-a37f-0d5a5cc9dcd0',
  Title: 'Police Academy 6: City Under Siege',
  Description: 'Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue.',
  ISDN: '0002-7511'
}, {
  Id: 'a9c49c54-7d10-416a-9289-6e7c4fb3d450',
  Title: 'Big Store, The',
  Description: 'Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo.',
  ISDN: '0409-0183'
}, {
  Id: 'ba475ab0-061a-486c-a40b-923c339765d3',
  Title: 'Starcrash (a.k.a. Star Crash)',
  Description: null,
  ISDN: null
}, {
  Id: 'df9d9600-9604-4305-ad1d-98c5f0a73720',
  Title: 'Doctor at Large',
  Description: 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.',
  ISDN: '59834-203'
}, {
  Id: '66ad4c43-20d6-4913-9822-1787d7502f5d',
  Title: 'The Color of Milk',
  Description: 'Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
  ISDN: '75949-6001'
}, {
  Id: '3f3298a9-d171-4e6f-9914-850867ee6803',
  Title: 'Under Our Skin',
  Description: 'Donec posuere metus vitae ipsum. Aliquam non mauris. Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis. Fusce posuere felis sed lacus.',
  ISDN: '49288-0891'
}, {
  Id: '07834782-086f-45cd-a260-12dd6033695d',
  Title: 'My Big Fat Greek Wedding',
  Description: 'Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis.',
  ISDN: '0409-1966'
}, {
  Id: '64e1b3de-2d98-42e0-a00d-8bb7f731b6c2',
  Title: 'William Vincent (Shadows and Lies)',
  Description: 'Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti. Cras in purus eu magna vulputate luctus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.',
  ISDN: '0135-0239'
}, {
  Id: 'fa4c10a4-d095-4c3b-8675-a83c67db044a',
  Title: 'Liberal Arts',
  Description: 'Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis. Ut at dolor quis odio consequat varius. Integer ac leo. Pellentesque ultrices mattis odio.',
  ISDN: '29500-9083'
}, {
  Id: '0461cbb8-3647-4996-993d-48a9c7236e20',
  Title: 'Where the Money Is',
  Description: 'Morbi non lectus. Aliquam sit amet diam in magna bibendum imperdiet. Nullam orci pede, venenatis non, sodales sed, tincidunt eu, felis.',
  ISDN: '63323-064'
}, {
  Id: 'f09a3ca6-6075-4197-85f8-b26264f8a5f7',
  Title: 'Shaft, The (a.k.a. Down)',
  Description: 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis.',
  ISDN: '14290-354'
}, {
  Id: 'a875fce9-a75e-4d16-a2fb-511567e4b013',
  Title: 'Private Life of Henry VIII, The',
  Description: 'Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius.',
  ISDN: '0573-1940'
}, {
  Id: '2b81f67a-3efb-4b92-8c25-7f2ea7777f3a',
  Title: 'DiG!',
  Description: 'In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui.',
  ISDN: '0054-8603'
}, {
  Id: '9b83de91-a85c-4912-b5bb-fa3c6858d0dd',
  Title: 'Chaos',
  Description: 'Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam. Suspendisse potenti. Nullam porttitor lacus at turpis.',
  ISDN: '62257-365'
}, {
  Id: 'e2c9ffe6-b8ba-497c-9c7a-6021cb68c348',
  Title: 'Cowboys, The',
  Description: 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim.',
  ISDN: '17478-205'
}, {
  Id: '8710baae-e3f4-49ad-a394-923df9507981',
  Title: 'Once Upon a Time in Queens',
  Description: 'Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc. Proin at turpis a pede posuere nonummy. Integer non velit.',
  ISDN: '43857-0194'
}, {
  Id: '66b19c53-0d6c-4d09-9127-fdf595e233d5',
  Title: 'Jupiter Darling',
  Description: 'Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo. Morbi ut odio. Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices.',
  ISDN: '68084-082'
}, {
  Id: 'eb2bb45d-3efe-4f07-9c1b-715f9a27af11',
  Title: 'Nine Dead',
  Description: 'Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem. Integer tincidunt ante vel ipsum. Praesent blandit lacinia erat.',
  ISDN: '58503-013'
}, {
  Id: 'a14d6c0a-6546-4919-a88a-4e57e7eb8eae',
  Title: 'Little Princess, A',
  Description: 'Nam ultrices, libero non mattis pulvinar, nulla pede ullamcorper augue, a suscipit nulla elit ac nulla. Sed vel enim sit amet nunc viverra dapibus. Nulla suscipit ligula in lacus. Curabitur at ipsum ac tellus semper interdum. Mauris ullamcorper purus sit amet nulla. Quisque arcu libero, rutrum ac, lobortis vel, dapibus at, diam.',
  ISDN: '50505-001'
}, {
  Id: '1aa061db-d25c-4f83-8d8c-a9701afc5f71',
  Title: 'My Boss Daughter',
  Description: null,
  ISDN: null
}, {
  Id: '6877e92b-0eed-456b-91b4-9ff9917c92cc',
  Title: 'Kevin Smith: Sold Out - A Threevening with Kevin Smith',
  Description: 'Duis bibendum, felis sed interdum venenatis, turpis enim blandit mi, in porttitor pede justo eu massa. Donec dapibus. Duis at velit eu est congue elementum. In hac habitasse platea dictumst. Morbi vestibulum, velit id pretium iaculis, diam erat fermentum justo, nec condimentum neque sapien placerat ante. Nulla justo. Aliquam quis turpis eget elit sodales scelerisque. Mauris sit amet eros.',
  ISDN: '55111-763'
}, {
  Id: 'a2b006f7-e191-4769-86c9-1e2c0e9aefee',
  Title: 'Canadian Bacon',
  Description: null,
  ISDN: null
}, {
  Id: 'da0da04f-539f-4839-b041-5d328a1c47e8',
  Title: 'AVP: Alien vs. Predator',
  Description: 'Nulla nisl. Nunc nisl.',
  ISDN: '37808-082'
}, {
  Id: '1a03781a-04c9-4fb1-98be-06c7fd4225c9',
  Title: 'High Noon',
  Description: 'Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero.',
  ISDN: '51414-600'
}, {
  Id: 'e14ca1af-5dc0-488e-9ee4-9e8d1e7d82fe',
  Title: 'Joanna',
  Description: 'Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus. Phasellus in felis. Donec semper sapien a libero. Nam dui. Proin leo odio, porttitor id, consequat in, consequat ut, nulla. Sed accumsan felis.',
  ISDN: '66993-470'
}, {
  Id: '0e6cb9c3-07f0-4eec-b59e-a741d8769070',
  Title: 'Star Trek',
  Description: null,
  ISDN: null
}, {
  Id: '3ce478df-107c-4ca1-b164-2b5fcfe941fd',
  Title: 'Town & Country',
  Description: 'Duis ac nibh. Fusce lacus purus, aliquet at, feugiat non, pretium quis, lectus. Suspendisse potenti. In eleifend quam a odio. In hac habitasse platea dictumst. Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem.',
  ISDN: '0168-0269'
}, {
  Id: '6b28c9ab-9672-44de-9aa1-e4d88d034212',
  Title: 'Ultramarathon Man: 50 Marathons, 50 States, 50 Days',
  Description: 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede. Morbi porttitor lorem id ligula.',
  ISDN: '13537-071'
}, {
  Id: '41b9bfe3-0111-4025-a56b-e7f35625a6f5',
  Title: 'Band of the Hand',
  Description: 'Maecenas ut massa quis augue luctus tincidunt. Nulla mollis molestie lorem. Quisque ut erat. Curabitur gravida nisi at nibh. In hac habitasse platea dictumst. Aliquam augue quam, sollicitudin vitae, consectetuer eget, rutrum at, lorem.',
  ISDN: '0363-0482'
}, {
  Id: '691428fc-085b-41cb-896d-c1082807dc95',
  Title: 'Cinderella',
  Description: 'Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo. Maecenas rhoncus aliquam lacus. Morbi quis tortor id nulla ultrices aliquet. Maecenas leo odio, condimentum id, luctus nec, molestie sed, justo. Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc.',
  ISDN: '41163-801'
}, {
  Id: '1b1ff60a-e847-40e8-969a-ecf1d40587e7',
  Title: 'Public Enemy, The',
  Description: 'Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vivamus vestibulum sagittis sapien. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Etiam vel augue. Vestibulum rutrum rutrum neque. Aenean auctor gravida sem. Praesent id massa id nisl venenatis lacinia. Aenean sit amet justo.',
  ISDN: '54312-275'
}, {
  Id: '54658ec3-579e-4d0b-bc02-5a1b89ca7290',
  Title: 'Storm Center',
  Description: 'Duis mattis egestas metus. Aenean fermentum.',
  ISDN: '0409-1109'
}, {
  Id: '8c8c0565-d705-4cc0-9a37-fa7c7710da82',
  Title: 'Antisocial',
  Description: null,
  ISDN: null
}, {
  Id: '1dfb17b1-9c6f-410f-a64d-d4e441c9ab00',
  Title: 'Paid',
  Description: 'Pellentesque viverra pede ac diam. Cras pellentesque volutpat dui. Maecenas tristique, est et tempus semper, est quam pharetra magna, ac consequat metus sapien ut nunc. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Mauris viverra diam vitae quam.',
  ISDN: '0615-6547'
}, {
  Id: '31fdb138-ea10-402f-93b1-6e97f584ae23',
  Title: 'Yves Saint Laurent',
  Description: 'Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo. Maecenas pulvinar lobortis est. Phasellus sit amet erat. Nulla tempus. Vivamus in felis eu sapien cursus vestibulum. Proin eu mi. Nulla ac enim. In tempor, turpis nec euismod scelerisque, quam turpis adipiscing lorem, vitae mattis nibh ligula nec sem. Duis aliquam convallis nunc.',
  ISDN: '0904-6098'
}, {
  Id: '8ff46662-d442-419b-9b64-0072fd03e242',
  Title: 'Like Someone In Love',
  Description: null,
  ISDN: null
}, {
  Id: 'd630b48e-3e96-4432-b307-ca6d7d54b251',
  Title: 'Wild Grass (Herbes folles, Les)',
  Description: 'Integer pede justo, lacinia eget, tincidunt eget, tempus vel, pede.',
  ISDN: '55154-1458'
}, {
  Id: '36023788-538e-4fbc-aaad-46545fa17d0d',
  Title: 'TiMER',
  Description: null,
  ISDN: null
}, {
  Id: 'd9c01ff0-ff46-4241-8c2b-7d3f47b7d52f',
  Title: 'Female Prisoner #701: Scorpion (Joshuu 701-gô: Sasori)',
  Description: 'Donec semper sapien a libero. Nam dui.',
  ISDN: '58118-1349'
}, {
  Id: '2e66549c-503b-4b24-b72a-d299b3c4a65c',
  Title: 'Last of the Mohicans, The',
  Description: 'Donec ut mauris eget massa tempor convallis. Nulla neque libero, convallis eget, eleifend luctus, ultricies eu, nibh.',
  ISDN: '37808-266'
}, {
  Id: '49b6f461-6617-4514-80a1-17f4a9df67de',
  Title: 'Little Trip to Heaven, A',
  Description: 'Curabitur convallis. Duis consequat dui nec nisi volutpat eleifend. Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus.',
  ISDN: '61314-237'
}, {
  Id: '293bdc74-ad59-4f65-bc98-bfd33ec483e8',
  Title: 'Silent House',
  Description: 'Fusce posuere felis sed lacus. Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis.',
  ISDN: '68151-4243'
}, {
  Id: '0b6d60ec-c8a6-4291-8f3e-14baa8a5cd5e',
  Title: '101 Dalmatians (One Hundred and One Dalmatians)',
  Description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Donec pharetra, magna vestibulum aliquet ultrices, erat tortor sollicitudin mi, sit amet lobortis sapien sapien non mi. Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl. Duis ac nibh.',
  ISDN: '37000-408'
}, {
  Id: '27f70c51-8d07-4dce-9e3b-27ed8a9384db',
  Title: 'Time Machine, The',
  Description: null,
  ISDN: null
}, {
  Id: '5bbf539e-6ed5-40c8-9ac5-c555ff389767',
  Title: 'Prince of Jutland (a.k.a. Royal Deceit)',
  Description: 'Morbi sem mauris, laoreet ut, rhoncus aliquet, pulvinar sed, nisl. Nunc rhoncus dui vel sem. Sed sagittis. Nam congue, risus semper porta volutpat, quam pede lobortis ligula, sit amet eleifend pede libero quis orci. Nullam molestie nibh in lectus. Pellentesque at nulla. Suspendisse potenti.',
  ISDN: '42291-113'
}, {
  Id: '69224337-68e6-4a29-a59b-36df8b15a993',
  Title: 'Zoolander',
  Description: 'Cras mi pede, malesuada in, imperdiet et, commodo vulputate, justo. In blandit ultrices enim. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Proin interdum mauris non ligula pellentesque ultrices. Phasellus id sapien in sapien iaculis congue. Vivamus metus arcu, adipiscing molestie, hendrerit at, vulputate vitae, nisl. Aenean lectus.',
  ISDN: '55648-718'
}, {
  Id: '5044b1d0-6cf0-48ba-851c-b6413d2d47ee',
  Title: 'Maidens Conspiracy, The (Tirante el Blanco)',
  Description: 'Ut tellus. Nulla ut erat id mauris vulputate elementum.',
  ISDN: '33332-114'
}, {
  Id: '5a2bf93a-122e-4372-ae50-4512c03aa61a',
  Title: 'Berta Motives (Los motivos de Berta: Fantasía de Pubertad)',
  Description: 'In congue. Etiam justo. Etiam pretium iaculis justo. In hac habitasse platea dictumst. Etiam faucibus cursus urna. Ut tellus. Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.',
  ISDN: '10056-530'
}, {
  Id: '64a4c83e-752f-4b1c-b3b4-6f66ca40b990',
  Title: 'Marked Woman',
  Description: null,
  ISDN: null
}, {
  Id: 'e417f845-1d3e-472a-8efb-28746696dc07',
  Title: 'Toy Story of Terror',
  Description: null,
  ISDN: null
}, {
  Id: '8928dcca-389d-4b04-805a-251466bfb13e',
  Title: 'Devil Due',
  Description: 'Vivamus vel nulla eget eros elementum pellentesque. Quisque porta volutpat erat. Quisque erat eros, viverra eget, congue eget, semper rutrum, nulla. Nunc purus.',
  ISDN: '49349-817'
}, {
  Id: '0b469ae1-bc04-435f-a86a-9ea2274e241e',
  Title: 'America Sweethearts',
  Description: null,
  ISDN: null
}, {
  Id: 'fd8da17c-bd86-48b7-b1fe-d0b5beef3fb4',
  Title: 'Householder, The (Gharbar)',
  Description: 'Integer ac neque. Duis bibendum. Morbi non quam nec dui luctus rutrum. Nulla tellus. In sagittis dui vel nisl.',
  ISDN: '59726-480'
}, {
  Id: '06cce521-6a4a-4b08-a68c-3c2f09ef9beb',
  Title: 'Planes: Fire & Rescue',
  Description: 'Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat. Morbi a ipsum. Integer a nibh. In quis justo.',
  ISDN: '0406-3316'
}, {
  Id: '5763d2ac-b514-412b-8fb8-246b2809ba91',
  Title: 'Friends and Family',
  Description: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Nulla dapibus dolor vel est. Donec odio justo, sollicitudin ut, suscipit a, feugiat et, eros. Vestibulum ac est lacinia nisi venenatis tristique.',
  ISDN: '65841-067'
}, {
  Id: '9b73bede-37d6-4bdb-acc3-a4a4cf6a5a11',
  Title: 'Dolls',
  Description: null,
  ISDN: null
}, {
  Id: '34919861-1b57-49d8-8f33-7cd7559f3f3d',
  Title: 'Mental',
  Description: null,
  ISDN: null
}, {
  Id: '47a74db8-61a4-428d-9547-767e70320bf2',
  Title: 'Balseros (Cuban Rafters)',
  Description: 'Aliquam sit amet diam in magna bibendum imperdiet.',
  ISDN: '59262-262'
}, {
  Id: '58fc177c-2e1e-4604-936b-53f34a3c8fab',
  Title: 'Rebirth',
  Description: 'Donec ut dolor. Morbi vel lectus in quam fringilla rhoncus. Mauris enim leo, rhoncus sed, vestibulum sit amet, cursus id, turpis. Integer aliquet, massa id lobortis convallis, tortor risus dapibus augue, vel accumsan tellus nisi eu orci. Mauris lacinia sapien quis libero. Nullam sit amet turpis elementum ligula vehicula consequat.',
  ISDN: '68647-180'
}, {
  Id: 'ff3eca83-a1f7-4b4e-909c-a1768f94a292',
  Title: 'Dressed to Kill',
  Description: 'Donec quis orci eget orci vehicula condimentum. Curabitur in libero ut massa volutpat convallis. Morbi odio odio, elementum eu, interdum eu, tincidunt in, leo.',
  ISDN: '41520-047'
}, {
  Id: 'a8f1ebbe-b6d5-4060-9686-443b960bb522',
  Title: 'Phantom of the Megaplex',
  Description: 'Mauris ullamcorper purus sit amet nulla.',
  ISDN: '31722-422'
}, {
  Id: 'e33d5a34-d985-40cd-ac5e-6a1dd70ddfdf',
  Title: 'Snapshot',
  Description: 'Nulla ut erat id mauris vulputate elementum. Nullam varius. Nulla facilisi. Cras non velit nec nisi vulputate nonummy.',
  ISDN: '53808-0230'
}];



class BooksListController extends ControllerBase
{
  constructor(component: IComponent)
  {
    super(component);
  }



}





@Injectable()
@Controller(HomeComponent)
class OneController extends ControllerBase
{
  constructor(component: HomeComponent, model: ModelApplication)
  {
    super(component);

    this.Created.Subscribe(() => {
      console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.Controllers(component).length} controllers registered for component`);
    });
  }
}

@Injectable()
@Controller(HomeComponent)
class TwoController extends ControllerBase
{
  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication)
  {
    super(component);

    this.Created.Subscribe(() => { console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.Controllers(component).length} controllers registered for component`); });
  }
}

@Injectable()
@Controller(HomeComponent)
class ThreeController implements IController
{
  public Name: string = '';
  public Component: IComponent;
  public readonly Active: BoolList = new BoolList();
  public readonly Actions: Array<ActionBase> = [];
  public readonly Created: Event<ControllerCreatedEventArgs> = new Event<ControllerCreatedEventArgs>();
  public readonly Activated: Event<ControllerActiveStateChangedEventArgs> = new Event<ControllerActiveStateChangedEventArgs>();
  public readonly Deactivated: Event<ControllerActiveStateChangedEventArgs> = new Event<ControllerActiveStateChangedEventArgs>();


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication)
  {
    this.Component = component;

    this.Created.Subscribe(() => {
      console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.Controllers(component).length} controllers registered for component`);

      // non-declarative controller registration
      ControllerManager.Register(FourController, HomeComponent);
    });
  }
}

@Injectable()
class FourController extends ControllerBase
{
  constructor(component: HomeComponent, model: ModelApplication)
  {
    super(component);

    this.Created.Subscribe(() => {
      console.log(`${this.constructor.name} controller created for ${component.constructor.name}, there are ${ControllerManager.Controllers(component).length} controllers registered for component`);
    });
  }
}
