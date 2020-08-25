import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {RAIDComponent} from 'src/app/Manage-Sprint//raid/raid.component';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import {MatButtonModule} from '@angular/material/button';
import { NgForm,FormsModule ,ReactiveFormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : RAIDComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule
  ],
  exports:[FormsModule],
  declarations: [
    RAIDComponent
  ]
 
})
export class RaidModule { }
