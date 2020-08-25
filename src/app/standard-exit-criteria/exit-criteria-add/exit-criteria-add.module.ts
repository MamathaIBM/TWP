import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { ExitCriteriaAddComponent } from './exit-criteria-add.component';


const routes : Routes=[
  {
    path : '',
    component : ExitCriteriaAddComponent
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
    ExitCriteriaAddComponent
  ],
  exports : [ExitCriteriaAddComponent ]
})
export class ExitCriteriaAddModule { }
