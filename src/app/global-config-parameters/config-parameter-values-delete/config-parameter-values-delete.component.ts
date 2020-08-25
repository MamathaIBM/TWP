import { Component, OnInit } from '@angular/core';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router, ActivatedRoute} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { ConfigParameter } from 'Vo/ConfigParameter';
import { ConfigParameterService } from 'Services/configparameter.service';


@Component({
  selector: 'app-config-parameter-values-delete',
  templateUrl: './config-parameter-values-delete.component.html'  
})
export class ConfigParameterValuesDeleteComponent implements OnInit {

  configParameterName = "";
  configParameterId="";

  constructor(private navigation: NavtntService, 
              private configParameterService: ConfigParameterService,  
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe((p: any) => {    
          if (p.filter){
              this.configParameterId = this.navigation.getParameterValue(p.filter, 'configParameterId')   
              this.configParameterName = this.navigation.getParameterValue(p.filter, 'parameter')  
              this.deleteConfigParameterValue(this.configParameterId);
          }
    });

  }



  deleteConfigParameterValue(configParameterId:string){
      this.configParameterService.deleteConfigParameterValue(configParameterId ).subscribe((configParameters:any[]) => {                   
          var sourceComponentPath = '/admin-home/config-parameter-values-delete';
          var destinationComponentPath = '/admin-home/config-parameter-values';
          var destinationComponentParameterArray = [{ id: 'parameter', param: this.configParameterName }] ;   
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
      });
  }

}
