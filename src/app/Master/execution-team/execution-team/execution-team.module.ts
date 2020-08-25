import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecutionTeamComponent } from '../execution-team.component';
import { Routes, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import {MatSelectModule} from '@angular/material/select';
import { ExecutionTeamService } from './execution-team.service';

const routes: Routes = [
  {
    path : '',
    component : ExecutionTeamComponent
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
  declarations: [ExecutionTeamComponent],
  providers : [ExecutionTeamService ],
  exports : [ExecutionTeamComponent ]
})


export class ExecutionTeamModule { }
