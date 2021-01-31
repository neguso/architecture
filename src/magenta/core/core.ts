import { Injectable, Injector, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Collection, Event, EventAggregator, EventArgs, IDictionary, Utils } from './common';
import { DataSource, IBaseObject, SortExpression } from './data';


@Injectable({ providedIn: 'root' })
export class Application
{
  public readonly Model: ModelApplication;


  constructor(model: ModelApplication)
  {
    this.Model = model;
  }


  public Setup(): void
  {
    //TODO setup specific application with params
  }


  public CreateView(model: ModelView): View | null
  {
    if(model instanceof ModelDetailView)
      return this.CreateDetailView(model);
    else if(model instanceof ModelListView)
      return this.CreateListView(model);

    return null;
  }

  public CreateListView(model: ModelListView): ListView
  {
    // create view
    const view = new ListView(model.Id, model.ObjectType, this.Model);

    // create view colums
    Object.entries(model.Colunms).forEach(entry => {

      const key = entry[0];
      const value = entry[1];

      if(value instanceof ModelStaticTextColunm)
        view.Items[key] = new StaticTextColumn(key, view);
      else
        throw new Error(`Unknown list view column type: ${key}:${value.constructor.name}.`);
    });

    return view;
  }

  public CreateDetailView(model: ModelDetailView): DetailView
  {
    // create view
    const view = new DetailView(model.Id, model.ObjectType, this.Model);

    // create view items
    Object.entries(model.Items).forEach(entry => {

      const key = entry[0];
      const value = entry[1];

      if(value instanceof ModelStaticTextItem)
        view.Items[key] = new StaticTextViewItem(key, view);
      else if(value instanceof ModelStaticImageItem)
        view.Items[key] = new StaticImageViewItem(key, view);
      else if(value instanceof ModelActionContainerItem)
        view.Items[key] = new ActionsContainerViewItem(key, view);
      else
        throw new Error(`Unknown detail view item type: ${key}:${value.constructor.name}.`);
    });

    return view;
  }
}



export interface IModelNode
{
  Index: number;
  Parent: IModelNode | null;
}


export class ModelApplicationOptions
{
  public ProtectedContentText: string = 'Protected Content';
  public Child: ModelApplicationOptionsChild = new ModelApplicationOptionsChild();
}

export class ModelApplicationOptionsChild
{
  public SampleProperty: string = '';
}



@Injectable({ providedIn: 'root' })
export class ModelApplication implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode | null = null;

  public Title: string = '';
  public Description: string = '';
  public readonly Options: ModelApplicationOptions;
  public readonly DataModels: IDictionary<ModelDataModel> = {};
  public readonly Views: IDictionary<ModelView> = {};
  public readonly Actions: IDictionary<ModelAction> = {};
  public readonly Navigation: ModelNavigation;



  public constructor()
  {
    this.Options = new ModelApplicationOptions();
    this.Navigation = new ModelNavigation(this);
  }


  //#region Model creation helpers

  public RegisterDataModel(type: Type<IBaseObject>, node?: IModelDataModel): void
  {
    this.DataModels[type.name] = new ModelDataModel(this, type, node);
  }

  public RegisterDataModelMembers(type: Type<IBaseObject>, members: IDictionary<IModelDataModelMember>): void
  {
    for(const member of Object.keys(members))
      this.DataModels[type.name].Members[member] = new ModelDataModelMember(this.DataModels[type.name], member, members[member]);
  }

  public RegisterDetailView(id: string, type: Type<IBaseObject>, init?: IModelDetailView): void
  {
    this.Views[id] = new ModelDetailView(this, id, type, init);
  }

  public RegisterStaticTextItem(id: string, field: string, init?: IModelStaticTextItem): void
  {
    (this.Views[id] as ModelDetailView).Items[field] = new ModelStaticTextItem(this.Views[id], field, init);
  }

  public RegisterStaticImageItem(id: string, field: string, init?: IModelStaticImageItem): void
  {
    (this.Views[id] as ModelDetailView).Items[field] = new ModelStaticImageItem(this.Views[id], field, init);
  }

  public RegisterActionsContainerItem(id: string, container: string, init?: IModelActionContainerItem): void
  {
    (this.Views[id] as ModelDetailView).Items[container] = new ModelActionContainerItem(this.Views[id], container, init);
  }

  public RegisterListView(id: string, type: Type<IBaseObject>, init?: IModelListView): void
  {
    this.Views[id] = new ModelListView(this, id, type, init);
  }

  public RegisterStaticTextColumn(id: string, field: string, init?: IModelStaticTextColunm): void
  {
    (this.Views[id] as ModelListView).Colunms[field] = new ModelStaticTextColunm(this.Views[id], field, init);
  }

  public RegisterAction(id: string, init?: IModelAction): void
  {
    this.Actions[id] = new ModelAction(this, id, init);
  }

  public RegisterNavigationItems(parent: ModelNavigation | ModelNavigationItem, items: Array<{ id: string, item?: IModelNavigationItem }>): void
  {
    parent.Items.push(...items.map(e => new ModelNavigationItem(this.Navigation, e.id, e.item)));
  }

  //#endregion
}



