import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BooksComponent } from './books/books.component';
import { HomeComponent } from './home/home.component';
import { MainTemplateComponent } from './main-template/main-template.component';


const routes: Routes = [
  { path: '', component: MainTemplateComponent, data: { view: 'About_DetailView' } },
  { path: 'books', component: BooksComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
