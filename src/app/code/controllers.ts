import { Injectable } from '@angular/core';

import { Controller, ComponentController, ModelApplication, ComponentBase, ViewController } from './core';

import { MainTemplateComponent } from '../main-template/main-template.component';



@Injectable()
@Controller(ComponentBase)
export class ComponentLifecycleController extends ComponentController
{
  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });
  }
}



@Injectable()
@Controller(MainTemplateComponent)
export class DetailViewController extends ViewController
{
  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });
  }
}
