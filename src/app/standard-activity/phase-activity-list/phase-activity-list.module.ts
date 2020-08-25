import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { PhaseActivityListComponent } from './phase-activity-list.component';


const routes : Routes=[
  {
    path : '',
    component : PhaseActivityListComponent
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
    MatCheckboxModule ,
    MatSortModule    
  ],
  declarations: [
    PhaseActivityListComponent,
  ],
  exports : [PhaseActivityListComponent ]
})
export class PhaseActivityListModule { }
