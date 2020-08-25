import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { ConfigParameterValuesDeleteComponent } from './config-parameter-values-delete.component';

const routes : Routes=[
  {
    path : '',
    component : ConfigParameterValuesDeleteComponent
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
    ConfigParameterValuesDeleteComponent
  ],
  exports : [ConfigParameterValuesDeleteComponent ]
})
export class ConfigParameterValuesDeleteModule { }
