import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatCheckboxModule, } from '@angular/material';
import { ReadinessQuestionAdoptComponent } from './readiness-question-adopt.component';


const routes : Routes=[
  {
   path : '',
    component : ReadinessQuestionAdoptComponent
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
    ReadinessQuestionAdoptComponent
  ],
  exports : [ReadinessQuestionAdoptComponent ]
})
export class ReadinessQuestionAdoptModule { }
