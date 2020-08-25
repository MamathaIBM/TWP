import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CustomReportAddGlobalComponent } from './custom-report-add-global.component';








const routes : Routes=[
  {
    path : '',
    component : CustomReportAddGlobalComponent
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
    CustomReportAddGlobalComponent
  ],
  exports : 
  [CustomReportAddGlobalComponent ]
})


export class CustomReportAddGlobalModule { }
