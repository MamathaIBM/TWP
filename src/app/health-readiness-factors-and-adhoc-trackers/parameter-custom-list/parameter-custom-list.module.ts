import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatCheckboxModule } from '@angular/material';
import { ParameterCustomListComponent } from './parameter-custom-list.component';

const routes : Routes=[
  {
    path : '',
    component : ParameterCustomListComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatCheckboxModule    
  ],
  declarations: [
    ParameterCustomListComponent
  ],
  exports : [ParameterCustomListComponent ]
})
export class ParameterCustomListModule { }
