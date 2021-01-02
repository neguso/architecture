import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

import { Application } from './core';

import { ActionsContainerToolbarComponent } from '../actions-containers/toolbar/actions-container-toolbar.component';
import { ActionContainerController } from './controllers';
import { StaticTextViewItemComponent } from './components';


@NgModule({
  providers: [ActionContainerController],
  declarations: [ActionsContainerToolbarComponent, StaticTextViewItemComponent],
  exports: [ActionsContainerToolbarComponent, StaticTextViewItemComponent],
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
