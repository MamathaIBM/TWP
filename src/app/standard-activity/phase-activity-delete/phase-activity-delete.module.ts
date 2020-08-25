import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { PhaseActivityDeleteComponent } from './phase-activity-delete.component';

const routes : Routes=[
  {
    path : '',
    component : PhaseActivityDeleteComponent
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
    PhaseActivityDeleteComponent
  ],
  exports : [PhaseActivityDeleteComponent ]
})
export class PhaseActivityDeleteModule { }
