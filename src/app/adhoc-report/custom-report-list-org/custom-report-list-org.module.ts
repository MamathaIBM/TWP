import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomReportListOrgComponent } from './custom-report-list-org.component';







const routes : Routes=[
  {
    path : '',
    component : CustomReportListOrgComponent
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
    MatCheckboxModule    
  ],
  declarations: [
    CustomReportListOrgComponent
  ],
  exports : 
  [CustomReportListOrgComponent ]
})




export class CustomReportListOrgModule { }
