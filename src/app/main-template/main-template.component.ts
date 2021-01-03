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


  constructor(application: Application, route: ActivatedRoute)
  {
    super();

    this.application = application;
    this.Route = route;
  }


  public ngOnInit(): void
  {
    this.Route.queryParams.subscribe(params => {
      console.log(`Component view parameter = ${params['view']}`);

      // params[view]
      this.View = this.application.CreateDetailView('About_DetailView');
    });
  }
}
