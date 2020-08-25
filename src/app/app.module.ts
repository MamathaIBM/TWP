
import { AppRoutingModule } from './app-routing.module';

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';

import { UserNameService } from 'Services/user-name.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StorageServiceModule} from 'angular-webstorage-service';
import { AngularWebStorageModule } from 'angular-web-storage';
import { CanDeactivateGuard } from './can-deactivate/can-deactivate.guard';

@NgModule({
  declarations: [
    AppComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    StorageServiceModule,
    BrowserAnimationsModule,
    AngularWebStorageModule
  ],
  providers: [ UserNameService,  StorageServiceModule,CanDeactivateGuard ],
  bootstrap: [AppComponent]
})
export class AppModule { }
