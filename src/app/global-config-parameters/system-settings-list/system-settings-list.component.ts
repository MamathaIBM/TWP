import { Component, OnInit, ViewChild } from '@angular/core';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import {Router} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { ConfigParameter } from 'Vo/ConfigParameter';
import { ConfigParameterService } from 'Services/configparameter.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Keyvalue } from 'Vo/keyvalue';
import { UtilityService } from 'Services/utility.service';


@Component({
  selector: 'app-system-settings-list',
  templateUrl: './system-settings-list.component.html',
  styleUrls: ['./system-settings-list.component.css']
})
export class SystemSettingsListComponent implements OnInit {

  systemSettingsForm: FormGroup;
  logValues: Keyvalue[] = [];

  constructor(private navigation: NavtntService,fb: FormBuilder, 
              private configParameterService: ConfigParameterService, 
              private utility: UtilityService, 
              router: Router) { 
    this.systemSettingsForm = fb.group({
      logTrace:[''],      
      configParameterValue:[''],
    });
  }

  ngOnInit() {
    this.logValues = this.utility.getYN();
        
  }


  saveLogConfig(){

       let configParameter = '{ "log_trace": "'+ this.systemSettingsForm.controls['logTrace'].value+'"}';
       this.configParameterService.saveLogConfig( configParameter ).subscribe((applications:any[]) => {                     
           console.log("##################################################################################################");
           alert("Settings is effective");      
    });

  }  


}
