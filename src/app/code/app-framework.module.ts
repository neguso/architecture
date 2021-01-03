import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Application } from './core';

import { StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent } from './components';
import { DetailViewController } from './controllers';


@NgModule({
  providers: [DetailViewController],
  declarations: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent],
  exports: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent],
  imports: [MatButtonModule]
})
export class AppFrameworkModule
{
  public constructor(application: Application)
  {
    console.log(`Module ${this.constructor.name} created`);

    application.Setup();
  }
}
