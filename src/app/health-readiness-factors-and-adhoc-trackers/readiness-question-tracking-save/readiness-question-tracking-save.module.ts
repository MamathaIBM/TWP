import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatCheckbox, MatCheckboxModule, MatProgressSpinnerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule} from '@angular/material/tooltip'
import { ReadinessQuestionTrackingSaveComponent } from './readiness-question-tracking-save.component';

const routes : Routes=[
  {
    path : '',
    component : ReadinessQuestionTrackingSaveComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  declarations: [
    ReadinessQuestionTrackingSaveComponent
  ],
  exports : [ReadinessQuestionTrackingSaveComponent ]
})
export class ReadinessQuestionTrackingSaveModule { }
