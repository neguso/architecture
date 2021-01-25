import { BaseObject, ArrayStore } from 'src/magenta/core';


export class About extends BaseObject
{
  public Title: string;
  public Description: string;
  public Logo: string;

  constructor(id: string, title: string = '', description: string = '', logo: string = '')
  {
    super(id);

    this.Title = title;
    this.Description = description;
    this.Logo = logo;
  }
}


export class MainModel extends BaseObject
{

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






export class Customer extends BaseObject
{
  public Name: string;
  public Address: string | null;
  public NoOfEmployees: number = 0;
  public Limited: boolean = false;
  public Created: Date;


  constructor(name: string, address: string | null, empl: number, ltd: boolean, created: Date)
  {
    super();

    this.Name = name;
    this.Address = address;
    this.NoOfEmployees = empl;
    this.Limited = ltd;
    this.Created = created;
  }
}
