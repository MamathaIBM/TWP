import { Component, OnInit, ViewChild } from '@angular/core';

import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

import { Parameter } from 'Vo/parameter';
import { ParameterService } from 'Services/parameter.service';
import { NavtntService } from 'src/app/navtnt.service';
import { UtilityService } from 'Services/utility.service';


@Component({
  selector: 'app-parameter-list',
  templateUrl: './parameter-list.component.html',
  styleUrls: ['./parameter-list.component.css']
})
export class ParameterListComponent implements OnInit {

  tran_id:string="-1";
  dataLength = 0;
  @ViewChild(MatSort) sort: MatSort;

  parameter: Parameter = {
      parameterId:'',
      transitionId:'',
      parameterName:'',
      description:'',
      adoptedField:'',
      adoptionCompleted:'',
      parameterIdGlobal:'',       
      resourceTypeMeasured:'',
      evalTechniqueManual:'',
      evaluationExpression: '',        
      RAG_R_operation_1: '',
      RAG_R_operation_2: '',
      RAG_R_cutoff_value_low: '',
      RAG_R_cutoff_value_high: '',
      RAG_A_operation_1: '',
      RAG_A_operation_2: '',
      RAG_A_cutoff_value_low: '',
      RAG_A_cutoff_value_high: '',
      RAG_G_operation_1: '',
      RAG_G_operation_2: '',
      RAG_G_cutoff_value_low: '',
      RAG_G_cutoff_value_high:'',
      customOrGlobal:''
  }

  parameters: Parameter[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'parameterName', 'description','resourceTypeMeasured', 
                                 'evalTechniqueManual', 'evaluationExpression','parameterId'];

  constructor(private route:Router,
              private utilityService: UtilityService,
              private navigation: NavtntService, 
              private userAccessProfileService: UserAccessProfileService, 
              private parameterService: ParameterService, 
              private dataandparamService: DataandparamService, 
              private router: Router) { }

  ngOnInit() {

    //this.tran_id = this.dataandparamService.getTransitionId();
    this.getParameterGlobalList();
  }

  getParameterGlobalList(){

    console.log(  "getParameterList()"); 

    this.parameterService.getParameterGlobalList().subscribe((parameters:any[]) => {
                     
      console.log("###########################################");

      console.log("parameters.length "+parameters.length); 

      if (parameters.length>0){
        // Clears old data
        this.parameters = [];
      }
                    
      for(var i=0; i<parameters.length; i++) {

          console.log("Value of i"+i);


          let parameter: Parameter = {
              parameterId:'',
              transitionId:'',
              parameterName:'',
              description:'',
              adoptedField:'',
              adoptionCompleted:'',
              parameterIdGlobal:'',               
              resourceTypeMeasured:'',
              evalTechniqueManual:'',
              evaluationExpression: '',        
              RAG_R_operation_1: '',
              RAG_R_operation_2: '',
              RAG_R_cutoff_value_low: '',
              RAG_R_cutoff_value_high: '',
              RAG_A_operation_1: '',
              RAG_A_operation_2: '',
              RAG_A_cutoff_value_low: '',
              RAG_A_cutoff_value_high: '',
              RAG_G_operation_1: '',
              RAG_G_operation_2: '',
              RAG_G_cutoff_value_low: '',
              RAG_G_cutoff_value_high:'',
              customOrGlobal:''                      
          }
           

          parameter.parameterId = parameters[i].PARAMETER_GLOBAL_ID;
          parameter.transitionId = parameters[i].TRANSITION_ID;
          parameter.parameterName = parameters[i].PARAMETER_NAME;
          parameter.description = parameters[i].DESCRIPTION;
          parameter.resourceTypeMeasured = parameters[i].RESOURCE_TYPE_MEASURED;
          parameter.evalTechniqueManual = parameters[i].EVALUATION_TECHNIQUE_MANUAL;
          parameter.evaluationExpression = parameters[i].EVALUATION_EXPRESSION;
          parameter.RAG_R_operation_1 = parameters[i].RAG_R_OPERATOR_1;
          parameter.RAG_R_operation_2 = parameters[i].RAG_R_OPERATOR_2;
          parameter.RAG_R_cutoff_value_low = parameters[i].RAG_R_CUTOFF_VALUE_LOW;
          parameter.RAG_R_cutoff_value_high = parameters[i].RAG_R_CUTOFF_VALUE_HIGH;
          parameter.RAG_A_operation_1 = parameters[i].RAG_A_OPERATOR_1;
          parameter.RAG_A_operation_2 = parameters[i].RAG_A_OPERATOR_2;
          parameter.RAG_A_cutoff_value_low = parameters[i].RAG_A_CUTOFF_VALUE_LOW;
          parameter.RAG_A_cutoff_value_high = parameters[i].RAG_A_CUTOFF_VALUE_HIGH;
          parameter.RAG_G_operation_1 = parameters[i].RAG_G_OPERATOR_1;
          parameter.RAG_G_operation_2 = parameters[i].RAG_G_OPERATOR_2;
          parameter.RAG_G_cutoff_value_low = parameters[i].RAG_G_CUTOFF_VALUE_LOW;
          parameter.RAG_G_cutoff_value_high = parameters[i].RAG_G_CUTOFF_VALUE_HIGH;

         
          this.parameters.push(parameter);
      }



      this.dataSource = new MatTableDataSource(this.parameters);
      this.dataSource.sort = this.sort;

      this.dataLength =  this.dataSource.data.length;
      
           //this.clients = clients1;
    });    
  }

  deleteParameter(parameter_id:string){

    this.parameterService.deleteParameter(parameter_id ).subscribe((parameters:any[]) => {
                     
      console.log("#####################################");
      this.getParameterGlobalList();
    });
  }

  onDelete(parameter) {
    console.log("Delete Clicked "+parameter.parameterId);    

    //Check if already question exists for this parameter
    var query = "select READINESS_QUESTION_ID from READINESS_QUESTION_GLOBAL where READINESS_QUESTION_CATEGORY='"+parameter.parameterId+"'";


        this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

              if (tmp_records.length == 0){
                if(confirm(" Are you sure to delete "+parameter.parameterName+" ?")) { 
                  this.deleteParameter(parameter.parameterId);  
                }         
              }else{
                  alert("Crieria is associated with this parameter, delete all crietria first. Then you can delete this parameter "+parameter.parameterName);
              } 

        });  
  }


  onUpdate(parameter) {
    console.log("Update Clicked "+parameter.parameterId);    
    var sourceComponentPath = '/admin-home/parameter-list';
    var destinationComponentPath = '/admin-home/parameter-edit';
    var destinationComponentParameterArray = [{ id: 'parameterId', param: parameter.parameterId } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }



  createNew() {
    
    var sourceComponentPath = '/admin-home/parameter-list';
    var destinationComponentPath = '/admin-home/parameter-add';
    var destinationComponentParameterArray = [] 

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }


  showReadinessQuestionGlobalList(parameter){

    //var controllerPath = '/controller-tnt'
    var sourceComponentPath = '/admin-home';
    var destinationComponentPath = '/admin-home/readiness-question-list';
    var destinationComponentParameterArray:any = [{ id: 'parameterId', param: parameter.parameterId },
                                                  { id: 'parameterName', param: parameter.parameterName }  ]     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
}

}
