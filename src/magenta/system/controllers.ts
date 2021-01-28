import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Controller, ComponentController, ViewController, ModelApplication, ComponentBase, IComponent, ModelNavigationItem, TreeNodeAction, DetailView, DataService } from '../core';


@Injectable()
@Controller(ComponentBase)
export class ShowNavigationItemController extends ViewController
{
  private router: Router;


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, router: Router)
  {
    super(component, model);

    this.router = router;

    //TODO need to filter view activation so that do not activate for all views
    this.TargetViews.push('Main_DetailView');

    this.Activated.Subscribe(() => this.OnActivated());
    this.Deactivated.Subscribe(() => this.OnDeactivated());
  }


  protected OnActivated(): void
  {
    this.CreateActions(null, this.Model.Navigation.Items);
  }

  protected OnDeactivated(): void
  {
    this.Actions.Clear();
  }

  public CreateActions(parent: TreeNodeAction | null, items: Array<ModelNavigationItem>): void
  {
    items.forEach(item => {
      const action = this.CreateAction(item);
      if(parent === null)
        this.Actions.Add(action);
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
    action.Execute.Subscribe(() => { console.log(`Navigate to ${item.View}`); this.router.navigate(item.Path, { }); });

    return action;
  }
}



@Injectable()
@Controller(ComponentBase)
export class DetailViewController extends ViewController
{
  private dataService: DataService;


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, dataService: DataService)
  {
    super(component, model);

    this.TargetViewType = DetailView;

    this.dataService = dataService;

    this.Activated.Subscribe(() => this.OnActivated());
  }


  protected OnActivated(): void
  {
    const view = this.View as DetailView;

    const dataStore = this.dataService.GetStore(view.Type);
    if(dataStore !== null)
    {
      this.Component.Route.data.subscribe(async params => {
        const key = params['key'] ?? '';
        const obj = await dataStore.Get(key);
        view.CurrentObject = obj;
      });
    }
  }
}
