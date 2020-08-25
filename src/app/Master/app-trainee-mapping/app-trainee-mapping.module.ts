import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule, MatTableModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatGridListModule, MatGridTile, MatOptionModule, MatSelectModule, MatProgressSpinnerModule, MatSpinner, MatTooltipModule } from '@angular/material';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppTraineeMappingComponent } from './app-trainee-mapping.component';




const routes : Routes=[
  {
    path : '',
    component : AppTraineeMappingComponent
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
    MatCheckboxModule,
    MatGridListModule,
    MatOptionModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  declarations: [
    AppTraineeMappingComponent,
  ],
  exports : [AppTraineeMappingComponent ]
})
export class AppTraineeMappingModule { 

  
}
