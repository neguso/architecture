import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentBase } from 'src/magenta/core';


@Component({
  selector: 'app-libraries',
  templateUrl: './libraries.component.html',
  styleUrls: ['./libraries.component.scss']
})
export class LibrariesComponent  extends ComponentBase
{
  constructor(route: ActivatedRoute)
  {
    super(route);
  }
}
