import { Inject, Injectable } from '@angular/core';

import { Controller, ComponentController, ViewController, ModelApplication, ComponentBase, IComponent } from './core';


//TODO
@Injectable()
@Controller(ComponentBase)
export class ComponentLifecycleController extends ComponentController
{
  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication)
  {
    super(component, model);

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created for ${component.constructor.name}`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });
  }
}
