import { Component, Input } from '@angular/core';

import { ActionsContainerViewItem, StaticImageViewItem, StaticTextViewItem, ViewItem } from './core';


@Component({
  selector: 'static-text',
  template: '<div>{{StaticTextItem?.Caption}}: {{StaticTextItem?.Text}}</div>'
})
export class StaticTextViewItemComponent
{
  @Input('item') public Item: ViewItem | null = null;

  public get StaticTextItem(): StaticTextViewItem | null
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
  @Input('item') public Item: ViewItem | null = null;

  public get StaticImageItem(): StaticImageViewItem | null
  {
    return this.Item as StaticImageViewItem;
  }
}



@Component({
  selector: 'actions-container',
  template: '<div><button mat-raised-button>Text</button></div>'
})
export class ActionsContainerViewItemComponent
{
  @Input('item') public Item: ViewItem | null = null;

  public get ActionContainerItem(): ActionsContainerViewItem | null
  {
    return this.Item as ActionsContainerViewItem;
  }
}
