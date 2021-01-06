import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ComponentBase, DetailView } from '../../magenta/core';

import { MyApplication } from 'src/code/myapp/application';


@Component({
  selector: 'app-main-template',
  templateUrl: './main-template.component.html',
  styleUrls: ['./main-template.component.scss']
})
export class MainTemplateComponent extends ComponentBase implements OnInit
{
  private application: MyApplication;
  private route: ActivatedRoute;

  public View: DetailView | null = null;


  constructor(application: MyApplication, route: ActivatedRoute)
  {
    super();

    this.application = application;
    this.route = route;
  }


  public ngOnInit(): void
  {
    // this.route.data.subscribe(data => {
    //    console.log(`Component view = ${data['view']}`);

    //    this.SetView(this.application.CreateDetailView(data['view']));
    // });

    this.route.queryParams.subscribe(params => {
      console.log(`Component view = ${params['view']}`);

      this.SetView(this.application.CreateDetailView(params['view']));
    });
  }
}
