import { Injector, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { ControllerManager } from './core';
import {
  StaticTextViewItemComponent,
  StaticImageViewItemComponent,
  ActionsContainerViewItemComponent,
  ActionsContainerNavigationComponent
} from './components';


@NgModule({
  providers: [],
  declarations: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent, ActionsContainerNavigationComponent],
  exports: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent, ActionsContainerNavigationComponent],
  imports: [CommonModule, MatButtonModule]
})
export class CoreModule
{
  public constructor(injector: Injector)
  {
    console.log(`Module ${this.constructor.name} created`);

    ControllerManager.RegisterInjector(injector);
  }
}
