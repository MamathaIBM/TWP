import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { UserRoleListComponent } from './user-role-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : UserRoleListComponent
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
    UserRoleListComponent
  ],
  exports : [UserRoleListComponent ]
})
export class UserRoleListModule { }
