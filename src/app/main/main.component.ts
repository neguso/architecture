import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentBase, DetailView } from 'src/magenta/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent extends ComponentBase
{
  constructor(route: ActivatedRoute)
  {
    super(route);
  }
}
