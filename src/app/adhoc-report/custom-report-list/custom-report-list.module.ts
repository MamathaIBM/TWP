import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomReportListComponent, ReportMediumSelectDialog } from './custom-report-list.component';
import { MatIconModule, MatTableModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatDialogModule, MatTooltip, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : CustomReportListComponent
  }
]



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatOptionModule,
    MatSelectModule, 
    MatDialogModule,
    MatTooltipModule      
  ],
  declarations: [
    CustomReportListComponent,ReportMediumSelectDialog
  ],
  entryComponents: [ReportMediumSelectDialog],
  exports : [CustomReportListComponent,ReportMediumSelectDialog ]
})
export class CustomReportListModule { }
