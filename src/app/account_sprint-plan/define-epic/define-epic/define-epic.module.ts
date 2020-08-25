import { DefineEpicService } from './../../define-epic/define-epic/define-epic.service';
import { DefineEpicComponent } from './../../define-epic/define-epic.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatNativeDateModule, MatIconModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { EpicAddUpdateModule } from '../define-epic-add-update/epic-add-update/epic-add-update.module';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner'; 
const routes : Routes=[
  {
    path : '',
    component : DefineEpicComponent
  }
]

@NgModule({
  imports: [
    MatIconModule,
    MatNativeDateModule,
    ReactiveFormsModule ,
    FormsModule,
      CommonModule,
      MatProgressSpinnerModule,
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
      EpicAddUpdateModule
  
  ],
  declarations: [DefineEpicComponent
  ],
  providers : [DefineEpicService],
  
})
export class DefineEpicModule { }
