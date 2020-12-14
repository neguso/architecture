import { NgModule, Injectable, Type } from "@angular/core";


@NgModule({
	providers: []
})
export class AppFrameworkModule
{
  constructor(model: ModelApplication)
  {
    //TODO: initialize application model
  }
}



export abstract class BaseObject
{
  public Id: string;


  constructor(id: string = '')
  {
    this.Id = id;
  }
}

interface BaseObjectClass
{
  new (): BaseObject
}






interface Dictionary<T> {
  [key: string]: T;
}

export interface IModelNode
{
  Index: number | null;
  Parent: IModelNode | null;
}


@Injectable({ providedIn: 'root' })
export class ModelApplication implements IModelNode
{
  // IModelNode
  public Index: number | null = null;
  public Parent: IModelNode | null = null;

  public Title: string = '';
  public DataModels: Dictionary<ModelDataModel> = {};


  constructor()
  { }


  public RegisterDataModel(type: Type<BaseObject>, node: Partial<IModelDataModel>)
  {
    this.DataModels[type.constructor.name] = new ModelDataModel(this, node);
  }
}

interface IModelDataModel
{
  Index: number | null;
  Caption: string;
}

export class ModelDataModel implements IModelNode, IModelDataModel
{
  // IModelNode
  public Index: number | null = null;
  public Parent: IModelNode | null = null;

  public Caption: string = '';
  public Members?: Dictionary<ModelDataModel> = {};


  public constructor(parent: IModelNode, init: Partial<IModelDataModel>)
  {
    Object.assign(this, init);
    this.Parent = parent;
  }
}


interface IModelDataModelMember
{
  Index: number | null;
  Caption: string;
  ToolTip: string;
  NullText: string;
}

export class ModelDataModelMember implements IModelNode, IModelDataModelMember
{
  // IModelNode
  public Index: number | null = null;
  public Parent: IModelNode | null;

  public Caption: string = '';
  public ToolTip: string = '';
  public NullText: string = '';


  constructor(parent: IModelNode)
  {
    this.Parent = parent;
  }
}





