import { Routes, RouterModule } from '@angular/router';
import { TransitionStakeholderComponent } from './../transition-stakeholder.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { TransitionStakeholderService } from 'src/app/Master/transition-stakeholder/transition-stakeholder-module/transition-stakeholder.service';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatSelectModule} from '@angular/material/select';
const routes : Routes = [
  {
    path : '',
    component : TransitionStakeholderComponent
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
    MatAutocompleteModule,
    MatSelectModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-full-width' })
  ],
  declarations: [
    TransitionStakeholderComponent,
    // TopNavigationComponent
    // TransitionStakeholderListComponent,
    // TransitionStakeholderUpdateComponent
  
  ],
  providers :[TransitionStakeholderService,ToastrService],
  exports : [TransitionStakeholderComponent ]
})
export class TransitionStakeholderModule { }