export interface IModelDataModel
{
  Index?: number;
  Caption?: string;
}

export class ModelDataModel implements IModelNode, IModelDataModel
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public ObjectType: Type<IBaseObject>;
  public Caption: string;
  public readonly Members: IDictionary<ModelDataModelMember> = {};


  public constructor(parent: IModelNode, objectType: Type<IBaseObject>, init?: IModelDataModel)
  {
    this.Parent = parent;
    this.ObjectType = objectType;

    // set default values
    this.Caption = objectType.name;

    // set user provided values
    Object.assign(this, init);
  }
}



export interface IModelDataModelMember
{
  Index?: number;
  Type?: Type<any>;
  Caption?: string;
  ToolTip?: string;
  AllowNull?: boolean;
  NullText?: string;
  MaxLength?: number;
}

export class ModelDataModelMember implements IModelNode, IModelDataModelMember
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public Field: string;
  public Type: Type<any> = String;
  public Caption: string;
  public ToolTip: string = '';
  public AllowNull: boolean = false;
  public NullText: string = '';
  public MaxLength: number = 50;


  constructor(parent: IModelNode, field: string, init?: IModelDataModelMember)
  {
    this.Parent = parent;
    this.Field = field;

    // set default values
    this.Caption = field;

    // set user provided values
    Object.assign(this, init);
  }
}


//#region Views Application Model


export abstract class ModelView implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public Id: string;
  public ObjectType: Type<IBaseObject>;

  private caption: string | null = null;
  public set Caption(value: string)
  {
    this.caption = value;
  }
  public get Caption(): string
  {
    if(this.caption == null)
      return this.Model.DataModels[this.ObjectType.name].Caption;
    return this.caption;
  }


  protected get Model(): ModelApplication { return this.Parent as ModelApplication; }


  public constructor(parent: IModelNode, id: string, type: Type<IBaseObject>)
  {
    this.Parent = parent;
    this.Id = id;
    this.ObjectType = type;
  }
}

export abstract class ModelViewField implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public Field: string;

  private caption: string | null = null;
  public set Caption(value: string)
  {
    this.caption = value;
  }
  public get Caption(): string
  {
    if(this.caption == null)
      return this.Model.DataModels[this.View.ObjectType.name]?.Members[this.Field]?.Caption ?? this.Field;
    return this.caption;
  }


  protected get View(): ModelView { return this.Parent as ModelView; }
  protected get Model(): ModelApplication { return this.Parent.Parent as ModelApplication; }


  public constructor(parent: IModelNode, field: string)
  {
    this.Parent = parent;
    this.Field = field;
  }
}



export interface IModelDashboardView
{
  Index?: number;
  Caption?: string | null;
}

