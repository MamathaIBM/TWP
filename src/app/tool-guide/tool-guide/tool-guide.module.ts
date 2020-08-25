import { RouterModule, Routes } from '@angular/router';
import { ToolGuideComponent } from './../tool-guide.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

const routes : Routes =[
  {
    path : '',
    component : ToolGuideComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    ToolGuideComponent
  ]
})
export class ToolGuideModule { }
