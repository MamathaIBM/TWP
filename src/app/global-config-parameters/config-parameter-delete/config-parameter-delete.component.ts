import { Component, OnInit } from '@angular/core';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router, ActivatedRoute} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { ConfigParameter } from 'Vo/ConfigParameter';
import { ConfigParameterService } from 'Services/configparameter.service';


@Component({
  selector: 'app-config-parameter-delete',
  templateUrl: './config-parameter-delete.component.html'  
})
export class ConfigParameterDeleteComponent implements OnInit {

  configParameterName = "";

  constructor(private navigation: NavtntService, 
              private configParameterService: ConfigParameterService,  
              private route: ActivatedRoute) { }

  ngOnInit() {

    this.route.queryParams.subscribe((p: any) => {    
          if (p.filter){
              this.configParameterName = this.navigation.getParameterValue(p.filter, 'parameter')  
              this.deleteConfigParameter(this.configParameterName);
          }
    });

  }



  deleteConfigParameter(configParameterName:string){
      this.configParameterService.deleteConfigParameter(configParameterName ).subscribe((configParameters:any[]) => {                   
          var sourceComponentPath = '/admin-home/config-parameter-delete';
          var destinationComponentPath = '/admin-home/config-parameter-list';
          var destinationComponentParameterArray = [] ;   
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
      });
  }

}
