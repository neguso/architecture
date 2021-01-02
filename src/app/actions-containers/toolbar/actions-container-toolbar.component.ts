import { Component, Input, OnInit } from '@angular/core';
import { ActionBase, ComponentBase } from 'src/app/code/core';


@Component({
  selector: 'actions-container-toolbar',
  templateUrl: './actions-container-toolbar.component.html',
  styleUrls: ['./actions-container-toolbar.component.scss']
})
export class ActionsContainerToolbarComponent extends ComponentBase implements OnInit
{
  @Input('name') public Name: string | null = null;

  public Actions: Array<ActionBase> = [];


  constructor()
  {
    super();
  }


  public ngOnInit(): void
  {
  }

}
