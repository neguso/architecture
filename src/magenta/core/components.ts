import { Component, Input } from '@angular/core';

import { ActionBase, ActionsContainerViewItem, StaticImageViewItem, StaticTextViewItem, ViewItem } from './core';


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
  @Input('item') public Item: ViewItem | undefined = undefined;

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
  @Input('item') public Item: ViewItem | undefined;
  @Input('actions') public ActionsList: Array<ActionBase> | undefined;
  @Input('container') public Container: string | undefined;


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
  template: '<div><button *ngFor="let action of Actions" (click)="action.DoExecute()" mat-raised-button>{{action.Caption}}</button></div>'
})
export class ActionsContainerNavigationComponent
{
  @Input('actions') public ActionsList: Array<ActionBase> | undefined;
  @Input('container') public Container: string | undefined;


  public get Actions(): Array<ActionBase>
  {
    return this.ActionsList?.filter(e => e.Container === this.Container) ?? [];
  }
}
