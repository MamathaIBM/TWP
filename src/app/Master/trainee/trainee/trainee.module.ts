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
import { TraineeComponent } from '../trainee.component';
import { TraineeService } from './trainee.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatDialogModule} from '@angular/material/dialog';
import {MatProgressBarModule} from '@angular/material/progress-bar';


const routes : Routes=[
  {
    path : '',
    component : TraineeComponent
  }
]


@NgModule({
  imports: [
    ReactiveFormsModule ,
  FormsModule,
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
    MatDialogModule,
    MatProgressBarModule
  ],
  declarations: [
    TraineeComponent,
    // TopNavigationComponent
    // TransitionStakeholderListComponent,
    // TransitionStakeholderUpdateComponent

  ],
  providers : [TraineeService],
  exports : [TraineeComponent ]
})
export class TraineeModule { }
