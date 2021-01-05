import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppFrameworkModule } from './app-framework.module';
import { ArrayStore, BaseObject, Controller, ComponentController, ModelAction, ModelApplication, SimpleAction } from './core';
import { ViewController, ControllerManager } from './core';
import { MainTemplateComponent } from '../main-template/main-template.component';


/**
 * Module to create a simple test app with all kind of views.
 */
@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AppFrameworkModule
  ]
})
export class ZModule
{
  constructor(model: ModelApplication)
  {
    console.log(`Module ${this.constructor.name} created`);

    // module initialization
    //...

    // update application model
    this.UpdateApplicationModel(model);
  }


  public UpdateApplicationModel(model: ModelApplication): void
  {
    // data models //

    // About
    model.RegisterDataModel(About, { });
    model.RegisterDataModelMembers(About, {
      Title: { },
      Description: { },
      Logo: { }
    });

    // Customer
    model.RegisterDataModel(Customer, { });
    model.RegisterDataModelMembers(Customer, {
      Name: { },
      Address: { MaxLength: 100, AllowNull: true },
      NoOfEmployees: { Type: Number },
      Limited: { Type: Boolean },
      Created: { Type: Date }
    });

    // Views, Actions //

    const about = 'About_DetailView';
    model.RegisterDetailView(about, About);
    model.RegisterStaticTextItem(about, 'Title', { Caption: 'The Title' });
    model.RegisterStaticTextItem(about, 'Description');
    model.RegisterStaticImageItem(about, 'Logo');
    model.RegisterActionsContainerItem(about, 'about-actions');

    // actions models are optional
    model.Actions['hello'] = new ModelAction(model, 'hello', { Caption: 'Say Hello', Container: 'about-actions' });
    model.Actions['bye'] = new ModelAction(model, 'byw', { Caption: 'Say Bye Bye', Container: 'about-actions' });

    const customers = 'Customers_ListView';
    model.RegisterListView(customers, Customer);
    //model.RegisterListViewColumns();


    const customer = 'Customer_DetailView';
    //TODO


    // Navigation //

    model.RegisterNavigationItems(model.Navigation, [{ id: 'Main' }]);
    const navMain = model.Navigation.Items.find(e => e.Id === 'Main');
    if(typeof navMain !== 'undefined')
      model.RegisterNavigationItems(navMain, [
      { id: 'About', item: { View: 'About_DetailView' } },
      { id: 'Customers', item: { View: 'Customers_ListView' } }
    ]);

  }
}





export class About extends BaseObject
{
  public Title: string;
  public Description: string;
  public Logo: string;

  constructor(id: string, title: string = '', description: string = '', logo: string = '')
  {
    super(id);

    this.Title = title;
    this.Description = description;
    this.Logo = logo;
  }
}

export class Customer extends BaseObject
{
  public Name: string;
  public Address: string | null;
  public NoOfEmployees: number = 0;
  public Limited: boolean = false;
  public Created: Date;

  constructor(name: string, address: string | null, empl: number, ltd: boolean, created: Date)
  {
    super();

    this.Name = name;
    this.Address = address;
    this.NoOfEmployees = empl;
    this.Limited = ltd;
    this.Created = created;
  }
}



export class AboutDataStore extends ArrayStore<About>
{
  constructor()
  {
    super([new About('', 'this is title', 'this is description', 'https://lh3.googleusercontent.com/ogw/ADGmqu_yMhxJnXXLDx2mQfoDzNGRPVVrxYsZ47yA9Jzlc-0=s32-c-mo')]);
  }
}



@Injectable()
@Controller(MainTemplateComponent)
export class MainController extends ComponentController
{
  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });


    this.Created.Subscribe(() => this.OnCreated());
  }

  public OnCreated(): void
  {
    // controller created, all controllers for component are accessible

    const component = this.Component;
    const all = ControllerManager.GetControllers(this.Component);
    const about = ControllerManager.GetController(this.Component, AboutViewController);

  }

}


@Injectable()
@Controller(MainTemplateComponent)
export class AboutViewController extends ViewController
{
  public HelloAction: SimpleAction;
  public ByeAction: SimpleAction;


  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });

    this.Name = 'AboutViewController';

    // controller activates only for components that uses the specified views
    this.TargetViews.push('About_DetailView');

    this.Created.Subscribe(() => this.OnCreated());
    this.Activated.Subscribe(() => this.OnActivated());
    this.Deactivated.Subscribe(() => this.OnDeactivated());


    // create Hello action
    this.HelloAction = new SimpleAction('hello', this);
    this.HelloAction.Container = 'about-actions';
    this.HelloAction.Execute.Subscribe(() => { console.log('Hello!'); });
    //
    this.Actions.push(this.HelloAction);

    // create Bye action
    this.ByeAction = new SimpleAction('bye', this);
    this.ByeAction.Container = 'about-actions';
    this.ByeAction.Execute.Subscribe(() => { console.log('Bye Bye!'); });
    //
    this.Actions.push(this.ByeAction);
  }


  protected OnCreated(): void
  {
    // controller created, all controllers for component are accessible

    const component = this.Component;
    const all = ControllerManager.GetControllers(this.Component);
    const about = ControllerManager.GetController(this.Component, AboutViewController);
  }

  protected OnActivated(): void
  {
    // component view assigned to controller

    const view = this.View;
  }

  protected OnDeactivated(): void
  {
    // component view assigned to controller

    const view = this.View;
  }
}




//TODO restructureaza modulele, restructureaza components&views ca in draw.io
//TODO read model navigation items and create actions for each item in container 'main-navigation'
@Injectable()
@Controller(MainTemplateComponent)
export class ShowNavigationItemController extends ViewController
{
  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);

    this.TargetViews.push('Main');

    //application.Navigation
    //..............
  }
}
