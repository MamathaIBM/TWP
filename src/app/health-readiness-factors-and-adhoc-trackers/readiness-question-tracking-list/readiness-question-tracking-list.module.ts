import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatCheckbox, MatCheckboxModule, MatDatepickerModule, MatPaginatorModule  } from '@angular/material';
import { ReadinessQuestionTrackingListComponent } from './readiness-question-tracking-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule} from '@angular/material/tooltip'

const routes : Routes=[
  {
    path : '',
    component : ReadinessQuestionTrackingListComponent
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

    
    MatDatepickerModule,
    MatPaginatorModule
  ],


  declarations: [
    ReadinessQuestionTrackingListComponent
  ],
  exports : [ReadinessQuestionTrackingListComponent ]
})
export class ReadinessQuestionTrackingListModule { }
