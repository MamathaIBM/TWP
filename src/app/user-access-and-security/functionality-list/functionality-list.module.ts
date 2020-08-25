import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FunctionalityListComponent } from './functionality-list.component';
import { MatIconModule, MatTableModule, MatFormFieldModule, MatInputModule, MatSortModule } from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

const routes : Routes=[
  {
    path : '',
    component : FunctionalityListComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule,
    FormsModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule, 
    MatSortModule    
  ],
  declarations: [
    FunctionalityListComponent
  ],
  exports : [FunctionalityListComponent ]
})
export class FunctionalityListModule { }
