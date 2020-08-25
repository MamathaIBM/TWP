import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatCheckbox, MatCheckboxModule, MatDatepickerModule } from '@angular/material';
import { ReadinessQuestionTrackingLandscapeListComponent } from './readiness-question-tracking-landscape-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule} from '@angular/material/tooltip'

const routes : Routes=[
  {
    path : '',
    component : ReadinessQuestionTrackingLandscapeListComponent
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
    MatTooltipModule,
    MatDatepickerModule
  ],
  declarations: [
    ReadinessQuestionTrackingLandscapeListComponent
  ],
  exports : [ReadinessQuestionTrackingLandscapeListComponent ]
})
export class ReadinessQuestionTrackingLandscapeListModule { }
