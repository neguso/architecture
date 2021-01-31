import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';

import { CoreModule } from '../magenta/core/core.module';
import { SystemModule } from '../magenta/system/system.module';
import { MyAppModule } from '../code/myapp/myapp.module';
//import { Test1Module } from '../code/test1.module';
//import { Test2Module } from '../code/test2.module';

import { Application } from 'src/magenta/core';
import { MyApplication } from 'src/code/myapp/application';
import { AboutComponent } from './about/about.component';
import { MainComponent } from './main/main.component';
import { BooksComponent } from './books/books.component';
import { BookComponent } from './book/book.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { LibraryComponent } from './library/library.component';


@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    MainComponent,
    BooksComponent,
    BookComponent,
    LibrariesComponent,
    LibraryComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    MatTableModule, MatSortModule, MatPaginatorModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CoreModule, SystemModule,
    MyAppModule,
    //Test1Module,
    //Test2Module,
  ],
  providers: [
    { provide: Application, useClass: MyApplication },
    //{ provide: ModelApplication, useClass: MyModelApplication }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
