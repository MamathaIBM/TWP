import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StAdminHandoverPhaseExitActivityListComponent } from './st-admin-handover-phase-exit-activity-list.component';
const routes : Routes=[
  {
    path : '',
    component : StAdminHandoverPhaseExitActivityListComponent
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
  declarations: [StAdminHandoverPhaseExitActivityListComponent],
  exports : [StAdminHandoverPhaseExitActivityListComponent]

})
export class StAdminHandoverPhaseExitActivityListModule { }
