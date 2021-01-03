import { Injectable } from '@angular/core';

import { Controller, ComponentController, ModelApplication } from './core';

import { MainTemplateComponent } from '../main-template/main-template.component';



@Injectable()
@Controller(MainTemplateComponent)
export class DetailViewController extends ComponentController
{

  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);

    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
  }

}
