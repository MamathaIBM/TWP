
import { SprintPlanApplnLevelComponent } from './../../sprint-plan-appln-level/sprint-plan-appln-level.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule, MatProgressSpinnerModule, MatProgressBarModule, MatNativeDateModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatExpansionModule} from '@angular/material/expansion';
import { SprintPlanApplnLevelService } from 'src/app/account_sprint-plan/sprint-plan-appln-level/sprint-plan-appln-level/sprint-plan-appln-level.service';
import {MatIconModule} from '@angular/material/icon'; 
const routes: Routes = [
  {
    path : '',
    component : SprintPlanApplnLevelComponent
  }
]

@NgModule({
  imports: [
    MatIconModule,
    MatExpansionModule,
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
  
  declarations: [SprintPlanApplnLevelComponent],
  providers:[SprintPlanApplnLevelService]
})
export class SprintPlanApplnLevelModule { }
