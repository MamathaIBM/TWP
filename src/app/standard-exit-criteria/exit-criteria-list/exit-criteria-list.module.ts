import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatSortModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ExitCriteriaListComponent } from './exit-criteria-list.component';



const routes : Routes=[
  {
    path : '',
    component : ExitCriteriaListComponent
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
    MatCheckboxModule,
    MatSortModule    
  ],
  declarations: [
    ExitCriteriaListComponent,
  ],
  exports : [ExitCriteriaListComponent ]
})
export class ExitCriteriaListModule { }
