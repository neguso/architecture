import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MatTable } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { PageEvent } from '@angular/material/paginator';

import { ComponentBase, IBaseObject, ListView, View } from '../../magenta/core';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent extends ComponentBase
{
  @ViewChild(MatTable) protected Table!: MatTable<IBaseObject>;


  constructor(route: ActivatedRoute)
  {
    super(route);

    (this.View as ListView).DataSource?.Loaded.Subscribe(() => {
      this.Table.renderRows();
    });
  }


  public AsListView(view: View | null): ListView
  {
    return view as ListView;
  }

  public SortChange(args: Sort): void
  {
    (this.View as ListView).GetAction('sort')?.DoExecute(args);
  }

  public PageChange(args: PageEvent): void
  {
    (this.View as ListView).GetAction('paginate')?.DoExecute(args);

    // const ds =  (this.View as ListView).DataSource;
    // if(ds != null)
    // {
    //   ds.Page = args.pageIndex;
    //   ds.PageSize = args.pageSize;
    // }
  }
}
