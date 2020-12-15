import { NgModule, Injectable, Type } from '@angular/core';


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







interface Dictionary<T>
{
  [key: string]: T;
}


export interface IModelNode
{
  Index: number;
  Parent: IModelNode | null;
}


@Injectable({ providedIn: 'root' })
export class ModelApplication implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public Parent: IModelNode | null = null;

  public Title: string = '';
  public DataModels: Dictionary<ModelDataModel> = {};


  constructor()
  { }


  public RegisterDataModel(type: Type<BaseObject>, node: Partial<IModelDataModel>): void
  {
    this.DataModels[type.name] = new ModelDataModel(this, node);
  }

  public RegisterDataModelMembers(type: Type<BaseObject>, members: Dictionary<Partial<IModelDataModelMember>>): void
  {
    for(const member of Object.keys(members))
      this.DataModels[type.name].Members[member] = new ModelDataModelMember(this.DataModels[type.name], member, members[member]);
  }
}

interface IModelDataModel
{
  Index: number;
  Caption: string;
}

export class ModelDataModel implements IModelNode, IModelDataModel
{
  // IModelNode
  public Index: number = 0;
  public Parent: IModelNode | null = null;

  public Caption: string = '';
  public Members: Dictionary<ModelDataModelMember> = {};


  public constructor(parent: IModelNode, init: Partial<IModelDataModel>)
  {
    Object.assign(this, init);
    this.Parent = parent;
  }
}


interface IModelDataModelMember
{
  Index: number;
  Caption: string;
  ToolTip: string;
  NullText: string;
}

export class ModelDataModelMember implements IModelNode, IModelDataModelMember
{
  // IModelNode
  public Index: number = 0;
  public Parent: IModelNode | null;

  public Field: string = '';
  public Caption: string = '';
  public ToolTip: string = '';
  public NullText: string = '';


  constructor(parent: IModelNode, field: string, init: Partial<IModelDataModelMember>)
  {
    Object.assign(this, init);
    this.Field = field;
    this.Parent = parent;
  }
}





