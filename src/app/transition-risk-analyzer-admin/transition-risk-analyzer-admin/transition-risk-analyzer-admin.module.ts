import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TransitionRiskAnalyzerAdminComponent } from '../transition-risk-analyzer-admin.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule, MatProgressSpinnerModule,MatNativeDateModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { TransitionRiskAnalyzerAdminService } from './transition-risk-analyzer-admin.service';


const routes : Routes = [
  {
    path : '',
    component : TransitionRiskAnalyzerAdminComponent
  }
]

@NgModule({
  imports: [
    
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule ,
    FormsModule,
    MatSelectModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSortModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-full-width' }),
    MatCheckboxModule
  ],
  declarations: [TransitionRiskAnalyzerAdminComponent],
  providers : [TransitionRiskAnalyzerAdminService]
})
export class TransitionRiskAnalyzerAdminModule { }
