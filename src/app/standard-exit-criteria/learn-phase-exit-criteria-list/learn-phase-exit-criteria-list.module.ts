import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LearnPhaseExitCriteriaListComponent } from './learn-phase-exit-crietria-list.component';




const routes : Routes=[
  {
    path : '',
    component : LearnPhaseExitCriteriaListComponent
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
    LearnPhaseExitCriteriaListComponent
  ],
  exports : 
  [LearnPhaseExitCriteriaListComponent ]
})



export class LearnPhaseExitCriteriaListModule { }
