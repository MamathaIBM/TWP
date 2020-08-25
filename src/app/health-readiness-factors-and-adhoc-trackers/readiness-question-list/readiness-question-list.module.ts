import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatSortModule  } from '@angular/material';
import { ReadinessQuestionListComponent } from './readiness-question-list.component';

const routes : Routes=[
  {
    path : '',
    component : ReadinessQuestionListComponent
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
    ReadinessQuestionListComponent
  ],
  exports : [ReadinessQuestionListComponent ]
})
export class ReadinessQuestionListModule { }
