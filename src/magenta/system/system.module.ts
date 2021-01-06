import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  providers: [],
  declarations: [],
  exports: [],
  imports: [CommonModule]
})
export class SystemModule
{
  public constructor()
  {
    console.log(`Module ${this.constructor.name} created`);
  }
}
