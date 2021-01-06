import { Component, OnInit } from '@angular/core';

import {
  ControllerManager,
  EventAggregator,
  IComponent,
  ModelApplication,
  StateManager,
  View
} from '../../magenta/core';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements IComponent, OnInit
{
  private static counter: number = 0;

  // IComponent
  public UniqueId: string = (HomeComponent.counter++).toString();
  public Events: EventAggregator = new EventAggregator();
  public View: View | null = null;
  public State: HomeState = new HomeState();


  constructor(model: ModelApplication)
  {
    console.log(`Component ${this.constructor.name} created`);

    model.Title = 'application title';
  }


  public ngOnInit(): void
  {
    console.log(`Component ${this.constructor.name} initialized`);

    ControllerManager.RegisterComponent(this);

    this.State.When('loading', () => this.LoadData());

    this.State.Current = 'loading';
  }


  public async LoadData(): Promise<void>
  {
    try
    {
      // load data
      this.State.Presenting.Data = 'Hello world!';

      //throw new Error('Testing exceptions');

      setTimeout(() => {
        this.State.Current = 'presenting';
      }, 2000);
    }
    catch(exception)
    {
      this.State.Error.Message = exception;
      this.State.Current = 'error';
    }
  }
}




class HomeState extends StateManager
{

  constructor(currentState: string = 'new')
  {
    super(
      { state: 'new', value: null },
      { state: 'loading', value: new LoadingState() },
      { state: 'error', value: new ErrorState() },
      { state: 'presenting', value: new PresentingState() }
    );
  }

  // state shortcuts
  public Loading: LoadingState = this.Value('loading');
  public Error: ErrorState = this.Value('error');
  public Presenting: PresentingState = this.Value('presenting');
}

export class LoadingState
{
  public Message: string = 'loading...';
}

export class ErrorState
{
  public Message: string = 'an error occured';
}

export class PresentingState
{
  public Data: string = 'no data';
}
