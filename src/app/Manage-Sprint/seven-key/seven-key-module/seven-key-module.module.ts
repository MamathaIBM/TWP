
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import { SevenKeyComponent } from './../seven-key.component';
import { KeyRisksDialog } from './../seven-key.component';
import { IssuesDialog } from './../seven-key.component';
import { ActionsDialog } from './../seven-key.component';
import { DependencyDialog } from './../seven-key.component';
import { DeliverablesDialog } from './../seven-key.component';
import { DetailedScheduleDialog } from './../seven-key.component';
import { SevenKeyModuleService } from 'src/app/Manage-Sprint/seven-key/seven-key-module/seven-key-module.service';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatSelectModule} from '@angular/material/select';
import { MatPaginatorModule, MatRadioModule,MatFormFieldModule,MatCheckboxModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs'; 
import {MatExpansionModule} from '@angular/material/expansion';
import { MatCardModule } from '@angular/material';

const routes : Routes = [
  {
    path : '',
    component : SevenKeyComponent
  },
  {
    path : '',
    component : KeyRisksDialog
  },
  {
    path : '',
    component : IssuesDialog
  },
  {
    path : '',
    component : ActionsDialog
  },
  {
    path : '',
    component : DependencyDialog
  },
  {
    path : '',
    component : DeliverablesDialog
  },
  {
    path : '',
    component : DetailedScheduleDialog
  }
]

@NgModule({
  imports: [
    ReactiveFormsModule ,
    FormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    MatCheckboxModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    MatRadioModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatCardModule,
    ToastrModule.forRoot({ positionClass: 'toast-top-full-width' })
  ],
  declarations: [
    SevenKeyComponent,
    KeyRisksDialog,
    IssuesDialog,
    ActionsDialog,
    DependencyDialog,
    DeliverablesDialog,
    DetailedScheduleDialog
  ],
  providers :[SevenKeyModuleService,ToastrService],
  exports : [SevenKeyComponent,KeyRisksDialog,IssuesDialog,ActionsDialog,DependencyDialog,DeliverablesDialog,DetailedScheduleDialog]
})
export class SevenKeyModuleModule { }
