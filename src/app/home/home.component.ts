import { Component, OnInit } from '@angular/core';

import { ModelApplication } from '../code/app-framework.module';
import { Book, BooksDataStore } from '../code/x.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{
  private bookStore: BooksDataStore;

  public text: string = 'x';

  constructor(model: ModelApplication, bookStore: BooksDataStore)
  {
    model.Title = 'varza';

    this.bookStore = bookStore;
    this.bookStore.Data = booksdata;
  }

  public ngOnInit(): void
  {
    this.text = 'hello world';

    this.Load().then();
  }


  public async Load(): Promise<void>
  {
    try
    {
      this.bookStore.Insert({ Id: '4', Title: 'Four', Description: null });
      const books = await this.bookStore.Load({ Search: 'our' });


      let c = books.length;
    }
    catch(exception)
    {
      console.log('loading error');
    }
  }


}




const booksdata: Array<Book> = [
  { Id: '1', Title: 'book one', Description: 'first book' },
  { Id: '2', Title: 'book two', Description: 'description of the second book' },
  { Id: '3', Title: 'book three', Description: null }
];
