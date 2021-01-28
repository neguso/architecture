import { Injectable } from '@angular/core';
import { AboutComponent } from 'src/app/about/about.component';
import { ComponentController, ComponentLifecycleController, Controller, ControllerManager, ModelApplication, SimpleAction, ViewController } from 'src/magenta/core';


@Injectable()
@Controller(AboutComponent)
export class TestController extends ComponentController
{
  constructor(component: AboutComponent, model: ModelApplication)
  {
    super(component, model);

    this.Created.Subscribe(() => this.OnCreated());
  }


  public OnCreated(): void
  {
    const lifecycleController = ControllerManager.GetController(this.Component, ComponentLifecycleController) as ComponentLifecycleController;
    lifecycleController.Init.Subscribe(() => { console.log(`${this.Component.constructor.name} initialized`); });
    lifecycleController.Destroy.Subscribe(() => { console.log(`${this.Component.constructor.name} destroyed`); });
  }
}




/*

import { MainTemplateComponent } from 'src/app/main-template/main-template.component';


@Injectable()
@Controller(MainTemplateComponent)
export class MainController extends ComponentController
{
  constructor(component: MainTemplateComponent, model: ModelApplication)
  {
    super(component, model);

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


  constructor(component: MainTemplateComponent, model: ModelApplication)
  {
    super(component, model);

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
    //this.ByeAction.Container = 'about-actions';
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

*/
