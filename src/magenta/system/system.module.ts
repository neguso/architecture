import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { ModelApplication } from '../core';

import {
  StaticTextViewItemComponent,
  StaticImageViewItemComponent,
  ActionsContainerViewItemComponent,
  ActionsContainerNavigationComponent,
  DataTableComponent
} from './components';
import { DetailViewController, ShowNavigationItemController } from './controllers';


@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatTableModule, MatSortModule, MatPaginatorModule
  ],
  declarations: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent, ActionsContainerNavigationComponent, DataTableComponent],
  exports: [StaticTextViewItemComponent, StaticImageViewItemComponent, ActionsContainerViewItemComponent, ActionsContainerNavigationComponent, DataTableComponent],
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
    model.RegisterAction('refresh', { Caption: 'Refresh', Container: 'listview-actions' });
  }
}
