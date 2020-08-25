import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { ParameterService } from 'Services/parameter.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-parameter-custom-adopt',
  templateUrl: './parameter-custom-adopt.component.html',
  styleUrls: ['./parameter-custom-adopt.component.css']
})
export class ParameterCustomAdoptComponent implements OnInit {


  globalParameterList:string='';
  transitionId:string="";

  constructor(private navigation: NavtntService, private route: ActivatedRoute, private userAccessProfileService: UserAccessProfileService,  private parameterService: ParameterService ) { }

  ngOnInit() {

    this.transitionId = this.userAccessProfileService.getCurrentTransitionID();
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){

          this.globalParameterList = this.navigation.getParameterValue(p.filter, 'globalParameterList');  
          
          //alert(" this.globalParameterList in adopt "+this.globalParameterList);
          console.log(" this.globalParameterList in adopt "+this.globalParameterList);
 
          this.parameterService.createParameterCustom('{"globalParameterList":'+this.globalParameterList+'}', this.transitionId ).subscribe((applications:any[]) => {                     
                console.log("##################################################################################################");
                var sourceComponentPath = '/transition-Main/parameter-custom-adopt';
                var destinationComponentPath = '/transition-Main/parameter-custom-list';
                var destinationComponentParameterArray = []                   
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
          });   
         
      }
    });

    
          
  }




}
