import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatCheckboxModule } from '@angular/material';
import { ReadinessQuestionDesignListComponent } from './readiness-question-design-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : ReadinessQuestionDesignListComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    ReactiveFormsModule ,
    FormsModule,
  ],
  declarations: [
    ReadinessQuestionDesignListComponent
  ],
  exports : [ReadinessQuestionDesignListComponent ]
})
export class ReadinessQuestionDesignListModule { }