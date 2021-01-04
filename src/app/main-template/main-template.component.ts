import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Application, ComponentBase, DetailView } from '../code/core';


@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent extends ComponentBase implements OnInit
{
  private application: Application;
  private route: ActivatedRoute;

  public View: DetailView | null = null;


  constructor(application: Application, route: ActivatedRoute)
  {
    super();

    this.application = application;
    this.route = route;
  }


  public ngOnInit(): void
  {
    this.route.queryParams.subscribe(params => {
      console.log(`Component view = ${params['view']}`);

      this.SetView(this.application.CreateDetailView(params['view']));

      // params[view]
      //this.View = this.application.CreateDetailView('About_DetailView');
    });
  }
}
