import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SectionTableAddComponent, ContentTypeDialog } from '../section-table-add/section-table-add.component';
import { SectionImageAddComponent } from '../section-image-add/section-image-add.component';

import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule, MatProgressSpinnerModule, MatTooltipModule, MatDialogModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SectionTextAddComponent } from '../section-text-add/section-text-add.component';


@NgModule({
  imports: [
    CommonModule,
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
    MatDialogModule,
    MatCheckboxModule
  ],
  declarations: [SectionTextAddComponent,SectionTableAddComponent,SectionImageAddComponent,ContentTypeDialog ],
  exports : [SectionTextAddComponent,SectionTableAddComponent,SectionImageAddComponent, ContentTypeDialog  ]

})
export class SharedModule { }
