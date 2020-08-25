import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ServiceBacklogExitCriteriaListComponent } from './service-backlog-exit-crietria-list.component';




const routes : Routes=[
  {
    path : '',
    component : ServiceBacklogExitCriteriaListComponent
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
    ServiceBacklogExitCriteriaListComponent
  ],
  exports : 
  [ServiceBacklogExitCriteriaListComponent ]
})



export class ServiceBacklogExitCriteriaListModule { }
