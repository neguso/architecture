import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CoreModule } from '../magenta/core/core.module';
import { SystemModule } from '../magenta/system/system.module';
import { MyAppModule } from '../code/myapp/myapp.module';
import { Test1Module } from '../code/test1.module';
import { Test2Module } from '../code/test2.module';

import { BooksComponent } from './books/books.component';
import { HomeComponent } from './home/home.component';
import { MainTemplateComponent } from './main-template/main-template.component';
import { Application } from 'src/magenta/core';
import { MyApplication } from 'src/code/myapp/application';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BooksComponent,
    MainTemplateComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule, SystemModule,
    Test1Module,
    //Test2Module,
    MyAppModule
  ],
  providers: [
    { provide: Application, useClass: MyApplication },
    //{ provide: ModelApplication, useClass: MyModelApplication }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
