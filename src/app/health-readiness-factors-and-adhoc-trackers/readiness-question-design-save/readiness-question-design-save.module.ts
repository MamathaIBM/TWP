import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatCheckboxModule, MatProgressSpinnerModule } from '@angular/material';
import { ReadinessQuestionDesignSaveComponent } from './readiness-question-design-save.component';


const routes : Routes=[
  {
    path : '',
    component : ReadinessQuestionDesignSaveComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    
  ],
  declarations: [
    ReadinessQuestionDesignSaveComponent
  ],
  exports : [ReadinessQuestionDesignSaveComponent ]
})
export class ReadinessQuestionDesignSaveModule { }
