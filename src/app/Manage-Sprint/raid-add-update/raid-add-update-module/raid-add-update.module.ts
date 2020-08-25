import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {RaidAddUpdateComponent} from 'src/app/Manage-Sprint//raid-add-update/raid-add-update.component';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatPaginatorModule, MatRadioModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatCheckboxModule} from '@angular/material/checkbox'; 
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { RaidAddUpdateService } from './raid-add-update.service';

const routes : Routes=[
  {
    path : '',
    component : RaidAddUpdateComponent
  }
]
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatAutocompleteModule
  ],
  exports:[FormsModule,
    ReactiveFormsModule,
  ],
  declarations: [RaidAddUpdateComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers : [RaidAddUpdateService]
})
export class RaidAddUpdateModule { }
