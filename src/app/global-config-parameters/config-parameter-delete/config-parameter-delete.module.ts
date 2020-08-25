import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { ConfigParameterDeleteComponent } from './config-parameter-delete.component';


const routes : Routes=[
  {
    path : '',
    component : ConfigParameterDeleteComponent
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
    ConfigParameterDeleteComponent
  ],
  exports : [ConfigParameterDeleteComponent ]
})
export class ConfigParameterDeleteModule { }
