import { Injectable, Injector, Type } from '@angular/core';


interface IDictionary<T>
{
  [key: string]: T;
}



export interface IBaseObject
{
  Id: string;
  [key: string]: any;
}

export abstract class BaseObject implements IBaseObject
{
  public Id: string;


  public constructor(id: string = '')
  {
    this.Id = id;
  }
}



@Injectable({ providedIn: 'root' })
export class Application
{
  public readonly Model: ModelApplication;


  constructor(model: ModelApplication, injector: Injector)
  {
    this.Model = model;

    ControllerManager.RegisterInjector(injector);
  }


  public Setup(): void
  {
    //TODO setup specific application with params
  }

  //TODO move this into a system module
  public CreateDetailView(viewId: string): DetailView | null
  {
    if(typeof this.Model.Views[viewId] === 'undefined')
      return null;

    const model = this.Model.Views[viewId] as ModelDetailView;
    const view = new DetailView(viewId, model.ObjectType, null, this.Model);

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


  public constructor()
  {
    this.Options = new ModelApplicationOptions();
  }


  //#region Model creation helpers

  public RegisterDataModel(type: Type<IBaseObject>, node: IModelDataModel): void
  {
    this.DataModels[type.name] = new ModelDataModel(this, type, node);
  }

  public RegisterDataModelMembers(type: Type<IBaseObject>, members: IDictionary<IModelDataModelMember>): void
  {
    for(const member of Object.keys(members))
      this.DataModels[type.name].Members[member] = new ModelDataModelMember(this.DataModels[type.name], member, members[member]);
  }

  public RegisterListView(name: string, type: Type<IBaseObject>, node: IModelListView): void
  {
    this.Views[name] = new ModelListView(this, name, type, node);
  }

  public RegisterListViewColumns(name: string, columns: IDictionary<IModelListViewColumn>): void
  {
    for(const column of Object.keys(columns))
      (this.Views[name] as ModelListView).Colunms[column] = new ModelListViewColumn(this.Views[name], column, columns[column]);
  }

  public RegisterDetailView(name: string, type: Type<IBaseObject>, init?: IModelDetailView): void
  {
    this.Views[name] = new ModelDetailView(this, name, type, init);
  }

  public RegisterStaticTextItem(name: string, field: string, init?: IModelStaticTextItem): void
  {
    (this.Views[name] as ModelDetailView).Items[field] = new ModelStaticTextItem(this.Views[name], field, init);
  }

  public RegisterStaticImageItem(name: string, field: string, init?: IModelStaticImageItem): void
  {
    (this.Views[name] as ModelDetailView).Items[field] = new ModelStaticImageItem(this.Views[name], field, init);
  }

  public RegisterActionsContainerItem(name: string, container: string, init?: IModelActionContainerItem): void
  {
    (this.Views[name] as ModelDetailView).Items[container] = new ModelActionContainerItem(this.Views[name], container, init);
  }

  public RegisterAction(name: string, init?: IModelAction): void
  {

  }

  // public RegisterDetailViewItems(name: string, items: IDictionary<IModelDetailViewItem>): void
  // {
  //   for(const item of Object.keys(items))
  //     (this.Views[name] as ModelDetailView).Items[item] = new ModelDetailViewItem(this.Views[name], item, items[item]);
  // }

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
  public DataStore: DataStore<BaseObject> | null = null;


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


  constructor(parent: IModelNode, init?: IModelListViewColumn)
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


  public constructor(parent: IModelNode, name: string, type: Type<IBaseObject>, init?: IModelListView)
  {
    super(parent, name, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}


export interface IModelListViewColumn
{
  Index?: number;
  Caption?: string | null;
}

export class ModelListViewColumn extends ModelViewField implements IModelListViewColumn
{
  constructor(parent: IModelNode, field: string, init?: IModelListViewColumn)
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


  constructor(parent: IModelNode, name: string, type: Type<IBaseObject>, init?: IModelDetailView)
  {
    super(parent, name, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}


export interface IModelDetailViewItem
{
  Index?: number;
  Caption?: string | null;
  MaxLength?: number;
}

export abstract class ModelDetailViewItem extends ModelViewField implements IModelDetailViewItem
{
  //TODO consider removing this prop
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


  constructor(parent: IModelNode, field: string, init?: IModelDetailViewItem)
  {
    super(parent, field);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
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




export class EventArgs
{
  public static readonly Empty: EventArgs = new EventArgs();
}


export class Event<T extends EventArgs>
{
  protected readonly Handlers: Array<(data: T) => void> = [];


  public Subscribe(handler: (data: T) => void): void
  {
    this.Handlers.push(handler);
  }

  public Unsubscribe(handler: (data: T) => void): void
  {
    this.Handlers.splice(this.Handlers.indexOf(handler), 1);
  }

  public UnsubscribeAll(): void
  {
    this.Handlers.length = 0;
  }

  public Trigger(data: T): void
  {
    this.Handlers.slice(0).forEach(handler => handler(data));
  }
}



export class EventAggregator
{
  protected Events: IDictionary<Event<any>> = {};


  public Register(name: string): void
  {
    if(this.Events.hasOwnProperty(name))
      throw new Error(`Duplicate event: ${name}.`);

    this.Events[name] = new Event<any>();
  }

  public Unregister(name: string): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].UnsubscribeAll();
    delete this.Events[name];
  }

  public Subscribe(name: string, handler: (data: any) => void): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].Subscribe(handler);
  }

  public Unsubscribe(name: string, handler: (data: any) => void): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].Unsubscribe(handler);
  }

  public Trigger(name: string, data: any): void
  {
    if(!this.Events.hasOwnProperty(name))
      throw new Error(`Event not found: ${name}.`);

    this.Events[name].Trigger(data);
  }
}



export interface IComponent
{
  UniqueId: string;
  Events: EventAggregator;
  View: View | null;
  State: StateManager;
}


export class ComponentBase implements IComponent
{
  public readonly UniqueId: string = ComponentBase.getInstanceCounter();
  public Events: EventAggregator = new EventAggregator();
  public View: View | null = null;
  public State: StateManager = new StateManager();


