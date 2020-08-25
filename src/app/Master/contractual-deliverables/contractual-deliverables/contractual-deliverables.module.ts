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
import { ContractualDeliverablesComponent } from '../contractual-deliverables.component';
import { ContractualDeliverablesService } from './contractual-deliverables.service';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import {MatDialogModule} from '@angular/material/dialog';

const routes: Routes = [
  {
    path : '',
    component : ContractualDeliverablesComponent
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
    MatSelectModule,
    MatAutocompleteModule,
    MatDialogModule
  ],
  declarations: [
    ContractualDeliverablesComponent,
    // TopNavigationComponent
    // TransitionStakeholderListComponent,
    // TransitionStakeholderUpdateComponent

  ],
  providers : [ContractualDeliverablesService],
  exports : [ContractualDeliverablesComponent ]
})
export class ContractualDeliverablesModule { }
