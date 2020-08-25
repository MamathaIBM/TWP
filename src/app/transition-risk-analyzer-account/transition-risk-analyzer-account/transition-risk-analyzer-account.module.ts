import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
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
import { TransitionRiskAnalyzerAccountComponent } from '../transition-risk-analyzer-account.component';
import { TransitionRiskAnalyzerAccountService } from './transition-risk-analyzer-account.service';
import {MatDialogModule} from '@angular/material/dialog'
import { TransitionRiskAnalyzerAddAccountComponent } from '../transition-risk-analyzer-add-account/transition-risk-analyzer-add-account.component';


const routes : Routes = [
  {
    path : '',
    component : TransitionRiskAnalyzerAccountComponent
    
  }
]

@NgModule({
  entryComponents: [TransitionRiskAnalyzerAddAccountComponent],
  imports: [
    MatDialogModule,
    CommonModule,
    MatAutocompleteModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule ,
    FormsModule,
    MatSelectModule,    
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
  declarations: [
    TransitionRiskAnalyzerAccountComponent,
    TransitionRiskAnalyzerAddAccountComponent
  ],
  providers: [TransitionRiskAnalyzerAccountService]
})
export class TransitionRiskAnalyzerAccountModule { }
