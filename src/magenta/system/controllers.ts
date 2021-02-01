import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Controller, ViewController, ModelApplication, ComponentBase, IComponent, ModelNavigationItem, TreeNodeAction, DetailView,
  DataService, ListView, DataSource, IBaseObject, SimpleAction, SortExpression } from '../core';
import { CancelEventArgs, Event, EventArgs } from '../core';


@Injectable()
@Controller(ComponentBase)
export class ShowNavigationItemController extends ViewController
{
  private router: Router;


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, router: Router)
  {
    super(component, model);

    this.router = router;

    // activate for main view only
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



export class LoadingDataErrorEventArgs extends EventArgs
{
  public readonly Error: any;


  constructor(error: any)
  {
    super();

    this.Error = error;
  }
}


@Injectable()
@Controller(ComponentBase)
export class DetailViewController extends ViewController
{
  private dataService: DataService;


  public readonly LoadingDataStarted: Event<CancelEventArgs> = new Event<CancelEventArgs>();
  public readonly LoadingDataFinished: Event<EventArgs> = new Event<EventArgs>();
  public readonly LoadingDataError: Event<LoadingDataErrorEventArgs> = new Event<LoadingDataErrorEventArgs>();


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, dataService: DataService)
  {
    super(component, model);

    // controller activates for DetailView views
    this.TargetViewType = DetailView;

    this.dataService = dataService;

    this.Activated.Subscribe(() => this.OnActivated());
  }


  protected OnActivated(): void
  {
    this.Component.Route.data.subscribe(async params => {
      this.LoadData(params['key'] ?? '');
    });
  }


  public async LoadData(key: string): Promise<void>
  {
    const view = this.View as DetailView;

    const dataStore = this.dataService.GetStore(view.Type);
    if(dataStore !== null)
    {
      try
      {
        const args = new CancelEventArgs();
        this.LoadingDataStarted.Trigger(args);
        if(!args.Cancel)
        {
          view.CurrentObject = await dataStore.Get(key);
          this.LoadingDataFinished.Trigger(EventArgs.Empty);
        }
      }
      catch(error)
      {
        this.LoadingDataError.Trigger(new LoadingDataErrorEventArgs(error));
      }
    }
  }
}



@Injectable()
@Controller(ComponentBase)
export class ListViewController extends ViewController
{
  private dataService: DataService;


  public readonly LoadingDataStarted: Event<CancelEventArgs> = new Event<CancelEventArgs>();
  public readonly LoadingDataFinished: Event<EventArgs> = new Event<EventArgs>();
  public readonly LoadingDataError: Event<LoadingDataErrorEventArgs> = new Event<LoadingDataErrorEventArgs>();


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, dataService: DataService)
  {
    super(component, model);

    // controller activates for ListView views
    this.TargetViewType = ListView;

    this.dataService = dataService;

    this.LoadingDataStarted.Subscribe(() => console.log('Start loading data'));
    this.LoadingDataFinished.Subscribe(() => console.log('Loading data finished'));
    this.LoadingDataError.Subscribe(() => console.log('Loading data error'));

    this.Activated.Subscribe(() => this.OnActivated());
  }


  protected OnActivated(): void
  {
    this.CreateDataSource();
    this.CreateActions();
    this.LoadData();
  }


  public CreateDataSource(): void
  {
    const view = this.View as ListView;
    const dataStore = this.dataService.GetStore(view.Type);
    if(dataStore !== null)
    {
      view.DataSource = new DataSource<IBaseObject>(dataStore);
      view.DataSource.PageSize = 10;
    }
  }

  public CreateActions(): void
  {
    const refresh = new SimpleAction('refresh', this);
    refresh.Execute.Subscribe(() => this.LoadData());
    this.Actions.Add(refresh);

    const sort = new SimpleAction('sort', this);
    sort.Execute.Subscribe(args => this.Sort(args.Data.active, args.Data.direction));
    this.Actions.Add(sort);

    const paginate = new SimpleAction('paginate', this);
    paginate.Execute.Subscribe(args => this.Paginate(args.Data.pageIndex, args.Data.pageSize));
    this.Actions.Add(paginate);
  }

  public async LoadData(): Promise<void>
  {
    const view = this.View as ListView;
    if(view.DataSource !== null)
    {
      try
      {
        const args = new CancelEventArgs();
        this.LoadingDataStarted.Trigger(args);
        if(!args.Cancel)
        {
          await view.DataSource.Load();
          this.LoadingDataFinished.Trigger(EventArgs.Empty);
        }
      }
      catch(error)
      {
        this.LoadingDataError.Trigger(new LoadingDataErrorEventArgs(error));
      }
    }
  }

  public async Sort(field: string, direction: string): Promise<void>
  {
    console.log(`Sort by [${field}] ${direction}`);

    const view = this.View as ListView;
    if(view.DataSource !== null)
    {
      view.DataSource.Sort.length = 0;
      if(direction !== '')
        view.DataSource.Sort.push(new SortExpression(field, direction === 'desc'));
      await view.DataSource.Load();
    }
  }

  public async Paginate(index: number, size: number): Promise<void>
  {
    console.log(`Paginate to page ${index} of size ${size}`);

    const view = this.View as ListView;
    if(view.DataSource !== null)
    {
      view.DataSource.Page = index;
      view.DataSource.PageSize = size;
      await view.DataSource.Load();
    }
  }
}
