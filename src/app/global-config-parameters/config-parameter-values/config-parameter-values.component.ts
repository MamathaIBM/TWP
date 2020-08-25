import { Component, OnInit } from '@angular/core';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router, ActivatedRoute} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { ConfigParameter } from 'Vo/ConfigParameter';
import { ConfigParameterService } from 'Services/configparameter.service';


@Component({
  selector: 'app-config-parameter-values',
  templateUrl: './config-parameter-values.component.html',
  styleUrls: ['./config-parameter-values.component.css']
})
export class ConfigParameterValuesComponent implements OnInit {



  parameter ="";
  configParameters: ConfigParameter[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'configParameterName', 'configParameterId'];

  constructor(private nav: NavtntService, private configParameterService: ConfigParameterService, private dataandparamService: DataandparamService, private route: ActivatedRoute) { }

  ngOnInit() {        
        this.route.queryParams.subscribe((p: any) => {    
          if (p.filter){
              this.parameter = this.nav.getParameterValue(p.filter, 'parameter')        
              this.getConfigParameterValues(this.parameter);   
          }
        });
  }

  getConfigParameterValues(parameter){

    console.log(  "getConfigParameterValues()"); 

    this.configParameterService.getConfigParameterValues(parameter).subscribe((configParameters:any[]) => {
                     
      console.log("##################################################################################################");

      //console.log("clients.length "+configParameters.length); 

      var configParameters_tmp: ConfigParameter[];

      //if (configParameters.length>0){
        // Clears old data
      this.configParameters = [];

     this.configParameters = configParameters;

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.configParameters);
      
           //this.clients = clients1;
    });    
  }

  onParameterValue(configParameter){                     
            console.log("##################################################################################################");
            //this.router.navigate(['controller-tnt', 'configParameter-functionality/'+configParameter.configParameterId]);    

            //this.router.navigate(["/admin-home/configParameter-functionality"],{queryParams:{configParameterId:configParameter.configParameterId}})

            //var controllerPath = '/controller-tnt'
            var sourceComponentPath = '/admin-home/config-parameter-list';
            var destinationComponentPath = '/admin-home/config-parameter-values';
            var destinationComponentParameterArray = [{ id: 'configParameterId', param: configParameter.ROLE_ID }, { id: 'configParameterName', param: configParameter.ROLE_NAME } ]     

            this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}



  onEdit(id, FieldCategoryName, Categoryvalues) {
     
    //this.router.navigate(['controller-tnt', 'configParameter-edit/'+configParameter.configParameterId]);
    //this.router.navigate(["/admin-home/configParameter-edit"],{queryParams:{configParameterId:configParameter.configParameterId}})

    var sourceComponentPath = '/admin-home/config-parameter-values';
    var destinationComponentPath = '/admin-home/config-parameter-values-edit';
    var destinationComponentParameterArray = [
                { id: 'configParameterId', param: id },
                { id: 'configParameterName', param: FieldCategoryName },
                { id: 'configParameterValue', param: Categoryvalues } 
    ]     

    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

  createNew(parameter) {

    var sourceComponentPath = '/admin-home/config-parameter-list';
    var destinationComponentPath = '/admin-home/config-parameter-values-add';
    var destinationComponentParameterArray = [{ id: 'parameter', param: parameter },
                                              { id: 'operationType', param: 'add_value' } ] ;   
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

  deleteConfigParameterValue(configParameterId:string){

    var sourceComponentPath = '/admin-home/config-parameter-list';
    var destinationComponentPath = '/admin-home/config-parameter-values-delete';
    var destinationComponentParameterArray = [
                                                { id: 'parameter', param: this.parameter },   
                                                { id: 'configParameterId', param: configParameterId }                                           
                                             ]     
  
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  
  }
  
  onDelete(configParameterId, configParemeterValue) {
    if(confirm("You have selected "+configParemeterValue+". Are you sure to delete?")) {  
          this.deleteConfigParameterValue(configParameterId);
    }
  }

}
