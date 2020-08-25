import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StAdminDefinePhaseActivityListComponent } from './st-admin-define-phase-activity-list.component';

const routes : Routes=[
  {
    path : '',
    component : StAdminDefinePhaseActivityListComponent
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
  declarations: [StAdminDefinePhaseActivityListComponent],
  exports : [StAdminDefinePhaseActivityListComponent]
})
export class StAdminDefinePhaseActivityListModule { }
