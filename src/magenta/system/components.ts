import { Component, Input, Type } from '@angular/core';

import { ActionBase, ActionsContainerViewItem, StaticImageViewItem, StaticTextViewItem, TreeNodeAction, ViewItem, ColumnViewItem,
  DataSource, IBaseObject, Utils, SimpleAction, UrlAction, ParametrizedAction } from '../core';



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
  template: `
    <div>
      <ng-template ngFor let-action [ngForOf]="Actions">

        <!-- SimpleButton -->
        <button *ngIf="IsSimpleAction(action)" (click)="action.DoExecute()" mat-raised-button>{{action.Caption}}</button>

        <!-- UrlAction -->
        <a *ngIf="IsUrlAction(action)" href="{{$any(action).Url}}" mat-button>{{action.Caption}}</a>

        <!-- ParametrizedAction -->
        <input *ngIf="IsParametrizedAction(action)" matInput placeholder="{{$any(action).NullValuePrompt}}" value="">

      </ng-template>
    </div>
  `
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

  public IsSimpleAction(action: ActionBase): boolean { return Utils.Extends(SimpleAction, action.constructor as Type<any>); }
  public IsUrlAction(action: ActionBase): boolean { return Utils.Extends(UrlAction, action.constructor as Type<any>); }
  public IsParametrizedAction(action: ActionBase): boolean { return Utils.Extends(ParametrizedAction, action.constructor as Type<any>); }
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
