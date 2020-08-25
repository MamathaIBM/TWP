import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { AppTraineeMapUploadComponent } from './app-trainee-map-upload.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : AppTraineeMapUploadComponent
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    ReactiveFormsModule ,
    FormsModule
  ],
  declarations: [
    AppTraineeMapUploadComponent
  ],
  exports : [AppTraineeMapUploadComponent ]
})
export class AppTraineeMapUploadModule { }
