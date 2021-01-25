import { Inject, Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IDictionary } from './common';
import { Controller, ComponentController, ViewController, ModelApplication, ComponentBase, IComponent, Event, EventArgs, Application } from './core';


/**
 * Controller provide access to Angular component lifecycle events.
 */
@Injectable()
@Controller(ComponentBase)
export class ComponentLifecycleController extends ComponentController
{
  public readonly Init: Event<EventArgs> = new Event<EventArgs>();
  public readonly Destroy: Event<EventArgs> = new Event<EventArgs>();


  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication)
  {
    super(component, model);

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created for ${component.constructor.name}`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });

    this.Setup();
  }


  protected Setup(): void
  {
    this.Activated.Subscribe(() => { this.AttachEvents(); });
    this.Deactivated.Subscribe(() => { this.DetachEvents(); });
  }

  protected AttachEvents(): void
  {
    const prototype = this.Component.constructor.prototype as IDictionary<any>;
    prototype.ngOnInit = () => { this.Init.Trigger(EventArgs.Empty); };
    prototype.ngOnDestroy = () => { this.Destroy.Trigger(EventArgs.Empty); };
  }

  protected DetachEvents(): void
  {
    const prototype = this.Component.constructor.prototype as IDictionary<any>;
    delete prototype.ngOnInit;
    delete prototype.ngOnDestroy;
  }
}



/**
 * Controller create and assign views to components.
 */
@Injectable()
@Controller(ComponentBase)
export class CoreController extends ComponentController
{
  protected readonly Application: Application;

  constructor(@Inject('IComponent') component: IComponent, model: ModelApplication, application: Application)
  {
    super(component, model);

    this.Created.Subscribe(() => { console.log(`Controller ${this.constructor.name} created for ${component.constructor.name}`); });
    this.Activated.Subscribe(() => { console.log(`Controller ${this.constructor.name} activated`); });
    this.Deactivated.Subscribe(() => { console.log(`Controller ${this.constructor.name} deactivated`); });

    this.Application = application;

    this.Setup();
  }


  protected Setup(): void
  {
    this.Activated.Subscribe(() => {
      this.Component.Route.data.subscribe(data => { this.AssignView(data); });
    });
  }

  protected AssignView(data: IDictionary<any>): void
  {
    this.Component.SetView(this.Application.CreateView(this.Model.Views[data['view']]));
  }
}
