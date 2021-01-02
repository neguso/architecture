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

  public CreateDetailView(viewId: string): DetailView
  {
    const model = this.Model.Views[viewId] as ModelDetailView;
    const view = new DetailView(viewId, model.ObjectType, null, this.Model);

    Object.entries(model.Items).forEach(entry => {

      if(entry[1] instanceof ModelStaticTextItem)
        view.Items[entry[0]] = new StaticTextViewItem(entry[0], view);

      //throw new Error(`Unknown detail view item type: [${entry[1].constructor.name}].`);
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
  public Parent: IModelNode | null = null;

  public Title: string = '';
  public Description: string = '';
  public Options: ModelApplicationOptions;
  public DataModels: IDictionary<ModelDataModel> = {};
  public Views: IDictionary<ModelView> = {};
  public Actions: IDictionary<ModelAction> = {};


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

  public RegisterDetailView(name: string, type: Type<IBaseObject>, node: IModelDetailView): void
  {
    this.Views[name] = new ModelDetailView(this, name, type, node);
  }

  public RegisterStaticTextItem(name: string, field: string, item: IModelStaticTextItem): void
  {
    (this.Views[name] as ModelDetailView).Items[field] = new ModelStaticTextItem(this.Views[name], field, item);
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
  public Parent: IModelNode;

  public ObjectType: Type<IBaseObject>;
  public Caption: string;
  public Members: IDictionary<ModelDataModelMember> = {};
  public DataStore: DataStore<BaseObject> = new ArrayStore<BaseObject>();


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
  public Parent: IModelNode;

  public Field: string;
  public Type: Type<any> = String;
  public Caption: string;
  public ToolTip: string = '';
  public AllowNull: boolean = true;
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



export interface IDashboardView
{
  Index?: number;
  Caption?: string | null;
}


export class ModelDashboardView extends ModelView implements IDashboardView
{
  constructor(parent: IModelNode, id: string, type: Type<IBaseObject>, init?: IDashboardView)
  {
    super(parent, id, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}

export interface IDashboardViewItem
{
  Index?: number;
  Caption?: string | null;
}

export class ModelDashboardViewItem implements IModelNode, IDashboardViewItem
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
  NotSet, Left, Center, Right
}

export enum VerticalAlign
{
  NotSet, Top, Middle, Bottom
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
  public HorizontalAlign: HorizontalAlign = HorizontalAlign.NotSet;
  public VerticalAlign: VerticalAlign = VerticalAlign.NotSet;


  constructor(parent: IModelNode, field: string, init?: IModelDetailViewItem)
  {
    super(parent, field);

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
  protected Handlers: Array<(data: T) => void> = [];


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
  protected Events: { [key: string]: Event<any> } = {};


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
  //View: View;
  State: StateManager;
}


export abstract class ComponentBase implements IComponent
{
  public readonly UniqueId: string = ComponentBase.GetUniqueId();
  public Events: EventAggregator = new EventAggregator();
  public State: StateManager = new StateManager();


  constructor()
  {
    // register component for controllers
    ControllerManager.RegisterComponent(this);
  }


  private static uniqueCounter: number = 0;
  private static GetUniqueId(): string
  {
    return (ComponentBase.uniqueCounter++).toString();
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
    this.Controller.Actions.push(this);
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


  constructor(implicitValue: boolean = true, operatorType: BoolListOperatorType = BoolListOperatorType.And)
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




export class ControllerCreatedEventArgs extends EventArgs
{
  public Controller: IController;

  constructor(controller: IController)
  {
    super();

    this.Controller = controller;
  }
}

export class ControllerActiveStateChangedEventArgs extends EventArgs
{
  public Controller: IController;

  constructor(controller: IController)
  {
    super();

    this.Controller = controller;
  }
}



export interface IController
{
  Name: string;
  Component: IComponent;
  Application: ModelApplication;
  Actions: Array<ActionBase>;
  Active: BoolList;
  Created: Event<ControllerCreatedEventArgs>;
  Activated: Event<ControllerActiveStateChangedEventArgs>;
  Deactivated: Event<ControllerActiveStateChangedEventArgs>;
}


export abstract class ControllerBase implements IController
{
  public Name: string = '';
  public Component: IComponent;
  public Application: ModelApplication;
  public readonly Actions: Array<ActionBase> = [];
  public readonly Active: BoolList = new BoolList();
  public readonly Created: Event<ControllerCreatedEventArgs> = new Event<ControllerCreatedEventArgs>();
  public readonly Activated: Event<ControllerActiveStateChangedEventArgs> = new Event<ControllerActiveStateChangedEventArgs>();
  public readonly Deactivated: Event<ControllerActiveStateChangedEventArgs> = new Event<ControllerActiveStateChangedEventArgs>();


  constructor(component: IComponent, application: ModelApplication)
  {
    this.Component = component;
    this.Application = application;

    this.Active.ValueChanged.Subscribe(data => this.ActiveStateChanged(data));
  }


  protected ActiveStateChanged(data: BoolValueChangedEventArgs): void
  {
    if(data.NewValue)
      this.Activated.Trigger(new ControllerActiveStateChangedEventArgs(this));
    else
      this.Deactivated.Trigger(new ControllerActiveStateChangedEventArgs(this));
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
  //public Instance: IComponent | null;
  public readonly Controllers: Array<Type<IController>> = [];
  public Instances: IDictionary<ComponentInstance> = {};

  constructor(type: Type<IComponent>)
  {
    this.Type = type;
    //this.Instance = instance;
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

    // create controller instance if component instances already registered
    Object.values(this.Components[componentType.name].Instances).forEach(componentInstance => {

      // create controller instance
      const controllerData = new ControllerData(controllerType, this.CreateInstance(controllerType, componentInstance.Instance));
      componentInstance.Controllers.push(controllerData);

      // fire Created and Activated events
      controllerData.Instance.Created.Trigger(new ControllerCreatedEventArgs(controllerData.Instance));
      if(controllerData.Instance.Active.Value)
        controllerData.Instance.Activated.Trigger(new ControllerActiveStateChangedEventArgs(controllerData.Instance));
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

    // create controllers instances
    this.Components[component.constructor.name].Controllers.forEach(controllerType => {
      componentInstance.Controllers.push(new ControllerData(controllerType, this.CreateInstance(controllerType, component)));
    });

    // fire Created and Activated events
    componentInstance.Controllers.forEach(controllerData => {
      if(controllerData.Instance !== null)
      {
        controllerData.Instance.Created.Trigger(new ControllerCreatedEventArgs(controllerData.Instance));
        if(controllerData.Instance.Active.Value)
          controllerData.Instance.Activated.Trigger(new ControllerActiveStateChangedEventArgs(controllerData.Instance));
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

  public static Controllers(component: IComponent): Array<IController>
  {
    return ControllerManager.Instance.GetControllers(component);
  }

  public static RegisterComponent(component: IComponent): void
  {
    ControllerManager.Instance.RegisterComponent(component);
  }

  public static RegisterInjector(injector: Injector): void
  {
    ControllerManager.Instance.RegisterInjector(injector);
  }
}




/**
 * Decorator, register a Controller for a Component.
 */
export function Controller(componentType: Type<IComponent>): (controllerType: Type<IController>) => void
{
  return (controllerType: Type<IController>): void => {
    ControllerManager.Register(controllerType, componentType);
  };
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


  constructor(id: string, application: ModelApplication)
  {
    this.Id = id;
    this.Model = application.Views[this.Id];
  }
}


export abstract class CompositeView extends View
{
  public readonly Model!: ModelDetailView;
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


  public get Model(): ModelDetailViewItem | undefined
  {
    return this.View.Model.Items[this.Id];
  }
}


export class StaticTextViewItem extends ViewItem
{

  constructor(id: string, view: DetailView)
  {
    super(id, view);
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
