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
import { ApptraineemapService } from 'Services/apptraineemap.service';


@Component({
      selector: 'app-app-trainee-map-delete',
      templateUrl: './app-trainee-map-delete.component.html',
      styleUrls: ['./app-trainee-map-delete.component.css']
})
export class AppTraineeMapDeleteComponent implements OnInit {

  transition_id:string="";
  appIds:string="";
  appId:string="";
  traineeIds:string="";
  traineeId:string="";
  appTraineeMapId:string="";
  resourceTypeMeasured:string="";
  returnPath ="";


  constructor( private route: ActivatedRoute,
               private navigation: NavtntService,  
               private appTraineeMapService: ApptraineemapService,
               private readinessQuestionService: ReadinessQuestionService,
               private userAccessProfileService: UserAccessProfileService ) {}

  ngOnInit() {
          this.route.queryParams.subscribe((p: any) => {    
                  if (p.filter){
                          //this.transition_id = this.navigation.getParameterValue(p.filter, 'transition_id');
                          this.transition_id = this.userAccessProfileService.getCurrentTransitionID();
                          this.appIds = this.navigation.getParameterValue(p.filter, 'appIds')
                          this.appId = this.navigation.getParameterValue(p.filter, 'appId')
                          this.traineeIds = this.navigation.getParameterValue(p.filter, 'traineeIds')   
                          this.traineeId = this.navigation.getParameterValue(p.filter, 'traineeId') 
                          this.appTraineeMapId = this.navigation.getParameterValue(p.filter, 'appTraineeMapId')                                                                
                          this.deleteAppTraineeMap();
                  }
          });
          
  }




  deleteAppTraineeMap(){

        //alert("this.returnPath "+this.returnPath);
        this.appTraineeMapService.deleteAppTraineeMap(this.appTraineeMapId  ).subscribe((applications:any[]) => {                     
                  console.log("##################################################################################################");
                  var sourceComponentPath = '/transition-Main/app-trainee-map-delete';
                  var destinationComponentPath = '/transition-Main/app-trainee-map-edit';
                  var destinationComponentParameterArray = 
                  [{ id: 'appIds', param: this.appIds },
                  { id: 'traineeIds', param: this.traineeIds },
                  { id: 'appTraineeMapId', param: this.appTraineeMapId } ] 
                  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) ;           
        });  
  }

}


