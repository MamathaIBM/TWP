import { Component, OnInit } from '@angular/core';

import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { ReadinessQuestion } from 'Vo/readinessquestion';
import { ReadinessQuestionService } from 'Services/readinessquestion.service';
import { ReadinessQuestionsTracker } from 'Vo/readinessquestionstracker';
import { Observable, of } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';


@Component({
      selector: 'app-readiness-question-tracking-save',
      templateUrl: './readiness-question-tracking-save.component.html',
      styleUrls: ['./readiness-question-tracking-save.component.css']
})
export class ReadinessQuestionTrackingSaveComponent implements OnInit {

  transition_id:string="";
  jsonRecords:string="";
  parameterId:string="";
  parameterName:string="";
  resourceTypeMeasured:string="";
  returnPath ="";
  appIds ="";


  constructor( private route: ActivatedRoute,
               private navigation: NavtntService,  
               private readinessQuestionService: ReadinessQuestionService,
               private userAccessProfileService: UserAccessProfileService ) {}

  ngOnInit() {
          this.route.queryParams.subscribe((p: any) => {    
                  if (p.filter){
                          //this.transition_id = this.navigation.getParameterValue(p.filter, 'transition_id');
                          this.transition_id = this.userAccessProfileService.getCurrentTransitionID();
                          this.jsonRecords = this.navigation.getParameterValue(p.filter, 'jsonRecords')
                          this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId')   
                          this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')    
                          this.resourceTypeMeasured = this.navigation.getParameterValue(p.filter, 'resourceTypeMeasured')  
                          this.returnPath = this.navigation.getParameterValue(p.filter, 'returnPath')         
                          this.appIds = this.navigation.getParameterValue(p.filter, 'appIds')                                               
                          this.addOrUpdateReadinessQuestionTracking();
                  }
          });          
  }

  addOrUpdateReadinessQuestionTracking(){

        //alert("this.returnPath "+this.returnPath);
        this.readinessQuestionService.addOrUpdateReadinessQuestionTracking(this.jsonRecords,this.transition_id ).subscribe((applications:any[]) => {                     
                  console.log("##################################################################################################");
                  var sourceComponentPath = '/transition-Main/readiness-question-tracking-save';
                  var destinationComponentPath = this.returnPath;
                  var destinationComponentParameterArray = [    { id: 'parameterId', param: this.parameterId },
                                                                { id: 'resourceTypeMeasured', param: this.resourceTypeMeasured },
                                                                { id: 'parameterName', param: this.parameterName },
                                                                { id: 'appIds', param: this.appIds }
                                                           ]              
                  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
        });  
  }

}


