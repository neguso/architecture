import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DetailViewController, ShowNavigationItemController } from './controllers';


@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [ShowNavigationItemController, DetailViewController]
})
export class SystemModule
{
  public constructor()
  {
    console.log(`Module ${this.constructor.name} created`);
  }
}
