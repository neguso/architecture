import { viewClassName } from '@angular/compiler';
import { NgModule, Injectable, Type } from '@angular/core';


@NgModule({
  providers: []
})
export class AppFrameworkModule
{
  public constructor(model: ModelApplication)
  {
    //TODO: initialize application model
  }
}



export abstract class BaseObject
{
  public Id: string;


  public constructor(id: string = '')
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


  public constructor()
  {
    this.Options = new ModelApplicationOptions();
  }


  public RegisterDataModel(type: Type<BaseObject>, node: Partial<IModelDataModel>): void
  {
    this.DataModels[type.name] = new ModelDataModel(this, type, node);
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
  public Parent: IModelNode;

  public ObjectType: Type<BaseObject>;
  public Caption: string = '';
  public Members: Dictionary<ModelDataModelMember> = {};
  public Views: Dictionary<ModelView> = {};

  public constructor(parent: IModelNode, type: Type<BaseObject>, init: Partial<IModelDataModel>)
  {
    this.Parent = parent;
    this.ObjectType = type;

    // set default values
    this.Caption = type.name;

    // set user provided values
    Object.assign(this, init);
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
  public Parent: IModelNode;

  public Field: string = '';
  public Caption: string = '';
  public ToolTip: string = '';
  public NullText: string = '';


  constructor(parent: IModelNode, field: string, init: Partial<IModelDataModelMember>)
  {
    this.Field = field;
    this.Parent = parent;

    // set default values
    this.Caption = field;

    // set user provided values
    Object.assign(this, init);
  }
}


//#region Views


abstract class ModelView implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public ObjectType: Type<BaseObject>;
  public Caption: string | null = null;


  protected get Model(): ModelApplication { return this.Parent.Parent as ModelApplication; }


  public constructor(parent: IModelNode, type: Type<BaseObject>)
  {
    this.Parent = parent;
    this.ObjectType = type;
  }
}


abstract class ModelViewField implements IModelNode
{
  // IModelNode
  public Index: number = 0;
  public readonly Parent: IModelNode;

  public Field: string;

  public caption: string | null = null;
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



interface IModelListView
{

}

export class ModelListView extends ModelView implements IModelListView
{
  public Colunms: Dictionary<ModelViewColumn> = {};



}


interface IModelViewColumn
{

}

export class ModelViewColumn extends ModelViewField implements IModelViewColumn
{

}






interface IModelDetailView
{

}

export class ModelDetailView extends ModelView implements IModelDetailView
{
  public Items: Dictionary<ModelViewItem> = {};



}


interface IModelDetailViewColumn
{

}

export class ModelViewItem extends ModelViewField implements IModelDetailViewColumn
{

}


//#endregion
