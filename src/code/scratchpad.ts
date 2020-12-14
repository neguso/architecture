



export abstract class BaseObject
{
  public Id: string;


  constructor(id: string = '')
  {
    this.Id = id;
  }
}







export class ModelApplication
{
  public Title: string = '';

  public DataModel: ModelDataModel


}


const Application = new ModelApplication();



// -- user code ----------------------------------------------------------------


Application.Title = 'my app';

export class MyDataEntity1 extends BaseObject
{
  public Title: string;
  public Description: string | null;


  constructor(id: string, title: string, description: string | null = null)
  {
    super(id);

    this.Title = title;
    this.Description = description;
  }
}

const t = typeof(MyDataEntity1);
t.

//Application.DataModel[]




