import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServiceBacklogActivityListComponent } from './service-backlog-activity-list.component';



const routes : Routes=[
  {
    path : '',
    component : ServiceBacklogActivityListComponent
  }

]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatIconModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,    
    ReactiveFormsModule ,
    FormsModule,
    MatCheckboxModule    
  ],
  declarations: [
    ServiceBacklogActivityListComponent
  ],
  exports : 
  [ServiceBacklogActivityListComponent ]
})


export class ServiceBacklogActivityListModule { }
