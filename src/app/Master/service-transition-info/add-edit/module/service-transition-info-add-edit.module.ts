import { ServiceTransitionInfoAddEditComponent } from '../service-transition-info-add-edit.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatNativeDateModule, 
         MatCommonModule, MatDialogModule, MatFormFieldModule, MatIconModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 

@NgModule({
  imports: [
    MatIconModule,
    MatDialogModule,
    MatCommonModule,
    MatFormFieldModule,
      CommonModule,
      ReactiveFormsModule ,
      FormsModule,
      MatButtonModule,
      MatInputModule,
      MatTableModule,
      MatRadioModule,
      MatPaginatorModule,
      MatSortModule,
      MatSelectModule,
      MatDatepickerModule,
      MatAutocompleteModule,
  ],
  declarations: [ServiceTransitionInfoAddEditComponent],
  entryComponents : [ServiceTransitionInfoAddEditComponent]
})
export class ServiceTransitionInfoAddEditModule { }
