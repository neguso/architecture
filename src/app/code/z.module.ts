import { Injectable, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppFrameworkModule } from './app-framework.module';
import { ArrayStore, BaseObject, Controller, ComponentController, ModelAction, ModelApplication, SimpleAction } from './core';
import { ViewController, ControllerManager } from './core';
import { MainTemplateComponent } from '../main-template/main-template.component';


/**
 * Module to create a simple web app with a dashboard, list views and detail views.
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
    // data models
    model.RegisterDataModel(About, { });
    model.RegisterDataModelMembers(About, {
      Title: { },
      Description: { },
      Logo: { }
    });

    // view models (it can be guessed from model)
    model.RegisterDetailView('About_DetailView', About);
    model.RegisterStaticTextItem('About_DetailView', 'Title', { Caption: 'The Title' });
    model.RegisterStaticTextItem('About_DetailView', 'Description');
    model.RegisterStaticImageItem('About_DetailView', 'Logo');
    model.RegisterActionsContainerItem('About_DetailView', 'about-actions');

    // actions models are optional
    model.Actions['hello'] = new ModelAction(model, 'hello', { Caption: 'Say Hello' });

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
  private HelloAction: SimpleAction;


  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);

    // this controller activates only for components that are for specified view
    this.TargetViews.push('About_DetailView');

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });

    this.Created.Subscribe(() => this.OnCreated());
    this.Activated.Subscribe(() => this.OnActivated());


    // create Hello action
    this.HelloAction = new SimpleAction('hello', this);
    this.HelloAction.Container = 'about-actions';
    this.HelloAction.Execute.Subscribe(() => { console.log('HelloAction executed'); });

    this.Actions.push(this.HelloAction);
  }

  public OnCreated(): void
  {
    // controller created, all controllers for component are accessible

    const component = this.Component;
    const all = ControllerManager.GetControllers(this.Component);
    const about = ControllerManager.GetController(this.Component, AboutViewController);
  }

  public OnActivated(): void
  {
    // component view assigned to controller

    const view = this.View;
  }
}
