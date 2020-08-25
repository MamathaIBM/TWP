import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StAdminPlanPhaseExitActivityListComponent } from './st-admin-plan-phase-exit-activity-list.component';
const routes : Routes=[
  {
    path : '',
    component : StAdminPlanPhaseExitActivityListComponent
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
  declarations: [StAdminPlanPhaseExitActivityListComponent],
  exports : [StAdminPlanPhaseExitActivityListComponent]
})
export class StAdminPlanPhaseExitActivityListModule { }
