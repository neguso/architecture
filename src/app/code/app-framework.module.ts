import { NgModule, Injectable, Type } from '@angular/core';


@NgModule({
  providers: []
})
export class AppFrameworkModule
{
  public constructor(model: ModelApplication)
  {
    // initialize application model
    //...
  }
}


interface Dictionary<T>
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
  public DataModels: Dictionary<ModelDataModel> = {};
  public Views: Dictionary<ModelView> = {};


  public constructor()
  {
    this.Options = new ModelApplicationOptions();
  }


  //#region Model creation helpers

  public RegisterDataModel(type: Type<IBaseObject>, node: IModelDataModel): void
  {
    this.DataModels[type.name] = new ModelDataModel(this, type, node);
  }

  public RegisterDataModelMembers(type: Type<IBaseObject>, members: Dictionary<IModelDataModelMember>): void
  {
    for(const member of Object.keys(members))
      this.DataModels[type.name].Members[member] = new ModelDataModelMember(this.DataModels[type.name], member, members[member]);
  }

  public RegisterListView(name: string, type: Type<IBaseObject>, node: IModelListView): void
  {
    this.Views[name] = new ModelListView(this, name, type, node);
  }

  public RegisterListViewColumns(name: string, columns: Dictionary<IModelViewColumn>): void
  {
    for(const column of Object.keys(columns))
      (this.Views[name] as ModelListView).Colunms[column] = new ModelViewColumn(this.Views[name], column, columns[column]);
  }

  public RegisterDetailView(name: string, type: Type<IBaseObject>, node: IModelDetailView): void
  {
    this.Views[name] = new ModelDetailView(this, name, type, node);
  }

  public RegisterDetailViewItems(name: string, items: Dictionary<IModelViewItem>): void
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
  public Members: Dictionary<ModelDataModelMember> = {};


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
  public Colunms: Dictionary<ModelViewColumn> = {};


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
  public Items: Dictionary<ModelViewItem> = {};


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
