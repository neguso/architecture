import { Component, Input } from '@angular/core';
import { StaticTextViewItem, ViewItem } from './core';


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
