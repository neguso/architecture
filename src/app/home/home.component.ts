import { Component, OnInit } from '@angular/core';

import {
  ControllerManager,
  EventAggregator,
  IComponent,
  ModelApplication,
  StateManager
} from '../code/app-framework.module';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements IComponent, OnInit
{
  public Events: EventAggregator = new EventAggregator();
  public States: StateManager = new StateManager();

  public text: string = 'initial value';


  constructor(model: ModelApplication)
  {
    console.log(`Component ${this.constructor.name} created`);

    model.Title = 'application title';
  }


  public ngOnInit(): void
  {
    console.log(`Component ${this.constructor.name} initialized`);

    ControllerManager.RegisterComponent(this);

    this.text = 'Hello world!';

    this.Load().then();
  }


  public async Load(): Promise<void>
  {
    try
    {

    }
    catch(exception)
    {
      console.log('data loading error');
    }
  }
}

