import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ShowNavigationItemController } from './controllers';


@NgModule({
  imports: [CommonModule],
  declarations: [],
  exports: [],
  providers: [ShowNavigationItemController]
})
export class SystemModule
{
  public constructor()
  {
    console.log(`Module ${this.constructor.name} created`);
  }
}
