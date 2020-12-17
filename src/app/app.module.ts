import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppFrameworkModule } from './code/app-framework.module';
import { XModule } from './code/x.module';
import { YModule } from './code/y.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AppFrameworkModule,
    XModule, YModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