  constructor()
  {
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


export abstract class ActionBase
{
  public Id: string;
  public Controller: IController;
  public readonly Active: BoolList = new BoolList();
  public readonly Enabled: BoolList = new BoolList();
  //
  public readonly Executing: Event<ActionExecutingEventArgs> = new Event<ActionExecutingEventArgs>();
  public readonly Execute: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();
  public readonly Executed: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();
  public readonly ExecuteCanceled: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();


  constructor(id: string, controller: IController)
  {
    this.Id = id;
    this.Controller = controller;
  }


  public get Application(): ModelApplication
  {
    return this.Controller.Application;
  }

  public get Model(): ModelAction | null
  {
    if(this.Application.Actions.hasOwnProperty(this.Id))
      return this.Application.Actions[this.Id];
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


  public DoExecute(): boolean
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
      this.Execute.Trigger(new ActionBaseEventArgs(this));
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
  Application: ModelApplication;
  Actions: Array<ActionBase>;
  Active: BoolList;
  Created: Event<EventArgs>;
  Activated: Event<EventArgs>;
  Deactivated: Event<EventArgs>;
}


export abstract class ComponentController implements IController
{
  public Name: string = '';
  public Component: IComponent;
  public Application: ModelApplication;
  public readonly Actions: Array<ActionBase> = [];
  public readonly Active: BoolList = new BoolList();
  public readonly Created: Event<EventArgs> = new Event<EventArgs>();
  public readonly Activated: Event<EventArgs> = new Event<EventArgs>();
  public readonly Deactivated: Event<EventArgs> = new Event<EventArgs>();


  constructor(component: IComponent, application: ModelApplication)
  {
    this.Component = component;
    this.Application = application;

    this.Initialize();

    this.Active.ValueChanged.Subscribe(data => this.ActiveStateChanged(data));
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


  constructor(component: IComponent, application: ModelApplication)
  {
    super(component, application);
  }


  protected Initialize(): void
  {
    this.Active.SetItemValue('View Assigned', false);
  }

  protected Match(view: View): boolean
  {
    // check if view satisfy conditions for controller to be activated
    return this.TargetViews.length === 0 || this.TargetViews.includes(view.Id);
  }

  protected AddActions(view: View, actions: Array<ActionBase>): void
  {
    view.Actions.push(...actions);
  }

  protected RemoveActions(view: View, actions: Array<ActionBase>): void
  {
    actions.forEach(action => view.Actions.splice(view.Actions.findIndex(va => va === action), 1));
  }


  public SetView(view: View | null): void
  {
    if(view === null)
    {
      // remove controller actions from view
      if(this.View !== null)
        this.RemoveActions(this.View, this.Actions);

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
      this.AddActions(this.View, this.Actions);
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

    // // create controller instance if component instances already registered
    // Object.values(this.Components[componentType.name].Instances).forEach(componentInstance => {

    //   // create controller instance
    //   const controllerData = new ControllerData(controllerType, this.CreateInstance(controllerType, componentInstance.Instance));
    //   componentInstance.Controllers.push(controllerData);

    //   // fire Created and Activated events
    //   controllerData.Instance.Created.Trigger(EventArgs.Empty);
    //   controllerData.Instance.Active.SetItemValue('Controller Created', true);
    // });

    // create controller instance for all instantiated components or that derive from component
    Object.values(this.Components).filter(e => e.Type === componentType || this.Extends(e.Type, componentType)).forEach(componentData => {

      Object.values(componentData.Instances).forEach(componentInstance => {

        // create controller instance
        const controllerData = new ControllerData(controllerType, this.CreateInstance(controllerType, componentInstance.Instance));
        componentInstance.Controllers.push(controllerData);

        // fire Created and Activated events
        controllerData.Instance.Created.Trigger(EventArgs.Empty);
        controllerData.Instance.Active.SetItemValue('Controller Created', true);
      });

    });

  }

  private Extends(derived: Type<IComponent>, base: Type<IComponent>): boolean
  {
    if(derived === Object.prototype.constructor)
      return false;

    if(Object.getPrototypeOf(derived.prototype).constructor === base.prototype.constructor)
      return true;
    else
      return this.Extends(Object.getPrototypeOf(derived.prototype).constructor, base);
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

    // // create controllers instances
    // this.Components[component.constructor.name].Controllers.forEach(controllerType => {
    //   componentInstance.Controllers.push(new ControllerData(controllerType, this.CreateInstance(controllerType, component)));
    // });

    // // fire Created and Activated events
    // componentInstance.Controllers.forEach(controllerData => {
    //   if(controllerData.Instance !== null)
    //   {
    //     controllerData.Instance.Created.Trigger(EventArgs.Empty);
    //     controllerData.Instance.Active.SetItemValue('Controller Created', true);
    //   }
    // });

    // create controllers instances from component and all extended components
    Object.values(this.Components).filter(e => e.Type === component.constructor || this.Extends(component.constructor as Type<IComponent>, e.Type)).forEach(componentData => {
      Object.values(componentData.Controllers).forEach(controllerType => {
        // create controllers instances
        componentInstance.Controllers.push(new ControllerData(controllerType, this.CreateInstance(controllerType, component)));
      });
    });

    // fire Created and Activated events
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


//#region Data Store

export abstract class DataStore<T extends IBaseObject>
{
  public abstract Get(key: string): Promise<T | null>;
  public abstract Load(options?: ILoadOptions): Promise<Array<T>>;
  public abstract Insert(item: T): Promise<T>;
  public abstract Update(key: string, item: T): Promise<T | null>;
  public abstract Remove(key: string): Promise<number>;
  public abstract Count(options?: ICountOptions): Promise<number>;
}


export interface ILoadOptions
{
  Search?: string;
  Skip?: number;
  Take?: number;
}


class LoadOptions implements ILoadOptions
{
  public Search: string = '';
  public Skip: number = 0;
  public Take: number = 0;


  constructor(init: ILoadOptions)
  {
    Object.assign(this, init);
  }
}


export interface ICountOptions
{
  Filter: any;
}

class CountOptions implements ICountOptions
{
  public Filter: any;
}



export class ArrayStore<T extends IBaseObject> extends DataStore<T>
{
  public Data: Array<T> = [];


  constructor(data?: Array<T>)
  {
    super();

    if(typeof data !== 'undefined')
      this.Data = data;
  }


  public Get(key: string): Promise<T | null>
  {
    return new Promise<T | null>((resolve, reject) => { resolve(this.Data.find(value => value.Id === key) ?? null); });
  }

  public Load(options?: ILoadOptions): Promise<Array<T>>
  {
    if(typeof options === 'undefined')
      return new Promise<Array<T>>((resolve, reject) => { resolve(this.Data); });

    let items = this.Data;

    items = this.Search(items, options.Search ?? '');
    items = this.Slice(items, options.Skip ?? 0, options.Take ?? 0);

    return new Promise<Array<T>>((resolve, reject) => { resolve(items); });
  }

  public Insert(item: T): Promise<T>
  {
    return new Promise<T>((resolve, reject) => {
      this.Data.push(item);
      resolve(item);
    });
  }

  public Update(key: string, item: T): Promise<T | null>
  {
    return new Promise<T | null>((resolve, reject) => {
      const i = this.Data.findIndex(value => value.Id === key);
      if(i === -1)
      {
        resolve(null);
        return;
      }

      this.Data.splice(i, 1, item);
      resolve(item);
    });
  }

  public Remove(key: string): Promise<number>
  {
    return new Promise<number>((resolve, reject) => {
      const i = this.Data.findIndex(value => value.Id === key);
      if(i === -1)
      {
        resolve(0);
        return;
      }

      resolve(this.Data.splice(i, 1).length);
    });
  }

  public Count(options?: ICountOptions): Promise<number>
  {
    return new Promise<number>((resolve, reject) => { resolve(this.Data.length); });
  }


  protected Search(array: Array<T>, text: string): Array<T>
  {
    return array;
  }

  protected Slice(array: Array<T>, skip: number, take: number): Array<T>
  {
    return array.slice(skip, take === 0 ? array.length : skip + take);
  }
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
      throw new Error(`Invalid state: ${value}.`);
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
      if(typeof data !== 'undefined' && ([] as Array<string>).concat(states).indexOf(data.newState) !== -1)
        callback(data?.oldState, data?.newState);
    });
  }
}


export class StateChangeEventArgs
{
  constructor(public oldState: string, public newState: string) { }
}

//#endregion


//#region Views

export abstract class View
{
  public Id: string;
  public readonly Model: ModelView;
  public readonly Actions: Array<ActionBase> = [];


  constructor(id: string, application: ModelApplication)
  {
    this.Id = id;
    this.Model = application.Views[this.Id];
  }
}


export abstract class CompositeView extends View
{
  public Items: IDictionary<ViewItem> = {};


  constructor(id: string, application: ModelApplication)
  {
    super(id, application);
  }
}


export abstract class ObjectView extends CompositeView
{
  public readonly Type: Type<IBaseObject>;


  constructor(id: string, type: Type<IBaseObject>, application: ModelApplication)
  {
    super(id, application);

    this.Type = type;
  }
}


export class DashboardView extends CompositeView
{

}


export class ListView extends ObjectView
{
  //TODO


  constructor(id: string, type: Type<IBaseObject>, collectionSource: CollectionSource, application: ModelApplication)
  {
    super(id, type, application);
  }
}


export class DetailView extends ObjectView
{
  public CurrentObject: IBaseObject | null;
  public Mode: ViewEditMode = ViewEditMode.View;


  constructor(id: string, type: Type<IBaseObject>, object: IBaseObject | null, application: ModelApplication)
  {
    super(id, type, application);

    this.CurrentObject = object;
  }
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





export class CollectionSource
{
  public readonly Type: Type<IBaseObject>;
  public readonly Model: ModelDataModel;


  constructor(type: Type<IBaseObject>, application: ModelApplication)
  {
    this.Type = type;
    this.Model = application.DataModels[type.name];
  }
}

//#endregion
