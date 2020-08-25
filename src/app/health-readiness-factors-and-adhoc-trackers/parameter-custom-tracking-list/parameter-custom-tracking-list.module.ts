import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { ParameterCustomTrackingListComponent } from './parameter-custom-tracking-list.component';

const routes : Routes=[
  {
    path : '',
    component : ParameterCustomTrackingListComponent
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
    ParameterCustomTrackingListComponent
  ],
  exports : [ParameterCustomTrackingListComponent ]
})
export class ParameterCustomTrackingListModule { }
