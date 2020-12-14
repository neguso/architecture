import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit
{

  public text: string = '';

  constructor()
  { }

  public ngOnInit(): void
  {
    this.text = 'hello world';
  }

}
