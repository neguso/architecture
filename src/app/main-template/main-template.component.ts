import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Application, ComponentBase, DetailView, StaticTextViewItem, ViewItem } from '../code/core';


@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent extends ComponentBase implements OnInit
{
  private application: Application;

  public Route: ActivatedRoute;
  public View: DetailView | null = null;


  constructor(route: ActivatedRoute, application: Application)
  {
    super();

    this.Route = route;
    this.application = application;
  }


  public ngOnInit(): void
  {
    this.Route.queryParams.subscribe(params => {
      console.log(params);

      // params[view]
      this.View = this.application.CreateDetailView('About_DetailView');
    });
  }
}
