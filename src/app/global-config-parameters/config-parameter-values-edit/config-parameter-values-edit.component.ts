import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { Role } from 'Vo/role';
import { RoleService } from 'Services/role.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import { Router, ActivatedRoute} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { ConfigParameterService } from 'Services/configparameter.service';


@Component({
  selector: 'app-config-parameter-values-edit',
  templateUrl: './config-parameter-values-edit.component.html',
  styleUrls: ['./config-parameter-values-edit.component.css']
})
export class ConfigParameterValuesEditComponent implements OnInit {

  title = 'Admin';
  

  configParameterValuesEditForm: FormGroup;

  configParameterId=""
  configParameterName=""
  configParameterValue=""
  newCategory = true;  


  constructor(private navigation: NavtntService, fb: FormBuilder,private configParameterService: ConfigParameterService,private utilityService: UtilityService, private route: ActivatedRoute) {
    this.configParameterValuesEditForm = fb.group({
      configParameterName:[''],      
      configParameterValue:[''],
    });
  }

  ngOnInit() {

   
      this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){
            this.configParameterName = this.navigation.getParameterValue(p.filter, 'configParameterName')  
            this.configParameterId = this.navigation.getParameterValue(p.filter, 'configParameterId')
            this.configParameterValue = this.navigation.getParameterValue(p.filter, 'configParameterValue')            
            this.configParameterValuesEditForm.controls['configParameterValue'].setValue(this.configParameterValue);                                              
        }
      });
  }


  
  onSubmit() {
   
        
    this.configParameterValue = this.configParameterValuesEditForm.controls['configParameterValue'].value;

    if (this.configParameterValue.trim()==''){
          alert("Empty value or blank spaces not allowed!");

    }else{
          this.updateConfigParameterValue();
    }
 
  }

  updateConfigParameterValue(){

    let configParameter = 
    '{ "FieldCategoryName": "'+ this.configParameterName+ '",  "Categoryvalues": "'+ this.configParameterValue+ '"}';

    this.configParameterService.updateConfigParameterValue(this.configParameterId, configParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

      var sourceComponentPath = '/admin-home/config-parameter-values-edit';
      var destinationComponentPath = '/admin-home/config-parameter-values';
      var destinationComponentParameterArray = [{ id: 'parameter', param: this.configParameterName } ] ;   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        

    });

    
  }

  cancel(){
      var sourceComponentPath = '/admin-home/config-parameter-values-edit';
      var destinationComponentPath = '/admin-home/config-parameter-values';
      var destinationComponentParameterArray = [{ id: 'parameter', param: this.configParameterName } ] ;            
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

}
