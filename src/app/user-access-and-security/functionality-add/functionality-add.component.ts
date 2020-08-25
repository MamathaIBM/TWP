import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { Functionality } from 'Vo/functionality';
import { FunctionalityService } from 'Services/functionality.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';
import { NavtntService } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';


@Component({
  selector: 'app-functionality-add',
  templateUrl: './functionality-add.component.html',
  styleUrls: ['./functionality-add.component.css']
})
export class FunctionalityAddComponent implements OnInit {

  operationTypes: Keyvalue[] = [];
  defaults: Keyvalue[] = [];
  functionalities: Keyvalue[] = [];

  functionalityId:string='';
  functionalitys: Functionality[] = [];
  functionalityAddForm: FormGroup;
  functionality: Functionality = {
        functionalityId:'',
        functionalityName:'',
        functionalityRouterLink:'',
        functionalityDescription:'',
        functionalityOperationType:'',
        functionalityTransitionDependency:'',
        functionalityModule:'',
        functionalityDefault:'',
        functionalityUOI:''    
  }

  getReadWrite

  constructor(private navigation: NavtntService, 
              private utility: UtilityService,
             fb: FormBuilder,private dataandparamService: DataandparamService, private functionalityService: FunctionalityService,private utilityService: UtilityService, private router: Router, private route: ActivatedRoute) {
    this.functionalityAddForm = fb.group({
      functionalityName:[''],
      functionalityRouterLink:[''],
      functionalityDescription:[''],
      functionalityModule:[''],
      functionalityOperationType:[''],
      functionalityTransitionDependency:[''],
      functionalityDefault:[''],
      functionalityUOI:['']                          
    });
  }

  ngOnInit() {

    this.operationTypes = this.utility.getReadWrite();
    this.functionalities = this.utility.getYN();
    this.defaults = this.utility.getYN();

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.functionalityId = this.navigation.getParameterValue(p.filter, 'functionalityId')
          if (this.functionalityId !=='NEW'){            
            this.getFunctionalityData(this.functionalityId);
          }          
      }
    });

  }


  
  onSubmit() {

    this.functionality.functionalityName = this.functionalityAddForm.controls['functionalityName'].value;
    this.functionality.functionalityRouterLink = this.functionalityAddForm.controls['functionalityRouterLink'].value;
    this.functionality.functionalityUOI = this.functionalityAddForm.controls['functionalityUOI'].value;
    this.functionality.functionalityDefault = this.functionalityAddForm.controls['functionalityDefault'].value;
    this.functionality.functionalityOperationType = this.functionalityAddForm.controls['functionalityOperationType'].value;
    this.functionality.functionalityTransitionDependency = this.functionalityAddForm.controls['functionalityTransitionDependency'].value;
    this.functionality.functionalityModule = this.functionalityAddForm.controls['functionalityModule'].value;
    this.functionality.functionalityDescription = this.functionalityAddForm.controls['functionalityDescription'].value;

     if (this.functionality.functionalityName.trim() == '' || this.functionality.functionalityRouterLink.trim() =='' || this.functionality.functionalityDefault.trim() == '' || this.functionality.functionalityTransitionDependency.trim()=='' || this.functionality.functionalityOperationType.trim()=='' ){
        alert("Mandatory fields must not be empty!");

     }else{
           this.createFunctionality();
     }
 
      
    
  }

  cancel() {

    var sourceComponentPath = '/admin-home/functionality-add';
    var destinationComponentPath = '/admin-home/functionality-list';
    var destinationComponentParameterArray = []     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
    
  }




  createFunctionality(){



    let functionalityParameter = 
    '{ "FUNC_NAME": "'+ this.functionality.functionalityName+ '","FUNC_ROUTERLINK":"'+ this.functionality.functionalityRouterLink+'", '+
    '  "FUNC_DESCRIPTION": "'+ this.functionality.functionalityDescription+ '","FUNC_OPERATION_TYPE": "'+ this.functionality.functionalityOperationType + '", '+
    '  "FUNC_UOI": "'+ this.functionality.functionalityUOI+ '","FUNC_DEFAULT": "'+ this.functionality.functionalityDefault +     
    '","FUNC_TRANSITION_DEPENDENCY": "'+ this.functionality.functionalityTransitionDependency+ '","FUNC_MODULE": "'+ this.functionality.functionalityModule+ '"}';

    this.functionalityService.createFunctionality(functionalityParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");

      var sourceComponentPath = '/admin-home/functionality-add';
      var destinationComponentPath = '/admin-home/functionality-list';
      var destinationComponentParameterArray = []     
    
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
      //this.router.navigate(['/admin-home/functionality-list']);
    });

    
  }

  getFunctionalityData(functionality_id){

    console.log(  "getFunctionalityData()"); 

    this.functionalityService.getFunctionalityData(functionality_id).subscribe((functionalitys:any[]) => {
                     
      console.log("##################################################################################################");

    

                     
      for(var i=0; i<functionalitys.length; i++) {

          console.log("Value of i"+i);

          let functionality: Functionality = { 
            functionalityId:'',
            functionalityName:'',
            functionalityRouterLink:'',
            functionalityDescription:'',
            functionalityOperationType:'',
            functionalityTransitionDependency:'',
            functionalityModule:'',
            functionalityDefault:'',
            functionalityUOI:''               
          }
           
    
          functionality.functionalityId = functionalitys[i].FUNCTIONALITY_ID;          
          functionality.functionalityName = functionalitys[i].FUNC_NAME;
          functionality.functionalityRouterLink = functionalitys[i].FUNC_ROUTERLINK;
          functionality.functionalityDescription = functionalitys[i].FUNC_DESCRIPTION;
          functionality.functionalityOperationType = functionalitys[i].FUNC_OPERATION_TYPE;
          functionality.functionalityTransitionDependency = functionalitys[i].FUNC_TRANSITION_DEPENDENCY;
          functionality.functionalityModule = functionalitys[i].FUNC_MODULE ;  
          functionality.functionalityDefault = functionalitys[i].FUNC_DEFAULT;
          functionality.functionalityUOI = functionalitys[i].FUNC_UOI ;            

           this.functionalitys.push(functionality);
      }
       
      this.functionality = this.functionalitys.pop();

    });      

  }
}
