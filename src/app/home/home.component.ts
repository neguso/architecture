import { Component, OnInit } from '@angular/core';

import { ModelApplication } from '../code/app-framework.module';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{

  public text: string = 'x';

  constructor(model: ModelApplication)
  {
    model.Title = 'varza';

  }

  public ngOnInit(): void
  {
    this.text = 'hello world';
  }

}
