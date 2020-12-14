import { NgModule } from '@angular/core';
import { AppFrameworkModule, BaseObject } from './app-framework.module';
import { Book, XModule } from './x.module';

@NgModule({
  declarations: [],
  imports: [AppFrameworkModule, XModule]
})
export class YModule { }


export class Library extends BaseObject
{
  public Name: string;
  public Address: string | null;
  public Books: Array<Book> = [];


  constructor(id: string, name: string, address: string | null = null)
  {
    super(id);

    this.Name = name;
    this.Address = address;
  }
}
