import { EpicSprintPlanService } from './../../epic-sprint-plan/epic-sprint-plan/epic-sprint-plan.service';
import { EpicSprintPlanComponent } from './../../epic-sprint-plan/epic-sprint-plan.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { EpicSprintPlanAddUpdateModule } from '../epic-sprint-plan-add-update/epic-sprint-plan-add-update/epic-sprint-plan-add-update.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
const routes : Routes=[
  {
    path : '',
    component : EpicSprintPlanComponent
  }
]

@NgModule({
  imports: [      
      ReactiveFormsModule ,
      FormsModule,
      MatProgressSpinnerModule,
      CommonModule,
      RouterModule.forChild(routes),
      MatButtonModule,
      MatInputModule,
      MatTableModule,
      MatRadioModule,
      MatPaginatorModule,
      MatSortModule,
      MatSelectModule,
      MatDatepickerModule,
      MatAutocompleteModule,
      EpicSprintPlanAddUpdateModule
  ],
  declarations: [EpicSprintPlanComponent],
  providers:[EpicSprintPlanService]
})
export class EpicSprintPlanModule { }
