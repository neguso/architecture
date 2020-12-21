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

    // initialize application model
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

  public RegisterListViewColumns(name: string, columns: IDictionary<IModelViewColumn>): void
  {
    for(const column of Object.keys(columns))
      (this.Views[name] as ModelListView).Colunms[column] = new ModelViewColumn(this.Views[name], column, columns[column]);
  }

  public RegisterDetailView(name: string, type: Type<IBaseObject>, node: IModelDetailView): void
  {
    this.Views[name] = new ModelDetailView(this, name, type, node);
  }

  public RegisterDetailViewItems(name: string, items: IDictionary<IModelViewItem>): void
  {
    for(const item of Object.keys(items))
      (this.Views[name] as ModelDetailView).Items[item] = new ModelViewItem(this.Views[name], item, items[item]);
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


//#region Views


export abstract class ModelView implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public Name: string;
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


  public constructor(parent: IModelNode, name: string, type: Type<IBaseObject>)
  {
    this.Parent = parent;
    this.Name = name;
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



export interface IModelListView
{
  Index?: number;
  Caption?: string | null;
}

export class ModelListView extends ModelView implements IModelListView
{
  public Colunms: IDictionary<ModelViewColumn> = {};


  public constructor(parent: IModelNode, name: string, type: Type<IBaseObject>, init?: IModelListView)
  {
    super(parent, name, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}


export interface IModelViewColumn
{
  Index?: number;
  Caption?: string | null;
}

export class ModelViewColumn extends ModelViewField implements IModelViewColumn
{
  constructor(parent: IModelNode, field: string, init?: IModelViewColumn)
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
  public Items: IDictionary<ModelViewItem> = {};


  constructor(parent: IModelNode, name: string, type: Type<IBaseObject>, init?: IModelDetailView)
  {
    super(parent, name, type);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}


export interface IModelViewItem
{
  Index?: number;
  Caption?: string | null;
  MaxLength?: number;
}

export class ModelViewItem extends ModelViewField implements IModelViewItem
{
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


  constructor(parent: IModelNode, field: string, init?: IModelViewItem)
  {
    super(parent, field);

    // set default values
    //...

    // set user provided values
    Object.assign(this, init);
  }
}


//#endregion



export class Event<T>
{
  protected Handlers: Array<(data?: T) => void> = [];


  public Subscribe(handler: (data?: T) => void): void
  {
    this.Handlers.push(handler);
  }

  public Unsubscribe(handler: (data?: T) => void): void
  {
    this.Handlers.splice(this.Handlers.indexOf(handler), 1);
  }

  public UnsubscribeAll(): void
  {
    this.Handlers.length = 0;
  }

  public Trigger(data?: T): void
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
  States: StateManager;
}


export abstract class ComponentBase implements IComponent
{
  public Events: EventAggregator = new EventAggregator();
  public States: StateManager = new StateManager();


  constructor(injector: Injector)
  {
    // register component for controllers
    ControllerManager.RegisterComponent(this);
  }
}



export class ActionBaseEventArgs
{
  constructor(public action?: ActionBase) {}
}


export class ActionExecutingEventArgs extends ActionBaseEventArgs
{
  public Cancel: boolean = false;

  constructor(action?: ActionBase)
  {
    super(action);
  }
}


export abstract class ActionBase
{
  public Executing: Event<ActionExecutingEventArgs> = new Event<ActionExecutingEventArgs>();
  public Execute: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();
  public Executed: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();
  public ExecuteCanceled: Event<ActionBaseEventArgs> = new Event<ActionBaseEventArgs>();


  public doExecute(): any
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


export class ControllerCreatedEventArgs
{
  constructor(public controller: IController) { }
}



export interface IController
{
  Name: string;
  Component: IComponent;
  Actions: Array<ActionBase>;
  Created: Event<ControllerCreatedEventArgs>;
}


export abstract class ControllerBase implements IController
{
  public Name: string = '';
  public Component: IComponent;
  public readonly Actions: Array<ActionBase> = [];
  public readonly Created: Event<ControllerCreatedEventArgs> = new Event<ControllerCreatedEventArgs>();


  constructor(component: IComponent)
  {
    this.Component = component;
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
  private Components: IDictionary<ComponentData> = {};
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
        controller.Instance.Created.Trigger(new ControllerCreatedEventArgs(controller.Instance));
    }
  }

  private GetControllers(component: IComponent): Array<IController>
  {
    if(this.Components.hasOwnProperty(component.constructor.name))
      return this.Components[component.constructor.name].Controllers.map(c => c.Instance as IController);
    return [];
  }

  //private RegisterComponent(component: IComponent, injector: Injector): void
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

    // fire afterCreated event
    this.Components[component.constructor.name].Controllers.forEach(controller => {
      if(controller.Instance !== null)
        controller.Instance.Created.Trigger(new ControllerCreatedEventArgs(controller.Instance));
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

  //public static RegisterComponent(component: IComponent, injector: Injector): void
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
 * Decorator, register a controller class.
 */
export function Controller(componentType: Type<IComponent>): (controllerType: Type<IController>) => void
{
  return (controllerType: Type<IController>): void => {
    ControllerManager.Register(controllerType, componentType);
  };
}

//#endregion




//#region State Manager

export class StateManager
{
  protected States: IDictionary<any> = {};
  protected StateChange = new Event<StateChangeEventArgs>();

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

  public in(...states: Array<string>): boolean
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

