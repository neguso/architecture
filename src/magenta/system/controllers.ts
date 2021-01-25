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

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created for ${component.constructor.name}`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });

    //TODO need to filter view activation so that do not activate for all views
    //this.TargetViews.push('Main');

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
    action.Execute.Subscribe(() => { console.log(`Navigate to ${item.View}`); this.router.navigate(item.Path, { }); });

    return action;
  }
}



@Injectable()
@Controller(ComponentBase)
export class DetailViewController extends ViewController
{
  private route: ActivatedRoute;
  private dataService: DataService;


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, route: ActivatedRoute, dataService: DataService)
  {
    super(component, model);

    this.TargetViewType = DetailView;

    this.route = route;
    this.dataService = dataService;

    this.Activated.Subscribe(() => this.OnActivated());
  }


  protected OnActivated(): void
  {
    const view = this.View as DetailView;

    const dataStore = this.dataService.GetStore(view.Type);
    if(dataStore !== null)
    {
      this.route.queryParams.subscribe(async params => {
        const key = params['key'] ?? '';
        const obj = await dataStore.Get(key);
        view.CurrentObject = obj;
      });
    }
  }
}
