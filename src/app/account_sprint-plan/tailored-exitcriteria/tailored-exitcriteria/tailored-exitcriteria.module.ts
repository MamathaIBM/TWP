import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatDialogModule} from '@angular/material/dialog';
import { TailoredExitcriteriaService } from './tailored-exitcriteria.service';
import { TailoredExitcriteriaComponent } from '../tailored-exitcriteria.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCheckboxModule} from '@angular/material/checkbox';

const routes : Routes=[
  {
    path : '',
    component : TailoredExitcriteriaComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatTableModule,
    MatRadioModule,
    MatSortModule,
    MatPaginatorModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule,
    MatProgressBarModule,
    MatCheckboxModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-full-width' })
  ],
  declarations: [TailoredExitcriteriaComponent],
  providers:[
    TailoredExitcriteriaService,ToastrService
  ]
})
export class TailoredExitcriteriaModule { }
