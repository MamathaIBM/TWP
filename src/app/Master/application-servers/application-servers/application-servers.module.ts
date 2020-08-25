import { ApplicationServersComponent } from './../application-servers.component';
import { Routes, RouterModule } from '@angular/router';
import { ApplicationServersService } from './application-servers.service';
import { NgModule, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationInformationService } from 'src/app/Master/application-information/application-information/application-information.service';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';


const route : Routes = [
  {
    path : '',
    component : ApplicationServersComponent
  }
  
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
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
    ToastrModule.forRoot({ positionClass: 'toast-top-full-width' })
  ],
  declarations: [ApplicationServersComponent],
  providers : [ApplicationServersService,ToastrService ]
})
export class ApplicationServersModule { }
