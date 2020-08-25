import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PlanPhaseExitCriteriaListComponent } from './plan-phase-exit-crietria-list.component';

const routes : Routes=[
  {
    path : '',
    component : PlanPhaseExitCriteriaListComponent
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
    PlanPhaseExitCriteriaListComponent
  ],
  exports : 
  [PlanPhaseExitCriteriaListComponent ]
})



export class PlanPhaseExitCriteriaListModule { }
