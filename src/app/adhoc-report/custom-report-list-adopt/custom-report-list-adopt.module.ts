import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomReportListAdoptComponent } from './custom-report-list-adopt.component';
import { MatIconModule, MatTableModule } from '@angular/material';

const routes : Routes=[
  {
    path : '',
    component : CustomReportListAdoptComponent
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
    CustomReportListAdoptComponent
  ],
  exports : [CustomReportListAdoptComponent ]
})
export class CustomReportListAdoptModule { }
