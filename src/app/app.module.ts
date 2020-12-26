import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppFrameworkModule } from './code/app-framework.module';
import { XModule } from './code/x.module';
import { YModule } from './code/y.module';
import { BooksComponent } from './books/books.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { MainTemplateComponent } from './main-template/main-template.component';

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
    AppFrameworkModule,
    XModule, YModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
