import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ControllerManager } from './core';
import { ComponentLifecycleController, CoreController } from './controllers';


@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [ComponentLifecycleController, CoreController]
})
export class CoreModule
{
  public constructor(injector: Injector)
  {
    console.log(`Module ${this.constructor.name} created`);

    ControllerManager.RegisterInjector(injector);
  }
}
