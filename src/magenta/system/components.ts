import { Component, Input } from '@angular/core';

import { ActionBase, ActionsContainerViewItem, StaticImageViewItem, StaticTextViewItem, TreeNodeAction, ViewItem, ColumnViewItem,
  DataSource, IBaseObject } from '../core';



@Component({
  selector: 'static-text',
  template: '<div *ngIf="StaticTextItem">{{StaticTextItem?.Caption}}: {{StaticTextItem?.Text}}</div>'
})
export class StaticTextViewItemComponent
{
  @Input('item') public Item: ViewItem | undefined = undefined;

  public get StaticTextItem(): StaticTextViewItem | undefined
  {
    return this.Item as StaticTextViewItem;
  }
}



@Component({
  selector: 'static-image',
  template: '<div>{{StaticImageItem?.Caption}}: <img src="{{StaticImageItem?.Url}}" alt=""></div>'
})
export class StaticImageViewItemComponent
{
  @Input('item') public Item?: ViewItem;

  public get StaticImageItem(): StaticImageViewItem | undefined
  {
    return this.Item as StaticImageViewItem;
  }
}



@Component({
  selector: 'actions-container',
  template: '<div><button *ngFor="let action of Actions" (click)="action.DoExecute()" mat-raised-button>{{action.Caption}}</button></div>'
})
export class ActionsContainerViewItemComponent
{
  @Input('item') public Item?: ViewItem;
  @Input('actions') public ActionsList?: Array<ActionBase>;
  @Input('container') public Container?: string;


  public get ActionContainerItem(): ActionsContainerViewItem | undefined
  {
    return this.Item as ActionsContainerViewItem;
  }

  public get Actions(): Array<ActionBase>
  {
    return this.ActionContainerItem?.Actions.filter(e => e.Container === this.ActionContainerItem?.Container) ?? this.ActionsList?.filter(e => e.Container === this.Container) ?? [];
  }
}



@Component({
  selector: 'actions-container-navigation',
  template: `<div><div *ngFor="let group of Actions">{{group.Caption}}<button *ngFor="let action of group.Items" (click)="action.DoExecute()" mat-raised-button>{{action.Caption}}</button></div></div>`
})
export class ActionsContainerNavigationComponent
{
  @Input('actions') public ActionsList?: Array<ActionBase>;
  @Input('container') public Container?: string;


  public get Actions(): Array<TreeNodeAction>
  {
    return this.ActionsList?.filter(e => e.Container === this.Container).map(e => e as TreeNodeAction) ?? [];
  }
}



@Component({
  selector: 'data-table',
  template: `<div>the grid</div>`
})
export class DataTableComponent
{
  @Input('data') public DataSource?: DataSource<IBaseObject>;
  @Input('columns') public Columns?: Array<ColumnViewItem>;

}
