import { ViewConsentformComponent } from './../view-consentform.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

const routes : Routes = [
  {
    path : '',
    component : ViewConsentformComponent
  }
]


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild (routes)
  ],
  declarations: [
    ViewConsentformComponent
  ]
})
export class ViewConsentformModule { }
