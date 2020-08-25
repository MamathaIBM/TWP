import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserListComponent } from './user-list.component';
import { MatIconModule, MatTableModule, MatFormFieldModule, MatSortModule, MatInputModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : UserListComponent
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatFormFieldModule, 
    ReactiveFormsModule,
    MatSortModule,
    FormsModule,
    MatInputModule 
  ],
  declarations: [
    UserListComponent
  ],
  exports : [UserListComponent ]
})
export class UserListModule { }
