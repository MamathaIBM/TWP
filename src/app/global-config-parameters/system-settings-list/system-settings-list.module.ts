import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatIconModule, MatTableModule, MatSortModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule } from '@angular/material';
import { SystemSettingsListComponent } from './system-settings-list.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

const routes : Routes=[
  {
    path : '',
    component : SystemSettingsListComponent
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
    MatOptionModule,
    MatSelectModule
  ],
  declarations: [
    SystemSettingsListComponent
  ],
  exports : [SystemSettingsListComponent ]
})
export class SystemSettingsListModule { }
