import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { PhaseActivityAddComponent } from './phase-activity-add.component';

const routes : Routes=[
  {
    path : '',
    component : PhaseActivityAddComponent
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
    PhaseActivityAddComponent
  ],
  exports : [PhaseActivityAddComponent ]
})
export class PhaseActivityAddModule { }
