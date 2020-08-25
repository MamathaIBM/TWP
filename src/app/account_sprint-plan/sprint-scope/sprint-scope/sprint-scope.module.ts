import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';

import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule, MatTooltipModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SprintScopeComponent } from '../sprint-scope.component';
import { SprintScopeService } from './sprint-scope.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatDialogModule} from '@angular/material/dialog';
// import { SprintScopeComponent } from '../sprint-scope.component';
// import { SprintScopeService } from './sprint-scope.service';



const routes : Routes=[
  {
    path : '',
    component : SprintScopeComponent
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
    MatTooltipModule,
    MatAutocompleteModule,
    MatDialogModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-full-width' })
  ],
  declarations: [
    SprintScopeComponent
  ],
  providers:[
    SprintScopeService,ToastrService
  ]
})
export class SprintScopeModule { }
