import { Component, OnInit } from '@angular/core';
import { ComponentBase } from '../code/app-framework.module';

@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent extends ComponentBase implements OnInit
{
  constructor()
  {
    super();
  }

  public ngOnInit(): void
  {
  }
}
