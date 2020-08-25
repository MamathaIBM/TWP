import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StAdminPlanPhaseActivityListComponent } from './st-admin-plan-phase-activity-list.component';

const routes : Routes=[
  {
    path : '',
    component : StAdminPlanPhaseActivityListComponent
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
  declarations: [StAdminPlanPhaseActivityListComponent],
  exports : [StAdminPlanPhaseActivityListComponent]
})
export class StAdminPlanPhaseActivityListModule { }
