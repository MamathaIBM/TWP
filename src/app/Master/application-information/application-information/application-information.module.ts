import { Routes, RouterModule } from '@angular/router';
import { ApplicationInformationComponent } from './../application-information.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationInformationService } from 'src/app/Master/application-information/application-information/application-information.service';
import { FormsModule ,ReactiveFormsModule } from '@angular/forms';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule, MatRadioModule, MatSelectModule } from '@angular/material';
import { MatSortModule } from '@angular/material/sort';
import { ToastrModule, ToastrService } from 'ngx-toastr';


const routes : Routes=[
  {
    path : '',
    component : ApplicationInformationComponent
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
    MatProgressBarModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-full-width',
      maxOpened: 1,
      autoDismiss: true,
  })
  ],
  declarations: [
    ApplicationInformationComponent
  ],
  providers:[
    ApplicationInformationService,ToastrService
  ]
})
export class ApplicationInformationModule { }
