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
  selector: 'app-config-parameter-values-add',
  templateUrl: './config-parameter-values-add.component.html',
  styleUrls: ['./config-parameter-values-add.component.css']
})
export class ConfigParameterValuesAddComponent implements OnInit {

  title = 'Admin';
  

  configParameterValuesAddForm: FormGroup;

  configParameterId=""
  configParameterName=""
  configParameterValue=""
  newCategory = true;  
  operationType = "";


  constructor(private navigation: NavtntService, fb: FormBuilder,private configParameterService: ConfigParameterService,private utilityService: UtilityService, private route: ActivatedRoute) {
    this.configParameterValuesAddForm = fb.group({
      configParameterName:[''],      
      configParameterValue:[''],
    });
  }

  ngOnInit() {
      this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){
            this.configParameterName = this.navigation.getParameterValue(p.filter, 'parameter')  
            this.operationType = this.navigation.getParameterValue(p.filter, 'operationType')  
            if  (this.operationType =='add_value'){
                this.configParameterValuesAddForm.controls['configParameterName'].setValue(this.configParameterName);                  
                this.configParameterValuesAddForm.controls['configParameterName'].disable();
                this.newCategory = false;
            }
        }
      });
  }


  
  onSubmit() {
  
    if (this.newCategory){
        this.configParameterName = this.configParameterValuesAddForm.controls['configParameterName'].value;
    }    
        
    this.configParameterValue = this.configParameterValuesAddForm.controls['configParameterValue'].value;

    if (this.configParameterName.trim() =='' || this.configParameterValue.trim()==''){
          alert("Manadtory fields must not be empty!");

    }else{
          this.createConfigParameterValues();
    }
 
    
    
  }

  createConfigParameterValues(){


    var query ="";
    if (this.newCategory){
        query = "select * from adminprofile where FieldCategoryName='"+this.configParameterName+"'  ";
    }else{
        query = "select * from adminprofile where FieldCategoryName='"+this.configParameterName+"'  AND Categoryvalues='"+this.configParameterValue+"' ";
    }


    this.utilityService.getRecords(query).subscribe((tmp_records:any[]) => {        

        if (tmp_records.length == 0){
              let configParameter = 
              '{ "FieldCategoryName": "'+ this.configParameterName+ '",  "Categoryvalues": "'+ this.configParameterValue+ '"}';
          
                  this.configParameterService.createConfigParameterValues(configParameter ).subscribe((applications:any[]) => {                     
                    console.log("##################################################################################################");
          
                    var sourceComponentPath = '/admin-home/config-parameter-values-add';
                    var destinationComponentPath = '/admin-home/config-parameter-values';
                    var destinationComponentParameterArray = [{ id: 'parameter', param: this.configParameterName } ] ;   
                    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
          
              });         
        }else{
            alert(" Duplicate value can't be inserted ");
        } 

    });
    
  }

  cancel(){
      var sourceComponentPath = '/admin-home/config-parameter-values-add';
      var destinationComponentPath = '/admin-home/config-parameter-values';
      var destinationComponentParameterArray = [] ;   

      if (this.operationType == 'new_param')
            destinationComponentPath = '/admin-home/config-parameter-list';
      else {
            destinationComponentPath = '/admin-home/config-parameter-values';
            destinationComponentParameterArray = [{ id: 'parameter', param: this.configParameterName } ] ;   
      }     
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

}
