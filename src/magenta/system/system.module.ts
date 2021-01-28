import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailViewController, ShowNavigationItemController } from './controllers';
import { ModelApplication } from '../core';


@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [ShowNavigationItemController, DetailViewController]
})
export class SystemModule
{
  public constructor(model: ModelApplication)
  {
    console.log(`Module ${this.constructor.name} created`);

    // module initialization
    //...

    // update application model
    this.UpdateApplicationModel(model);
  }


  public UpdateApplicationModel(model: ModelApplication): void
  {

  }
}
