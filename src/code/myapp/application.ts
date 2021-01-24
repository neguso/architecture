import { Injectable } from '@angular/core';

import { Application, ModelApplication } from 'src/magenta/core';


@Injectable({ providedIn: 'root' })
export class MyApplication extends Application
{
  constructor(model: ModelApplication)
  {
    super(model);
  }
}
