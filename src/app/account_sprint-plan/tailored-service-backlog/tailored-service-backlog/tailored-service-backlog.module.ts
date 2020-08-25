import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TailoredServiceBacklogComponent } from 'src/app/account_sprint-plan/tailored-service-backlog/tailored-service-backlog.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule, MatProgressSpinnerModule, MatProgressBarModule, MatNativeDateModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import { TailoredServiceBacklogService } from 'src/app/account_sprint-plan/tailored-service-backlog/tailored-service-backlog/tailored-service-backlog.service';
import {MatDatepickerModule} from '@angular/material/datepicker'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatIconModule} from '@angular/material/icon'; 
const routes : Routes=[
  {
    path : '',
    component : TailoredServiceBacklogComponent
  }
]

@NgModule({
  imports: [
    MatIconModule,
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
  declarations: [TailoredServiceBacklogComponent],
  providers: [TailoredServiceBacklogService]
})
export class TailoredServiceBacklogModule { }