export class ModelDashboardView extends ModelView implements IModelDashboardView
{
  constructor(parent: IModelNode, id: string, type: Type<IBaseObject>, init?: IModelDashboardView)
  {
    super(parent, id, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}


export interface IModelDashboardViewItem
{
  Index?: number;
  Caption?: string | null;
}

export class ModelDashboardViewItem implements IModelNode, IModelDashboardViewItem
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;


  constructor(parent: IModelNode, init?: IModelDashboardViewItem)
  {
    this.Parent = parent;

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}



export interface IModelListView
{
  Index?: number;
  Caption?: string | null;
}

export class ModelListView extends ModelView implements IModelListView
{
  public Colunms: IDictionary<ModelListViewColumn> = {};


  public constructor(parent: IModelNode, id: string, type: Type<IBaseObject>, init?: IModelListView)
  {
    super(parent, id, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}



export enum ColumnSortOrder
{
  Ascending, Descending
}


export abstract class ModelListViewColumn extends ModelViewField
{
  public SortIndex: number = -1;
  public SortOrder: ColumnSortOrder = ColumnSortOrder.Ascending;


  constructor(parent: IModelNode, field: string)
  {
    super(parent, field);

    // set default values
    //...
  }
}


export interface IModelStaticTextColunm
{
  Index?: number;
  Caption?: string | null;
  SortIndex?: number;
  SortOrder?: ColumnSortOrder;
}


export class ModelStaticTextColunm extends ModelListViewColumn implements IModelStaticTextColunm
{
  constructor(parent: IModelNode, field: string, init?: IModelStaticTextColunm)
  {
    super(parent, field);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}



export interface IModelDetailView
{
  Index?: number;
  Caption?: string | null;
}

export class ModelDetailView extends ModelView implements IModelDetailView
{
  public Items: IDictionary<ModelDetailViewItem> = {};


  constructor(parent: IModelNode, id: string, type: Type<IBaseObject>, init?: IModelDetailView)
  {
    super(parent, id, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}



export abstract class ModelDetailViewItem extends ModelViewField
{
  //TODO move this property in property editor item
  private maxLength: number | null = null;
  public set MaxLength(value: number)
  {
    this.maxLength = value;
  }
  public get MaxLength(): number
  {
    if(this.maxLength == null)
      return this.Model.DataModels[this.View.ObjectType.name].Members[this.Field].MaxLength;
    return this.maxLength;
  }


  constructor(parent: IModelNode, field: string)
  {
    super(parent, field);

    // set default values
    //...
  }
}



export enum HorizontalAlign
{
  Left, Center, Right
}

export enum VerticalAlign
{
  Top, Middle, Bottom
}


export interface IModelStaticTextItem
{
  Index?: number;
  Caption?: string | null;
  MaxLength?: number;
  HorizontalAlign?: HorizontalAlign;
  VerticalAlign?: VerticalAlign;
}


export class ModelStaticTextItem extends ModelDetailViewItem implements IModelStaticTextItem
{
  public HorizontalAlign: HorizontalAlign = HorizontalAlign.Left;
  public VerticalAlign: VerticalAlign = VerticalAlign.Top;


  constructor(parent: IModelNode, field: string, init?: IModelStaticTextItem)
  {
    super(parent, field);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}


export enum ImageSizeMode
{
  Normal, Stretch, Center, Zoom
}


export interface IModelStaticImageItem
{
  Index?: number;
  Caption?: string | null;
  MaxLength?: number;
  HorizontalAlign?: HorizontalAlign;
  VerticalAlign?: VerticalAlign;
  SizeMode?: ImageSizeMode;
}


export class ModelStaticImageItem extends ModelDetailViewItem implements IModelStaticImageItem
{
  public HorizontalAlign: HorizontalAlign = HorizontalAlign.Left;
  public VerticalAlign: VerticalAlign = VerticalAlign.Top;
  public SizeMode: ImageSizeMode = ImageSizeMode.Normal;


  constructor(parent: IModelNode, field: string, init?: IModelStaticImageItem)
  {
    super(parent, field);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}



export enum ActionsDisplayStyle
{
  Default, Caption, CaptionAndImage, Image
}

export enum ActionsOrientation
{
  Horizontal, Vertical
}


export interface IModelActionContainerItem
{
  Index?: number;
  Caption?: string | null;
  DisplayStyle?: ActionsDisplayStyle;
  Orientation?: ActionsOrientation;
}


export class ModelActionContainerItem extends ModelDetailViewItem implements IModelActionContainerItem
{
  public DisplayStyle: ActionsDisplayStyle = ActionsDisplayStyle.Default;
  public Orientation: ActionsOrientation = ActionsOrientation.Horizontal;
  public readonly Container: string;


  constructor(parent: IModelNode, container: string, init?: IModelActionContainerItem)
  {
    super(parent, '');

    this.Container = container;

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}




export enum NavigationStyle
{
  Tree, List, Accordion
}


export class ModelNavigation implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public NavigationStyle: NavigationStyle = NavigationStyle.List;
  public DefaultNodeImage: string = 'image';
  public DefaultLeafImage: string = 'image';
  public StartNavigationItem: ModelNavigationItem | null = null;
  public readonly Items: Array<ModelNavigationItem> = [];


  constructor(parent: IModelNode)
  {
    this.Parent = parent;
  }
}


export interface IModelNavigationItem
{
  Index?: number;
  Path?: Array<any>;
  View?: string;
  ObjectKey?: string;
  Caption?: string;
  ToolTip?: string;
  Visible?: boolean;
}


export class ModelNavigationItem implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public Id: string;
  public Path: Array<any> = [];
  public View: string = '';
  public ObjectKey: string | null = null;
  public Caption: string;
  public ToolTip: string = '';
  public Visible: boolean = true;
  public readonly Items: Array<ModelNavigationItem> = [];


  constructor(parent: IModelNode, id: string, init?: IModelNavigationItem)
  {
    this.Parent = parent;
    this.Id = id;

    // set default values
    this.Caption = this.Id;

    // set user provided values
    Object.assign(this, init);
  }


  protected get Root(): ModelNavigation
  {
    let node = this.Parent;
    while(node.Parent !== null)
    {
      node = node.Parent;
    }
    return node as ModelNavigation;
  }


  private image: string | null = null;
  public get Image(): string
  {
    return this.image ?? (this.Items.length === 0 ? this.Root.DefaultLeafImage : this.Root.DefaultNodeImage);
  }
}

//#endregion



//#region Actions

export interface IModelAction
{
  Index?: number;
  Container?: string;
  Caption?: string;
  ShortCaption?: string;
  ToolTip?: string;
  Image?: string;
}


export class ModelAction implements IModelNode, IModelAction
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public Id: string;
  public Container: string = PredefinedContainer.Unspecified;
  public Caption: string;
  public ShortCaption: string;
  public ToolTip: string = '';
  public Image: string = '';


  constructor(parent: IModelNode, id: string, init?: IModelAction)
  {
    this.Parent = parent;
    this.Id = id;

    // set default values
    this.Caption = this.Id;
    this.ShortCaption = this.Caption;

    // set user provided values
    Object.assign(this, init);
  }
}


export enum PredefinedContainer
{
  Unspecified = 'Unspecified',
  Menu = 'Menu',
  Toolbar = 'Toolbar',
  Navigation = 'Navigation',
  Status = 'Status',
  Contextual = 'Contextual'
}


//#endregion








export interface IComponent
{
  UniqueId: string;
  View: View | null;
  Route: ActivatedRoute;
  //
  Events: EventAggregator;
  State: StateManager;
  //
  SetView(view: View | null): void;
}


export class ComponentBase implements IComponent
{
  public readonly UniqueId: string = ComponentBase.getInstanceCounter();
  public View: View | null = null;
  public readonly Route: ActivatedRoute;
  //
  public Events: EventAggregator = new EventAggregator();
  public State: StateManager = new StateManager();


  constructor(route: ActivatedRoute)
  {
    this.Route = route;

    // register component for controllers
    ControllerManager.RegisterComponent(this);
  }


  public SetView(view: View | null): void
  {
    // deactivate existing view controllers
    if(this.View !== null)
      ControllerManager.SetView(null, this);

    this.View = view;

    // activate new view controllers
    ControllerManager.SetView(view, this);

    console.log(`View ${view?.Id} set for component ${this.constructor.name}`);
  }


  private static instanceCounter: number = 0;
  private static getInstanceCounter(): string
  {
    return (ComponentBase.instanceCounter++).toString();
  }
}



export class ActionBaseEventArgs extends EventArgs
{
  public Action: ActionBase;


  constructor(public action: ActionBase)
  {
    super();

    this.Action = action;
  }
}


export class ActionExecutingEventArgs extends ActionBaseEventArgs
{
  public Cancel: boolean = false;


  constructor(action: ActionBase)
  {
    super(action);
  }
}

export class ActionExecuteEventArgs extends ActionBaseEventArgs
{
  public Data: any;


  constructor(action: ActionBase, data?: any)
  {
    super(action);

    this.Data = data;
  }
}


export abstract class ActionBase
{
  public Id: string;
  public Controller: IController;
  public readonly Active: BoolList = new BoolList();
  public readonly Enabled: BoolList = new BoolList();
  //
  public readonly Executing: Event<ActionExecutingEventArgs> = new Event<ActionExecutingEventArgs>();
  public readonly Execute: Event<ActionExecuteEventArgs> = new Event<ActionExecuteEventArgs>();
  public readonly Executed: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();
  public readonly ExecuteCanceled: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();


  constructor(id: string, controller: IController)
  {
    this.Id = id;
    this.Controller = controller;
  }


  public get Model(): ModelAction | null
  {
    if(this.Controller.Model.Actions.hasOwnProperty(this.Id))
      return this.Controller.Model.Actions[this.Id];
    return null;
  }

  private container: string | null = null;
  public get Container(): string
  {
    return this.container ?? this.Model?.Container ?? PredefinedContainer.Unspecified;
  }
  public set Container(value: string)
  {
    this.container = value;
  }

  private caption: string | null = null;
  public get Caption(): string
  {
    return this.caption ?? this.Model?.Caption ?? this.Id;
  }
  public set Caption(value: string)
  {
    this.caption = value;
  }

  private shortCaption: string | null = null;
  public get ShortCaption(): string
  {
    return this.shortCaption ?? this.Model?.ShortCaption ?? this.Caption;
  }
  public set ShortCaption(value: string)
  {
    this.shortCaption = value;
  }

  public toolTip: string | null = null;
  public get ToolTip(): string
  {
    return this.toolTip ?? this.Model?.ToolTip ?? '';
  }
  public set ToolTip(value: string)
  {
    this.toolTip = value;
  }

  public image: string | null = null;
  public get Image(): string
  {
    return this.image ?? this.Model?.Image ?? '';
  }
  public set Image(value: string)
  {
    this.image = value;
  }


  public DoExecute(data?: any): boolean
  {
    const executingArgs = new ActionExecutingEventArgs(this);
    this.Executing.Trigger(executingArgs);
    if(executingArgs.Cancel)
    {
      this.ExecuteCanceled.Trigger(new ActionBaseEventArgs(this));
      return false;
    }
    else
    {
      this.Execute.Trigger(new ActionExecuteEventArgs(this, data));
      this.Executed.Trigger(new ActionBaseEventArgs(this));
    }
    return true;
  }
}


export class SimpleAction extends ActionBase
{
  constructor(id: string, controller: IController)
  {
    super(id, controller);
  }
}


export class TreeNodeAction extends ActionBase
{
  public readonly Items: Array<TreeNodeAction> = [];


  constructor(id: string, controller: IController)
  {
    super(id, controller);
  }
}


export class ParametrizedAction extends ActionBase
{
  public readonly ValueType: Type<any>;
  public NullValuePrompt: string = '';


  constructor(id: string, controller: IController, valueType: Type<any>)
  {
    super(id, controller);

    this.ValueType = valueType;
  }
}



export enum BoolListOperatorType
{
  And, Or
}


export class BoolValueChangedEventArgs extends EventArgs
{
  public OldValue: boolean;
  public NewValue: boolean;

  constructor(oldValue: boolean, newValue: boolean)
  {
    super();

    this.OldValue = oldValue;
    this.NewValue = newValue;
  }
}



export class BoolList
{
  protected Suspended: number = 0;
  protected ChangesCount: number = 0;
  protected BeginValue: boolean = false;
  protected readonly Items: IDictionary<boolean> = {};
  protected ImplicitValue: boolean;
  protected OperatorType: BoolListOperatorType;


  public readonly Changed: Event<EventArgs> = new Event<EventArgs>();
  public readonly ValueChanged: Event<BoolValueChangedEventArgs> = new Event<BoolValueChangedEventArgs>();


  constructor(implicitValue: boolean = false, operatorType: BoolListOperatorType = BoolListOperatorType.And)
  {
    this.ImplicitValue = implicitValue;
    this.OperatorType = operatorType;
  }


  public get Value(): boolean
  {
    if(Object.keys(this.Items).length === 0)
      return this.ImplicitValue;
    if(this.OperatorType === BoolListOperatorType.And)
      return Object.values(this.Items).every(value => value);
    return Object.values(this.Items).some(value => value);
  }

  public get Keys(): Array<string>
  {
    return Object.keys(this.Items);
  }

  public get Count(): number
  {
    return Object.keys(this.Items).length;
  }

  public SetItemValue(key: string, value: boolean): void
  {
    if(this.Items[key] !== value)
    {
      const oldValue = this.Value;

      this.Items[key] = value;

      if(this.Suspended === 0)
      {
        this.Changed.Trigger(EventArgs.Empty);
        if(oldValue !== this.Value)
          this.ValueChanged.Trigger(new BoolValueChangedEventArgs(oldValue, this.Value));
      }
      else
        this.ChangesCount++;
    }
  }

  public GetItemValue(key: string): boolean
  {
    if(this.Items.hasOwnProperty(key))
      return this.Items[key];
    throw new Error(`Item [${key}] not found.`);
  }

  public RemoveItem(key: string): void
  {
    if(this.Items.hasOwnProperty(key))
    {
      const oldValue = this.Value;

      delete this.Items[key];

      if(this.Suspended === 0)
      {
        this.Changed.Trigger(EventArgs.Empty);
        if(oldValue !== this.Value)
          this.ValueChanged.Trigger(new BoolValueChangedEventArgs(oldValue, this.Value));
      }
      else
        this.ChangesCount++;
    }
  }

  public BeginUpdate(): void
  {
    if(this.Suspended === 0)
      this.BeginValue = this.Value;

    this.Suspended++;
  }

  public EndUpdate(): void
  {
    if(this.Suspended > 0)
    {
      this.Suspended--;

      if(this.Suspended === 0 && this.ChangesCount > 0)
      {
        this.Changed.Trigger(EventArgs.Empty);
        this.ChangesCount = 0;

        if(this.BeginValue !== this.Value)
          this.ValueChanged.Trigger(new BoolValueChangedEventArgs(this.BeginValue, this.Value));
      }
    }
  }
}



export interface IController
{
  Name: string;
  Component: IComponent;
  Model: ModelApplication;
  Actions: Collection<ActionBase>;
  Active: BoolList;
  Created: Event<EventArgs>;
  Activated: Event<EventArgs>;
  Deactivated: Event<EventArgs>;
}


export abstract class ComponentController implements IController
{
  public Name: string = '';
  public Component: IComponent;
  public Model: ModelApplication;
  public readonly Actions: Collection<ActionBase> = new Collection<ActionBase>();
  public readonly Active: BoolList = new BoolList();
  public readonly Created: Event<EventArgs> = new Event<EventArgs>();
  public readonly Activated: Event<EventArgs> = new Event<EventArgs>();
  public readonly Deactivated: Event<EventArgs> = new Event<EventArgs>();


  constructor(component: IComponent, model: ModelApplication)
  {
    this.Component = component;
    this.Model = model;

    this.Initialize();

    this.Active.ValueChanged.Subscribe(data => this.ActiveStateChanged(data));

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created for ${component.constructor.name}`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });
  }


  protected Initialize(): void { }

  protected ActiveStateChanged(data: BoolValueChangedEventArgs): void
  {
    if(data.NewValue)
      this.Activated.Trigger(EventArgs.Empty);
    else
      this.Deactivated.Trigger(EventArgs.Empty);
  }
}


export class ViewController extends ComponentController
{
  public View: View | null = null;

  public readonly TargetViews: Array<string> = [];
  public TargetViewType: any = null;
  public TargetObjectType: any = null;


  constructor(component: IComponent, model: ModelApplication)
  {
    super(component, model);

    this.Actions.ItemAdded.Subscribe(args => this.OnActionAdded(args.AddedItem));
    this.Actions.ItemRemoved.Subscribe(args => this.OnActionRemoved(args.RemovedItem));
  }


  protected Initialize(): void
  {
    this.Active.SetItemValue('Controller Created', false);
    this.Active.SetItemValue('View Assigned', false);
  }

  protected Match(view: View): boolean
  {
    // check if view satisfy conditions for controller to be activated
    return (this.TargetViews.length === 0 || this.TargetViews.includes(view.Id))
      && (this.TargetViewType === null || view instanceof this.TargetViewType)
      && (this.TargetObjectType === null || (view instanceof ObjectView && Utils.Extends(view.Type, this.TargetObjectType)));
  }

  protected AddActions(view: View, actions: Array<ActionBase>): void
  {
    actions.forEach(action => {
      const i = view.Actions.findIndex(e => e === action);
      if(i === -1)
        view.Actions.push(action);
    });
  }

  protected RemoveActions(view: View, actions: Array<ActionBase>): void
  {
    actions.forEach(action => {
      const i = view.Actions.findIndex(e => e === action);
      if(i >= 0)
        view.Actions.splice(i, 1);
    });
  }

  protected OnActionAdded(action: ActionBase): void
  {
    if(this.View !== null)
      this.AddActions(this.View, [action]);
  }

  protected OnActionRemoved(action: ActionBase): void
  {
    if(this.View !== null)
      this.RemoveActions(this.View, [action]);
  }


  public SetView(view: View | null): void
  {
    if(view === null)
    {
      // remove controller actions from view
      if(this.View !== null)
        this.RemoveActions(this.View, this.Actions.ToArray());

      this.Active.SetItemValue('View Assigned', false);
      this.View = null;

      return;
    }

    if(this.Match(view))
    {
      // assign view and activate
      this.View = view;
      this.Active.SetItemValue('View Assigned', true);

      // add controller actions to view
      this.AddActions(this.View, this.Actions.ToArray());
    }
  }
}



//#region Controller manager


class ControllerData
{
  public Type: Type<IController>;
  public Instance: IController;

  constructor(type: Type<IController>, instance: IController)
  {
    this.Type = type;
    this.Instance = instance;
  }
}

class ComponentInstance
{
  public Instance: IComponent;
  public readonly Controllers: Array<ControllerData> = [];

  constructor(instance: IComponent)
  {
    this.Instance = instance;
  }
}

class ComponentData
{
  public Type: Type<IComponent>;
  public readonly Controllers: Array<Type<IController>> = [];
  public Instances: IDictionary<ComponentInstance> = {};

  constructor(type: Type<IComponent>)
  {
    this.Type = type;
  }
}



export class ControllerManager
{
  private readonly Components: IDictionary<ComponentData> = {};
  private injector: Injector | null = null;


  private Register(controllerType: Type<IController>, componentType: Type<IComponent>): void
  {
    // create component entry if necessary
    if(!this.Components.hasOwnProperty(componentType.name))
      this.Components[componentType.name] = new ComponentData(componentType);

    // check if controller is already registered for component
    if(this.Components[componentType.name].Controllers.find(c => c === controllerType))
      return;

    // create controller entry
    this.Components[componentType.name].Controllers.push(controllerType);

    // create controller instance for all instantiated components or derived from component
    Object.values(this.Components).filter(e => e.Type === componentType || Utils.Extends(e.Type, componentType)).forEach(componentData => {

      Object.values(componentData.Instances).forEach(componentInstance => {
        // create controller instance
        const controllerData = new ControllerData(controllerType, this.CreateInstance(controllerType, componentInstance.Instance));
        componentInstance.Controllers.push(controllerData);

        // fire Created event and vote to activate controller
        controllerData.Instance.Created.Trigger(EventArgs.Empty);
        controllerData.Instance.Active.SetItemValue('Controller Created', true);
      });
    });
  }

  private GetControllers(component: IComponent): Array<IController>
  {
    return this.Components[component.constructor.name]?.Instances[component.UniqueId]?.Controllers.map(c => c.Instance) ?? [];
  }

  private RegisterComponent(component: IComponent): void
  {
    // create component entry if necessary
    if(!this.Components.hasOwnProperty(component.constructor.name))
      this.Components[component.constructor.name] = new ComponentData(component.constructor as Type<IComponent>);

    // check if component is already registered
    if(this.Components[component.constructor.name].Instances.hasOwnProperty(component.UniqueId))
      return;

    const componentInstance = new ComponentInstance(component);
    this.Components[component.constructor.name].Instances[component.UniqueId] = componentInstance;

    // create controllers instances from component and all extended components
    Object.values(this.Components).filter(e => e.Type === component.constructor || Utils.Extends(component.constructor as Type<any>, e.Type)).forEach(componentData => {
      Object.values(componentData.Controllers).forEach(controllerType => {
        componentInstance.Controllers.push(new ControllerData(controllerType, this.CreateInstance(controllerType, component)));
      });
    });

    // fire Created event and vote to activate controller
    componentInstance.Controllers.forEach(controllerData => {
      if(controllerData.Instance !== null)
      {
        controllerData.Instance.Created.Trigger(EventArgs.Empty);
        controllerData.Instance.Active.SetItemValue('Controller Created', true);
      }
    });
  }

  private RegisterInjector(injector: Injector): void
  {
    this.injector = injector;
  }

  private CreateInstance(controllerType: Type<IController>, component: IComponent): IController
  {
    // create an injector with controller and component providers with main injector as parent
    const providers = [
      { provide: controllerType },
      { provide: component.constructor, useValue: component },
      { provide: 'IComponent', useValue: component }
    ];
    const injector = Injector.create({ providers, parent: this.injector ?? undefined });
    return injector.get(controllerType);
  }


  private static instance: ControllerManager;
  private static get Instance(): ControllerManager
  {
    if(typeof ControllerManager.instance === 'undefined')
      ControllerManager.instance = new ControllerManager();
    return ControllerManager.instance;
  }


  public static Register(controllerType: Type<IController>, componentType: Type<IComponent>): void
  {
    console.log(`Register controller ${controllerType.name} with component ${componentType.name}`);
    ControllerManager.Instance.Register(controllerType, componentType);
  }

  public static RegisterComponent(component: IComponent): void
  {
    console.log(`Register component instance ${component.constructor.name}:${component.UniqueId}`);
    ControllerManager.Instance.RegisterComponent(component);
  }

  public static RegisterInjector(injector: Injector): void
  {
    ControllerManager.Instance.RegisterInjector(injector);
  }

  public static GetControllers(component: IComponent): Array<IController>
  {
    return ControllerManager.Instance.GetControllers(component);
  }

  public static GetController(component: IComponent, type: Type<IController>): IController | null
  {
    return ControllerManager.Instance.GetControllers(component).find(controller => controller.constructor === type) ?? null;
  }

  public static SetView(view: View | null, component: IComponent): void
  {
    this.GetControllers(component).filter(e => e instanceof ViewController).forEach(controller => {
      (controller as ViewController).SetView(view);
    });
  }
}



/**
 * Decorator, register a Controller for a Component.
 */
export function Controller(componentType: Type<IComponent>): (controllerType: Type<IController>) => void
{
  return (controllerType: Type<IController>): void => { ControllerManager.Register(controllerType, componentType); };
}

//#endregion


//#region State Manager

export class StateManager
{
  protected States: IDictionary<any> = {};
  protected StateChange = new Event<StateChangeEventArgs>();


  constructor(...states: Array<{ state: string, value: any }>)
  {
    states.forEach(p => this.Register(p.state, p.value));
  }


  public Value(name: string): any
  {
    if(!this.States.hasOwnProperty(name))
      throw new Error(`State not found: ${name}.`);

    return this.States[name];
  }

  public get Keys(): Array<string>
  {
    return Object.getOwnPropertyNames(this.States);
  }

  private current: string = '';
  public get Current(): string
  {
    return this.current;
  }
  public set Current(value: string)
  {
    if(!this.States.hasOwnProperty(value))
      throw new Error(`State not found: ${value}.`);
    if(value === this.current)
      return;

    const old = this.current;
    this.current = value;
    this.StateChange.Trigger(new StateChangeEventArgs(old, value));
  }

  public Register(name: string, value: any): void
  {
    this.States[name] = value;
  }

  public Unregister(name: string): void
  {
    if(!this.States.hasOwnProperty(name))
      throw new Error(`State not found: ${name}.`);
    if(this.current === name)
      throw new Error(`Cannot unregister current state.`);

    delete this.States[name];
  }

  public In(...states: Array<string>): boolean
  {
    return states.indexOf(this.current) !== -1;
  }

  public When(states: string | Array<string>, callback: (oldState?: string, newState?: string) => void): void
  {
    this.StateChange.Subscribe(data =>
    {
      if(([] as Array<string>).concat(states).indexOf(data.NewState) !== -1)
        callback(data.OldState, data.NewState);
    });
  }
}


export class StateChangeEventArgs
{
  public readonly OldState: string;
  public readonly NewState: string;


  constructor(oldState: string, newState: string)
  {
    this.OldState = oldState;
    this.NewState = newState;
  }
}

//#endregion



//#region Views

export abstract class View
{
  public Id: string;
  public readonly Model: ModelView;
  public readonly Actions: Array<ActionBase> = [];


  constructor(id: string, model: ModelApplication)
  {
    this.Id = id;
    this.Model = model.Views[this.Id];
  }


  private caption: string | null = null;
  public set Caption(value: string)
  {
    this.caption = value;
  }
  public get Caption(): string
  {
    if(this.caption === null)
      return this.Model.Caption;
    return this.caption;
  }

  public GetAction(id: string): ActionBase | null
  {
    return this.Actions.find(a => a.Id === id) ?? null;
  }
}


export abstract class CompositeView extends View
{
  public Items: IDictionary<ViewItem> = {};


  constructor(id: string, model: ModelApplication)
  {
    super(id, model);
  }
}


export abstract class ObjectView extends CompositeView
{
  public readonly Type: Type<IBaseObject>;


  constructor(id: string, type: Type<IBaseObject>, model: ModelApplication)
  {
    super(id, model);

    this.Type = type;
  }
}


export class DashboardView extends CompositeView
{
  //TODO
}


export class ListView extends ObjectView
{
  public DataSource: DataSource<IBaseObject> | null = null;
  public CurrentObject: IBaseObject | null = null;
  public readonly SelectedObjects: Array<IBaseObject> = [];
  public SelectionType: SelectionType = SelectionType.Single;


  constructor(id: string, type: Type<IBaseObject>, model: ModelApplication)
  {
    super(id, type, model);
  }


  public get Columns(): Array<ColumnViewItem>
  {
    return Object.entries(this.Items)
      .map(entry => entry[1] as ColumnViewItem);
  }

  public get DisplayedColumns(): Array<string>
  {
    return Object.entries(this.Items)
      .filter(entry => (entry[1] as ColumnViewItem).Index >= 0)
      .sort((a, b) => this.ItemsOrderCompare(a[1] as ColumnViewItem, b[1] as ColumnViewItem))
      .map(entry => entry[0]);
  }


  private ItemsOrderCompare(a: ColumnViewItem, b: ColumnViewItem): number
  {
    return a.Index < b.Index ? -1 : (a.Index > b.Index ? 1 : 0);
  }
}


export class DetailView extends ObjectView
{
  public CurrentObject: IBaseObject | null = null;
  public Mode: ViewEditMode = ViewEditMode.View;


  constructor(id: string, type: Type<IBaseObject>, model: ModelApplication)
  {
    super(id, type, model);
  }
}


export enum SelectionType
{
  None, Single, Multiple
}


export enum ViewEditMode
{
  Edit,
  View
}


export abstract class ViewItem
{
  public readonly Id: string = '';
  public readonly View: CompositeView;


  constructor(id: string, view: CompositeView)
  {
    this.Id = id;
    this.View = view;
  }
}



export class StaticTextViewItem extends ViewItem
{
  constructor(id: string, view: DetailView)
  {
    super(id, view);
  }


  public get Model(): ModelDetailViewItem | undefined
  {
    return (this.View.Model as ModelDetailView).Items[this.Id];
  }

  private caption: string | null = null;
  public get Caption(): string
  {
    if(this.caption === null)
      return this.Model?.Caption ?? '';
    return this.caption;
  }
  public set Caption(value: string)
  {
    this.caption = value;
  }

  public get Text(): string
  {
    const object = (this.View as DetailView).CurrentObject;
    const field = this.Model?.Field ?? null;
    if(object === null || field === null)
      return '';
    return object[field].toString();
  }
}



export class StaticImageViewItem extends ViewItem
{
  constructor(id: string, view: DetailView)
  {
    super(id, view);
  }


  public get Model(): ModelDetailViewItem | undefined
  {
    return (this.View.Model as ModelDetailView).Items[this.Id];
  }

  private caption: string | null = null;
  public get Caption(): string
  {
    if(this.caption === null)
      return this.Model?.Caption ?? '';
    return this.caption;
  }
  public set Caption(value: string)
  {
    this.caption = value;
  }

  public get Url(): string | null
  {
    const object = (this.View as DetailView).CurrentObject;
    const field = this.Model?.Field ?? null;
    if(object === null || field === null)
      return null;
    if(!object.hasOwnProperty(field))
      return null;
    return object[field].toString();
  }
}



export class ActionsContainerViewItem extends ViewItem
{
  constructor(id: string, view: DetailView)
  {
    super(id, view);
  }


  public get Model(): ModelDetailViewItem | undefined
  {
    return (this.View.Model as ModelDetailView).Items[this.Id];
  }

  private container: string | null = null;
  public get Container(): string
  {
    if(this.container === null)
      return (this.Model as ModelActionContainerItem)?.Container ?? '';
    return this.container;
  }

  //TODO
  //public DisplayStyle: ActionsDisplayStyle;
  //public Orientation: ActionsOrientation;

  public get Actions(): Array<ActionBase>
  {
    return this.View.Actions;
  }
}



export abstract class ColumnViewItem extends ViewItem
{
  constructor(id: string, view: ListView)
  {
    super(id, view);
  }


  public get Model(): ModelListViewColumn | undefined
  {
    return (this.View.Model as ModelListView).Colunms[this.Id];
  }

  private index: number | null = null;
  public get Index(): number
  {
    if(this.index === null)
      return this.Model?.Index ?? 0;
    return this.index;
  }
  public set Index(value: number)
  {
    this.index = value;
  }

  private caption: string | null = null;
  public get Caption(): string
  {
    if(this.caption === null)
      return this.Model?.Caption ?? '';
    return this.caption;
  }
  public set Caption(value: string)
  {
    this.caption = value;
  }

  private sortIndex: number | null = null;
  public get SortIndex(): number
  {
    if(this.sortIndex === null)
      return this.Model?.SortIndex ?? -1;
    return this.sortIndex;
  }
  public set SortIndex(value: number)
  {
    this.sortIndex = value;
  }

  private sortOrder: ColumnSortOrder | null = null;
  public get SortOrder(): ColumnSortOrder
  {
    if(this.sortOrder === null)
      return this.Model?.SortOrder ?? ColumnSortOrder.Ascending;
    return this.sortOrder;
  }
  public set SortOrder(value: ColumnSortOrder)
  {
    this.sortOrder = value;
  }
}


export class StaticTextColumn extends ColumnViewItem
{
  constructor(id: string, view: ListView)
  {
    super(id, view);
  }
}

//#endregion
