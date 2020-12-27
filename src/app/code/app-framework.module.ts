import { NgModule, Type, Injectable, Injector } from '@angular/core';


@NgModule({
  providers: []
})
export class AppFrameworkModule
{
  public constructor(injector: Injector, model: ModelApplication)
  {
    console.log(`Module ${this.constructor.name} created`);

    ControllerManager.RegisterInjector(injector);

    // default application model
    //...
  }
}



interface IDictionary<T>
{
  [key: string]: T;
}


export enum FieldType
{
  Boolean = 'boolean',
  Number = 'number',
  String = 'string',
  Object = 'object'
}



export interface IBaseObject
{
  Id: string;
}

export abstract class BaseObject implements IBaseObject
{
  public Id: string;

  public constructor(id: string = '')
  {
    this.Id = id;
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

  public RegisterDetailViewItems(name: string, items: IDictionary<IModelDetailViewItem>): void
  {
    for(const item of Object.keys(items))
      (this.Views[name] as ModelDetailView).Items[item] = new ModelDetailViewItem(this.Views[name], item, items[item]);
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
  public Parent: IModelNode;

  public ObjectType: Type<IBaseObject>;
  public Caption: string = '';
  public Members: IDictionary<ModelDataModelMember> = {};


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
  Type?: FieldType;
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
  public Type: FieldType = FieldType.String;
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
      return this.Model.DataModels[this.View.ObjectType.name].Members[this.Field].Caption;
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

export class ModelDetailViewItem extends ModelViewField implements IModelDetailViewItem
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


//#endregion



//#region Actions

export interface IModelAction
{
  Index?: number;
  Container?: string;
  Caption?: string;
  ShortCaption?: string;
  ToolTip?: string;
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
  Events: EventAggregator;
  State: StateManager;
}


export abstract class ComponentBase implements IComponent
{
  public Events: EventAggregator = new EventAggregator();
  public State: StateManager = new StateManager();


  constructor()
  {
    // register component for controllers
    ControllerManager.RegisterComponent(this);
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

  private container: string | null = null;
  public get Container(): string
  {
    return this.container ?? this.Application.Actions[this.Id]?.Container ?? PredefinedContainer.Unspecified;
  }
  public set Container(value: string)
  {
    this.container = value;
  }

  private caption: string | null = null;
  public get Caption(): string
  {
    return this.caption ?? this.Application.Actions[this.Id]?.Caption ?? this.Id;
  }
  public set Caption(value: string)
  {
    this.caption = value;
  }

  private shortCaption: string | null = null;
  public get ShortCaption(): string
  {
    return this.shortCaption ?? this.Application.Actions[this.Id]?.ShortCaption ?? this.Caption;
  }
  public set ShortCaption(value: string)
  {
    this.shortCaption = value;
  }

  public toolTip: string | null = null;
  public get ToolTip(): string
  {
    return this.toolTip ?? this.Application.Actions[this.Id]?.ToolTip ?? '';
  }
  public set ToolTip(value: string)
  {
    this.toolTip = value;
  }


  public DoExecute(): void
  {
    const executingArgs = new ActionExecutingEventArgs(this);
    this.Executing.Trigger(executingArgs);
    if(executingArgs.Cancel)
      this.ExecuteCanceled.Trigger(new ActionBaseEventArgs(this));
    else
    {
      this.Execute.Trigger(new ActionBaseEventArgs(this));
      this.Executed.Trigger(new ActionBaseEventArgs(this));
    }
  }
}


export class SimpleAction extends ActionBase
{
  constructor(id: string, controller: IController)
  {
    super(id, controller);
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
  public Instance: IController | null;

  constructor(type: Type<IController>, instance: IController | null)
  {
    this.Type = type;
    this.Instance = instance;
  }
}

class ComponentData
{
  public Type: Type<IComponent>;
  public Instance: IComponent | null;
  public Injector: Injector | undefined;
  public readonly Controllers: Array<ControllerData> = [];

  constructor(type: Type<IComponent>, instance: IComponent | null)
  {
    this.Type = type;
    this.Instance = instance;
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
      this.Components[componentType.name] = new ComponentData(componentType, null);

    // check if controller is already registered for component
    if(this.Components[componentType.name].Controllers.find(c => c.Type === controllerType))
      return;

    // create controller entry
    const controller = new ControllerData(controllerType, null);
    this.Components[componentType.name].Controllers.push(controller);

    // create controller instance if component instance already registered
    if(this.Components[componentType.name].Instance !== null)
    {
      this.CreateInstance(controller, this.Components[componentType.name]);
      if(controller.Instance !== null)
      {
        controller.Instance.Created.Trigger(new ControllerCreatedEventArgs(controller.Instance));
        if(controller.Instance.Active.Value)
          controller.Instance.Activated.Trigger(new ControllerActiveStateChangedEventArgs(controller.Instance));
      }
    }
  }

  private GetControllers(component: IComponent): Array<IController>
  {
    if(this.Components.hasOwnProperty(component.constructor.name))
      return this.Components[component.constructor.name].Controllers.map(c => c.Instance as IController);
    return [];
  }

  private RegisterComponent(component: IComponent): void
  {
    // create component entry if necessary
    if(!this.Components.hasOwnProperty(component.constructor.name))
      this.Components[component.constructor.name] = new ComponentData(component.constructor as Type<IComponent>, null);

    // check if component is already registered
    if(this.Components[component.constructor.name].Instance !== null)
      return;

    this.Components[component.constructor.name].Instance = component;
    this.Components[component.constructor.name].Injector = this.injector as Injector;

    // create controllers instances
    this.Components[component.constructor.name].Controllers.forEach(controller => {
      this.CreateInstance(controller, this.Components[component.constructor.name]);
    });

    // fire Created and Activated events
    this.Components[component.constructor.name].Controllers.forEach(controller => {
      if(controller.Instance !== null)
      {
        controller.Instance.Created.Trigger(new ControllerCreatedEventArgs(controller.Instance));
        if(controller.Instance.Active.Value)
          controller.Instance.Activated.Trigger(new ControllerActiveStateChangedEventArgs(controller.Instance));
      }
    });
  }

  private RegisterInjector(injector: Injector): void
  {
    this.injector = injector;
  }

  private CreateInstance(controller: ControllerData, component: ComponentData): void
  {
    // create an injector with controller and component providers with main injector as parent
    const providers = [
      { provide: controller.Type },
      { provide: component.Instance?.constructor, useValue: component.Instance },
      { provide: 'IComponent', useValue: component.Instance }
    ];
    const injector = Injector.create({ providers, parent: component.Injector });
    controller.Instance = injector.get(controller.Type) as IController;
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
  public abstract Load(options?: LoadOptions): Promise<Array<T>>;
  public abstract Insert(item: T): Promise<T>;
  public abstract Update(key: string, item: T): Promise<T | null>;
  public abstract Remove(key: string): Promise<number>;
  public abstract Count(options?: CountOptions): Promise<number>;
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

class CountOptions
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

  public Count(options?: CountOptions): Promise<number>
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
  public Items: Array<ViewItem> = new Array<ViewItem>();


  constructor(id: string, application: ModelApplication)
  {
    super(id, application);
  }
}

export class DashboardView extends CompositeView
{

}


export class ObjectView extends CompositeView
{
  public readonly Type: Type<IBaseObject>;


  constructor(id: string, type: Type<IBaseObject>, application: ModelApplication)
  {
    super(id, application);

    this.Type = type;
  }
}


export class ListView extends ObjectView
{

  constructor(id: string, type: Type<IBaseObject>, collectionSource: CollectionSource, application: ModelApplication)
  {
    super(id, type, application);
  }
}


export class DetailView extends ObjectView
{
  public CurrentObject: IBaseObject;
  public Mode: ViewEditMode = ViewEditMode.Edit;


  constructor(id: string, type: Type<IBaseObject>, object: IBaseObject, application: ModelApplication)
  {
    super(id, type, application);

    this.CurrentObject = object;
  }
}


export abstract class ViewItem
{

}


export enum ViewEditMode
{
  Edit,
  View
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
