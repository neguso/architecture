import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponentBase } from '../../magenta/core';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent extends ComponentBase
{
  constructor(route: ActivatedRoute)
  {
    super(route);
  }
}



