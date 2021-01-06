import { Injectable } from '@angular/core';

import { Application, ArrayStore, BaseObject, ModelApplication } from 'src/magenta/core';


@Injectable({ providedIn: 'root' })
export class MyApplication extends Application
{
  constructor(model: ModelApplication)
  {
    super(model);
  }
}
