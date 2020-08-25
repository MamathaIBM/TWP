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
import { ReadinessQuestionDesignEditComponent } from './readiness-question-design-edit.component';


const routes : Routes=[
  {
    path : '',
    component : ReadinessQuestionDesignEditComponent
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
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatOptionModule,
    MatSelectModule,
    
  ],
  declarations: [
    ReadinessQuestionDesignEditComponent,

  ],
  exports : [ReadinessQuestionDesignEditComponent ]
})
export class ReadinessQuestionDesignEditModule { }
