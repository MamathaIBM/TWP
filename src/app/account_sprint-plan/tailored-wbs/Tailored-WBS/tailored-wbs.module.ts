import { TailoredWBSService } from './tailored-wbs.service';
import { TailoredWBSComponent } from './../tailored-wbs.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule, MatProgressSpinnerModule, MatProgressBarModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatCheckboxModule} from '@angular/material/checkbox'; 


const routes : Routes=[
  {
    path : '',
    component : TailoredWBSComponent
  }
]
@NgModule({
  imports: [
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
      MatCheckboxModule,
  

  ],
  declarations: [TailoredWBSComponent],
  providers :[TailoredWBSService,ToastrService],
})
export class TailoredWBSModule { }
