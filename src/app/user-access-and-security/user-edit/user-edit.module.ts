import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserEditComponent } from './user-edit.component';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

const routes : Routes=[
  {
    path : '',
    component : UserEditComponent
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
    UserEditComponent
  ],
  exports : [UserEditComponent ]
})
export class UserEditModule { }
