import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule } from '@angular/material';
import { ConfigParameterValuesComponent } from './config-parameter-values.component';


const routes : Routes=[
  {
    path : '',
    component : ConfigParameterValuesComponent
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
    ConfigParameterValuesComponent
  ],
  exports : [ConfigParameterValuesComponent ]
})
export class ConfigParameterValuesModule { }
