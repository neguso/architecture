import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentBase, DetailView } from 'src/magenta/core';


@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent extends ComponentBase
{
  constructor(route: ActivatedRoute)
  {
    super(route);
  }
}
