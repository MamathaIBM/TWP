import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatProgressSpinnerModule, MatDialogClose, MatDialogModule } from '@angular/material';

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
import { CustomReportAddAdoptComponent,  SaveAsDialog } from './custom-report-add-adopt.component';
import { UserAddComponent } from 'src/app/user-access-and-security/user-add/user-add.component';

import { SectionTableAddComponent, ContentTypeDialog } from '../section-table-add/section-table-add.component';
import { SectionImageAddComponent } from '../section-image-add/section-image-add.component';
import { SharedModule } from '../shared/shared.module';
import { SectionTextAddComponent } from '../section-text-add/section-text-add.component';





const routes : Routes=[
  {
    path : '',
    component : CustomReportAddAdoptComponent
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
              MatDialogModule,
              MatCheckboxModule,
              SharedModule  
  ],
  declarations: [
              CustomReportAddAdoptComponent,
              /*
              SectionTextAddComponent,
              SectionTableAddComponent,
              SectionImageAddComponent, 
              */
              
              SaveAsDialog,
              
  ],
  entryComponents: [SaveAsDialog,SectionTextAddComponent,SectionTableAddComponent,SectionImageAddComponent,ContentTypeDialog],
  exports : [CustomReportAddAdoptComponent,
    /*
    SectionTextAddComponent,
    SectionTableAddComponent,
    SectionImageAddComponent, 
    */
    SaveAsDialog,
     ]
})
export class CustomReportAddAdoptModule { }
