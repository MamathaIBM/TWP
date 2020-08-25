import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatCheckboxModule,  MatProgressSpinnerModule } from '@angular/material';
import { ParameterCustomAdoptComponent } from './parameter-custom-adopt.component';


const routes : Routes=[
  {
    path : '',
    component : ParameterCustomAdoptComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule  
  ],
  declarations: [
    ParameterCustomAdoptComponent
  ],
  exports : [ParameterCustomAdoptComponent ]
})
export class ParameterCustomAdoptModule { }
