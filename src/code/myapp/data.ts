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



export class AboutDataStore extends ArrayStore<About>
{
  constructor()
  {
    super([new About('', 'this is title', 'this is description', 'https://lh3.googleusercontent.com/ogw/ADGmqu_yMhxJnXXLDx2mQfoDzNGRPVVrxYsZ47yA9Jzlc-0=s32-c-mo')]);
  }
}
