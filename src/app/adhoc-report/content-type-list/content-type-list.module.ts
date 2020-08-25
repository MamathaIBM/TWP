import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentTypeListComponent } from './content-type-list.component';
import { MatIconModule, MatTableModule } from '@angular/material';

const routes : Routes=[
  {
    path : '',
    component : ContentTypeListComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule
  ],
  declarations: [
    ContentTypeListComponent
  ],
  exports : [ContentTypeListComponent ]
})
export class ContentTypeListModule { }
