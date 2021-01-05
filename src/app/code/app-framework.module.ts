import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { Application } from './core';

import { StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent } from './components';
import { DetailViewController } from './controllers';


@NgModule({
  providers: [DetailViewController],
  declarations: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent],
  exports: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent],
  imports: [CommonModule, MatButtonModule]
})
export class AppFrameworkModule
{
  public constructor(application: Application)
  {
    console.log(`Module ${this.constructor.name} created`);

    application.Setup();
  }
}
