import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExitCriteriaEditComponent } from './exit-criteria-edit.component';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes : Routes=[
  {
    path : '',
    component : ExitCriteriaEditComponent
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
    
  ],
  declarations: [
    ExitCriteriaEditComponent
  ],
  exports : [ExitCriteriaEditComponent ]
})
export class ExitCriteriaEditModule { }
