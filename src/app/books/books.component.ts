import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../code/app-framework.module';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent extends ComponentBase implements OnInit
{

  constructor()
  {
    super();

  }

  public ngOnInit(): void
  {
  }

}



