import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { FunctionalityUploadComponent } from './functionality-upload.component';

const routes : Routes=[
  {
    path : '',
    component : FunctionalityUploadComponent
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
    FunctionalityUploadComponent
  ],
  exports : [FunctionalityUploadComponent ]
})
export class FunctionalityUploadModule { }
