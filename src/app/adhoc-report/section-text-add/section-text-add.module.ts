import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatProgressSpinnerModule } from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';


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
import { SectionTextAddComponent } from './section-text-add.component';
import { CustomReportAddAdoptModule } from '../custom-report-add-adopt/custom-report-add-adopt.module';
import { CustomReportAddModule } from '../custom-report-add/custom-report-add.module';


//import { MatColorPickerModule } from 'mat-color-picker/color-picker.module';




const routes : Routes=[
  {
    path : '',
    component : SectionTextAddComponent
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
    MatSelectModule,
    MatProgressSpinnerModule,
   // MatColorPickerModule,
   CustomReportAddAdoptModule, CustomReportAddModule
    
    
  ],
  declarations: [
    SectionTextAddComponent
  ],
  exports : [SectionTextAddComponent,  ]
})
export class SectionTextAddModule { }
