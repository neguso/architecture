import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Controller, ComponentController, ViewController, ModelApplication, ComponentBase, IComponent, ModelNavigationItem, TreeNodeAction } from '../core';


//TODO read model navigation items and create actions for each item in container 'main-navigation'
@Injectable()
@Controller(ComponentBase)
export class ShowNavigationItemController extends ViewController
{
  private router: Router;


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, router: Router)
  {
    super(component, model);

    this.router = router;

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created for ${component.constructor.name}`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });

    //this.TargetViews.push('Main');

    //application.Navigation
    //..............

    this.Activated.Subscribe(() => this.OnActivated());
    this.Deactivated.Subscribe(() => this.OnDeactivated());
  }


  protected OnActivated(): void
  {
    this.CreateActions(null, this.Model.Navigation.Items);
  }

  protected OnDeactivated(): void
  {
    this.Actions.length = 0;
  }

  public CreateActions(parent: TreeNodeAction | null, items: Array<ModelNavigationItem>): void
  {
    if(items.length === 0) return;

    items.forEach(item => {
      const action = this.CreateAction(item);
      if(parent === null)
        this.Actions.push(action);
      else
        parent.Items.push(action);

      this.CreateActions(action, item.Items);
    });
  }

  public CreateAction(item: ModelNavigationItem): TreeNodeAction
  {
    const action = new TreeNodeAction(item.Id, this);
    action.Caption = item.Caption;
    action.Container = 'main-navigation';
    action.Execute.Subscribe(() => { console.log(`Navigate to ${item.View}`); this.router.navigate([], { queryParams: { view: item.View } }); });

    return action;
  }

}

