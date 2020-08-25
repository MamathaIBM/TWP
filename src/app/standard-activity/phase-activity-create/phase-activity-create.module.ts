import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhaseActivityCreateComponent } from './phase-activity-create.component';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes : Routes=[
  {
    path : '',
    component : PhaseActivityCreateComponent
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
    MatOptionModule,
    MatSelectModule,
    NgMultiSelectDropDownModule
  ],
  declarations: [
    PhaseActivityCreateComponent
  ],
  exports : [PhaseActivityCreateComponent ]
})
export class PhaseActivityCreateModule { }
