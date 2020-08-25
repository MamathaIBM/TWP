import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatSortModule } from '@angular/material';
import { ParameterListComponent } from './parameter-list.component';

const routes : Routes=[
  {
    path : '',
    component : ParameterListComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatSortModule
  ],
  declarations: [
    ParameterListComponent
  ],
  exports : [ParameterListComponent ]
})
export class ParameterListModule { }


