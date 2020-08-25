import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StAdminHandoverPhaseActivityListComponent } from './st-admin-handover-phase-activity-list.component';

const routes : Routes=[
  {
    path : '',
    component : StAdminHandoverPhaseActivityListComponent
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
  declarations: [StAdminHandoverPhaseActivityListComponent],
  exports : [StAdminHandoverPhaseActivityListComponent]
})
export class StAdminHandoverPhaseActivityListModule { }
