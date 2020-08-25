import { Routes, RouterModule } from '@angular/router';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatProgressSpinnerModule, MatDialogModule } from '@angular/material';
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
import { SectionTableAddComponent, ContentTypeDialog, ExcelUploadDialog } from './section-table-add.component';




const routes : Routes=[
  {
    path : '',
    component : SectionTableAddComponent
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
    MatTooltipModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDialogModule  

  ],
  declarations: [
    SectionTableAddComponent,
    ContentTypeDialog,
    ExcelUploadDialog
  ],
  
  entryComponents: [ContentTypeDialog,SectionTableAddComponent, ExcelUploadDialog],
  exports : [SectionTableAddComponent ]
})
export class SectionTableAddModule { }
