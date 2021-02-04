import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AboutComponent } from './about/about.component';
import { BookComponent } from './book/book.component';
import { BooksComponent } from './books/books.component';
import { LibraryComponent } from './library/library.component';
import { LibrariesComponent } from './libraries/libraries.component';
import { MainComponent } from './main/main.component';


const routes: Routes = [
  {
    path: '',
    component: MainComponent,
    data: { view: 'Main_DetailView', key: '0' },
    children: [
      { path: '', redirectTo: 'books', pathMatch: 'full' },
      { path: 'books', component: BooksComponent, data: { view: 'Books_ListView' } },
      { path: 'books/:id', component: BookComponent, data: { view: 'Book_DetailView' } },
      { path: 'libraries', component: LibrariesComponent, data: { view: 'Libraries_ListView' } },
      { path: 'libraries/:id', component: LibraryComponent, data: { view: 'Library_DetailView' } }
    ]
  },
  { path: 'about', component: AboutComponent, data: { view: 'About_DetailView', key: '0' } }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
