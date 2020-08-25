import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ClosurePhaseExitCriteriaListComponent } from './closure-phase-exit-crietria-list.component';




const routes : Routes=[
  {
    path : '',
    component : ClosurePhaseExitCriteriaListComponent
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
    ClosurePhaseExitCriteriaListComponent
  ],
  exports : 
  [ClosurePhaseExitCriteriaListComponent ]
})



export class ClosurePhaseExitCriteriaListModule { }
