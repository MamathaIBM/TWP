import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceTransitionInfoComponent } from '../service-transition-info.component';
import { Routes, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatNativeDateModule, MatIconModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { MatDatepickerModule } from '@angular/material';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete'; 
import { ServiceTransitionInfoService } from '../service/service-transition-info.service';
import { ServiceTransitionInfoAddEditModule } from '../add-edit/module/service-transition-info-add-edit.module';


const routes : Routes=[
  {
    path : '',
    component : ServiceTransitionInfoComponent
  }
]

@NgModule({
  imports: [
    MatIconModule,
    MatNativeDateModule,
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
      ServiceTransitionInfoAddEditModule
  ],
  declarations: [ServiceTransitionInfoComponent],
  providers : [ServiceTransitionInfoService]
})
export class ServiceTransitionInfoModule { }
