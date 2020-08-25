import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatProgressSpinnerModule, MatDialogClose, MatDialogModule } from '@angular/material';
import { MatTooltipModule} from '@angular/material/tooltip'

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
import { CustomReportAddComponent,  SaveAsDialog, ReportMediumSelectDialog } from './custom-report-add.component';
import { UserAddComponent } from 'src/app/user-access-and-security/user-add/user-add.component';

import {  ContentTypeDialog, SectionTableAddComponent, ExcelUploadDialog } from '../section-table-add/section-table-add.component';

import { SharedModule } from '../shared/shared.module';

import { SectionImageAddComponent } from '../section-image-add/section-image-add.component';
import { SectionTextAddComponent } from '../section-text-add/section-text-add.component';



const routes : Routes=[
  {
    path : '',
    component : CustomReportAddComponent
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
              MatCheckboxModule,
              SharedModule,
              MatTooltipModule,
              MatDialogModule     
  ],
  
  declarations: [
              CustomReportAddComponent,
              /*
              SectionTextAddComponent,
              SectionTableAddComponent,
              SectionImageAddComponent, 
              */
              
              SaveAsDialog,
              ReportMediumSelectDialog,
              ExcelUploadDialog
              
  ],
  
  entryComponents: [SaveAsDialog,ReportMediumSelectDialog, ContentTypeDialog,SectionTextAddComponent, SectionTableAddComponent,SectionImageAddComponent,ExcelUploadDialog],
  exports : [CustomReportAddComponent,
              MatIconModule,
              MatTableModule,
              MatInputModule,
              MatFormFieldModule,    
              ReactiveFormsModule ,
              FormsModule,
              MatOptionModule,
              MatSelectModule,
              MatProgressSpinnerModule,
              MatDialogModule,
              MatCheckboxModule,  
              SaveAsDialog,
              ReportMediumSelectDialog,
              ExcelUploadDialog
     ]
})
export class CustomReportAddModule { }
