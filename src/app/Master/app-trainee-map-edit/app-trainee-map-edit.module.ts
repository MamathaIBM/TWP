import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatCheckbox, MatCheckboxModule, MatDatepickerModule, MatPaginatorModule, MatProgressSpinnerModule, MatSpinner  } from '@angular/material';

import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule} from '@angular/material/tooltip'
import { AppTraineeMapEditComponent } from './app-trainee-map-edit.component';

const routes : Routes=[
  {
    path : '',
    component : AppTraineeMapEditComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    MatCheckboxModule,
    MatTooltipModule,

    
    MatDatepickerModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
  ],


  declarations: [
    AppTraineeMapEditComponent
  ],
  exports : [AppTraineeMapEditComponent ]
})
export class AppTraineeMapEditModule { }
