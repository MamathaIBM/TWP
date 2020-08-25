import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleListComponent } from './role-list.component';
import { MatIconModule, MatTableModule, MatSortModule } from '@angular/material';

const routes : Routes=[
  {
    path : '',
    component : RoleListComponent
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatSortModule  
  ],
  declarations: [
    RoleListComponent
  ],
  exports : [RoleListComponent ]
})
export class RoleListModule { }
