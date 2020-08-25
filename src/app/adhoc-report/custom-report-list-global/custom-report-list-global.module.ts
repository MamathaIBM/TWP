import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomReportListGlobalComponent } from './custom-report-list-global.component';







const routes : Routes=[
  {
    path : '',
    component : CustomReportListGlobalComponent
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
    CustomReportListGlobalComponent
  ],
  exports : 
  [CustomReportListGlobalComponent ]
})




export class CustomReportListGlobalModule { }
