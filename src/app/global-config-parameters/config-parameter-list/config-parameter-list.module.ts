import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatSortModule, MatPaginatorModule } from '@angular/material';
import { ConfigParameterListComponent } from './config-parameter-list.component';

const routes : Routes=[
  {
    path : '',
    component : ConfigParameterListComponent
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule 
  ],
  declarations: [
    ConfigParameterListComponent
  ],
  exports : [ConfigParameterListComponent ]
})
export class ConfigParameterListModule { }
