import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFunctionalityComponent } from './role-functionality.component';
import { MatIconModule, MatTableModule } from '@angular/material';

const routes : Routes=[
  {
    path : '',
    component : RoleFunctionalityComponent
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule
  ],
  declarations: [
    RoleFunctionalityComponent
  ],
  exports : [RoleFunctionalityComponent ]
})
export class RoleFunctionalityModule { }
