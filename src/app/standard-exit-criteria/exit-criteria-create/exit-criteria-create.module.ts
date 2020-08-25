import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExitCriteriaCreateComponent } from './exit-criteria-create.component';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


const routes : Routes=[
  {
    path : '',
    component : ExitCriteriaCreateComponent
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
    ExitCriteriaCreateComponent
  ],
  exports : [ExitCriteriaCreateComponent ]
})
export class ExitCriteriaCreateModule { }
