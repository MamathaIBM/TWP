import { Component, OnInit, ViewChild } from '@angular/core';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatSort, MatPaginator, PageEvent } from '@angular/material';
import {Router} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { ConfigParameter } from 'Vo/ConfigParameter';
import { ConfigParameterService } from 'Services/configparameter.service';

export interface ConfigParameterList {
  // MatPaginator Output
  pageEvent: PageEvent;
  highlighted?: boolean;
  hovered?: boolean;
}


@Component({
  selector: 'app-config-parameter-list',
  templateUrl: './config-parameter-list.component.html',
  styleUrls: ['./config-parameter-list.component.css']
})
export class ConfigParameterListComponent implements OnInit {

  
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  configParameters: ConfigParameter[] = [];
  dataSource = new MatTableDataSource<any>();
   displayedColumns: string[] = [ 'configParameterName', 'configParameterId'];

  constructor(private navigation: NavtntService, private configParameterService: ConfigParameterService, private dataandparamService: DataandparamService, private router: Router) { }

  ngOnInit() {

        this.getConfigParameterList();
       }

  getConfigParameterList(){

    console.log(  "getConfigParameterList()"); 

    this.configParameterService.getConfigParameterList().subscribe((configParameters:any[]) => {
                     
      console.log("##################################################################################################");

      //console.log("clients.length "+configParameters.length); 

      var configParameters_tmp: ConfigParameter[];

      //if (configParameters.length>0){
        // Clears old data
      this.configParameters = [];

     this.configParameters = configParameters;

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.configParameters);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
           //this.clients = clients1;
    });    
  }

  onParameterValue(configParameter){                     
            var sourceComponentPath = '/admin-home/config-parameter-list';
            var destinationComponentPath = '/admin-home/config-parameter-values';
            var destinationComponentParameterArray = [
                                                        { id: 'parameter', param: configParameter },
                                                        
                                                     ]     

            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


deleteConfigParameter(configParameter:string){

  var sourceComponentPath = '/admin-home/config-parameter-list';
  var destinationComponentPath = '/admin-home/config-parameter-delete';
  var destinationComponentParameterArray = [
                                              { id: 'parameter', param: configParameter },                                              
                                           ]     

  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}

onDelete(configParameter) {
  if(confirm("You have selected "+configParameter+". Are you sure to delete?")) {  
        this.deleteConfigParameter(configParameter);
  }
}


  onUpdate(configParameter) {
     


    var sourceComponentPath = '/admin-home/config-parameter-list';
    var destinationComponentPath = '/admin-home/configParameter-edit';
    var destinationComponentParameterArray = [{ id: 'configParameterId', param: configParameter.ROLE_ID } ]     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

  createNew() {

    var sourceComponentPath = '/admin-home/config-parameter-list';
    var destinationComponentPath = '/admin-home/config-parameter-values-add';
    var destinationComponentParameterArray = [{ id: 'operationType', param: 'new_param' }] ;   
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

}
