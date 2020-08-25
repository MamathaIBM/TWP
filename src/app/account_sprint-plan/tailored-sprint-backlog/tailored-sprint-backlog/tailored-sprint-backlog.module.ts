import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { TailoredSprintBacklogComponent } from './../tailored-sprint-backlog.component';
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
import { TailoredSprintBacklogService } from 'src/app/account_sprint-plan/tailored-sprint-backlog/tailored-sprint-backlog/tailored-sprint-backlog.service';

const routes : Routes=[
  {
    path : '',
    component : TailoredSprintBacklogComponent
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
  declarations: [TailoredSprintBacklogComponent],
  providers: [TailoredSprintBacklogService]  
})
export class TailoredSprintBacklogModule { }
