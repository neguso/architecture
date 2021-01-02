import { Injectable } from '@angular/core';

import { Controller, ControllerBase, ModelAction, ModelApplication } from './core';

import { ActionsContainerToolbarComponent } from '../actions-containers/toolbar/actions-container-toolbar.component';
import { MainTemplateComponent } from '../main-template/main-template.component';

/**
 * Controller that assign actions to action containers.
 */
@Injectable()
//@Controller(ActionsContainerToolbarComponent)
export class ActionContainerController extends ControllerBase
{
  protected ActionsContainer: ActionsContainerToolbarComponent;


  constructor(component: ActionsContainerToolbarComponent, application: ModelApplication)
  {
    super(component, application);

    this.ActionsContainer = component;

    this.Activated.Subscribe(() => { this.OnActivated(); });
    this.Deactivated.Subscribe(() => { this.OnDeactivated(); });
  }


  protected GetModelActions(): Array<ModelAction>
  {
    return Object.values(this.Application.Actions).filter(action => action.Container === this.ActionsContainer.Name);
  }


  protected OnActivated(): void
  {


  }

  protected OnDeactivated(): void
  {

  }

}




@Injectable()
@Controller(MainTemplateComponent)
export class DetailViewController extends ControllerBase
{

  constructor(component: MainTemplateComponent, application: ModelApplication)
  {
    super(component, application);
  }

}
