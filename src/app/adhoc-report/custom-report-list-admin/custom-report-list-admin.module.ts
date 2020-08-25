import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomReportListAdminComponent } from './custom-report-list-admin.component';







const routes : Routes=[
  {
    path : '',
    component : CustomReportListAdminComponent
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatCheckboxModule,    
  ],
  declarations: [
    CustomReportListAdminComponent
  ],
  exports : 
    [CustomReportListAdminComponent ]
})


export class CustomReportListAdminModule { }
