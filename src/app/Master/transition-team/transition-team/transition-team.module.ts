import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import { TransitionTeamComponent } from '../transition-team.component';
import { TransitionTeamService } from './transition-team.service';

const routes: Routes = [
  {
    path : '',
    component : TransitionTeamComponent
  }
];


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
    MatSelectModule
  ],
  declarations: [
    TransitionTeamComponent,
  ],
  providers : [TransitionTeamService],
  exports : [TransitionTeamComponent ]
})
export class TransitionTeamModule { }
