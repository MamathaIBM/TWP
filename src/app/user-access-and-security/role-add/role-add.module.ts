import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule } from '@angular/material';

import { MatInputModule } from '@angular/material';

import { MatTabsModule } from '@angular/material/tabs';
import { MatMenuModule} from '@angular/material';
import { MatSidenavModule} from '@angular/material';
import { MatFormFieldModule} from '@angular/material';
import { MatCheckboxModule} from '@angular/material';
import { MatRadioModule } from '@angular/material';
import { MatOptionModule } from '@angular/material';
import { MatSelectModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material';
import { RoleAddComponent } from './role-add.component';


const routes : Routes=[
  {
    path : '',
    component : RoleAddComponent
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
    
  ],
  declarations: [
    RoleAddComponent,

  ],
  exports : [RoleAddComponent ]
})
export class RoleAddModule { }
