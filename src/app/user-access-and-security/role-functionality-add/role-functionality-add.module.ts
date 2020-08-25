import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { RoleFunctionalityAddComponent } from './role-functionality-add.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : RoleFunctionalityAddComponent
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
    MatCheckboxModule    
  ],
  declarations: [
    RoleFunctionalityAddComponent,
  ],
  exports : [RoleFunctionalityAddComponent ]
})
export class RoleFunctionalityAddModule { }
