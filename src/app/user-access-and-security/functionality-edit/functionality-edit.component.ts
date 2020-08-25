import { Component, OnInit } from '@angular/core';
import { Functionality } from 'Vo/functionality';
import { FunctionalityService } from 'Services/functionality.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import 'rxjs/add/operator/filter';
import { NavtntService } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';



@Component({
  selector: 'app-functionality-edit',
  templateUrl: './functionality-edit.component.html',
  styleUrls: ['./functionality-edit.component.css'],
  
})
export class FunctionalityEditComponent implements OnInit {


  tran_id:string="-1";

  countries: Country[] = [];
  functionalitys: Functionality[] = [];
  operationTypes: Keyvalue[] = [];
  defaults: Keyvalue[] = [];
  functionalities: Keyvalue[] = [];
  
  functionalityId:string='';

  functionalityEditForm: FormGroup;
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


  constructor(private navigation: NavtntService, 
              private utility: UtilityService,
             fb: FormBuilder,private dataandparamService: DataandparamService, private functionalityService: FunctionalityService,private utilityService: UtilityService, private router: Router, private route: ActivatedRoute) {
    this.functionalityEditForm = fb.group({
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

    /*
    this.route.queryParams
    .filter(params => params.functionalityId)
    .subscribe(params => {
      console.log(params); //

      this.functionalityId = params.functionalityId;

      //alert()
      
    });

    */

    //alert("Functionality Alert Called...");
    this.operationTypes = this.utility.getReadWrite();
    this.functionalities = this.utility.getYN();
    this.defaults = this.utility.getYN();

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.functionalityId = this.navigation.getParameterValue(p.filter, 'functionalityId')
          this.getFunctionalityData(this.functionalityId);
      }
    });

  }




  
  onSubmit() {

    this.functionality.functionalityName = this.functionalityEditForm.controls['functionalityName'].value;
    this.functionality.functionalityRouterLink = this.functionalityEditForm.controls['functionalityRouterLink'].value;
    this.functionality.functionalityDescription = this.functionalityEditForm.controls['functionalityDescription'].value;
    this.functionality.functionalityOperationType = this.functionalityEditForm.controls['functionalityOperationType'].value;
    this.functionality.functionalityDefault = this.functionalityEditForm.controls['functionalityDefault'].value;
    this.functionality.functionalityUOI = this.functionalityEditForm.controls['functionalityUOI'].value;
    this.functionality.functionalityTransitionDependency = this.functionalityEditForm.controls['functionalityTransitionDependency'].value;
    this.functionality.functionalityModule = this.functionalityEditForm.controls['functionalityModule'].value;


    if (this.functionality.functionalityName.trim() == '' || this.functionality.functionalityRouterLink.trim() =='' || this.functionality.functionalityDefault.trim() == '' || this.functionality.functionalityTransitionDependency.trim()=='' || this.functionality.functionalityOperationType.trim()=='' ){
      alert("Mandatory fields must not be empty!");

   }else{
         this.updateFunctionality();
   }

  }

  updateFunctionality(){
    
    let functionalityParameter = 
    '{ "FUNC_NAME": "'+ this.functionality.functionalityName+ '","FUNC_ROUTERLINK":"'+ this.functionality.functionalityRouterLink+'", '+
    '  "FUNC_DESCRIPTION": "'+ this.functionality.functionalityDescription+ '","FUNC_OPERATION_TYPE": "'+ this.functionality.functionalityOperationType + '", '+
    '  "FUNC_DEFAULT": "'+ this.functionality.functionalityDefault+ '","FUNC_UOI": "'+ this.functionality.functionalityUOI +     
    '","FUNC_TRANSITION_DEPENDENCY": "'+ this.functionality.functionalityTransitionDependency+ '","FUNC_MODULE": "'+ this.functionality.functionalityModule+ '"}';

    console.log("Update "+functionalityParameter);

    this.functionalityService.updateFunctionality(this.functionalityId, functionalityParameter ).subscribe((applications:any[]) => {
                     
      //console.log("###########################################");
      //console.log(functionalityParameter);
      //this.router.navigate(['/admin-home/functionality-list']);


      var sourceComponentPath = '/admin-home/functionality-edit';
      var destinationComponentPath = '/admin-home/functionality-list';
      var destinationComponentParameterArray = []     
    
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    


    });    
  }  

  getFunctionalityData(functionality_id){

    console.log(  "getFunctionalityData()"); 

    this.functionalityService.getFunctionalityData(functionality_id).subscribe((functionalitys:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("functionalitys.length "+functionalitys.length); 

     
                    
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
            functionalityUOI:'',
            functionalityDefault:''               
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

      this.functionalityEditForm.controls['functionalityName'].setValue(this.functionality.functionalityName);
      this.functionalityEditForm.controls['functionalityRouterLink'].setValue(this.functionality.functionalityRouterLink);
      this.functionalityEditForm.controls['functionalityDescription'].setValue(this.functionality.functionalityDescription);
      this.functionalityEditForm.controls['functionalityOperationType'].setValue(this.functionality.functionalityOperationType);
      this.functionalityEditForm.controls['functionalityTransitionDependency'].setValue(this.functionality.functionalityTransitionDependency);
      this.functionalityEditForm.controls['functionalityModule'].setValue(this.functionality.functionalityModule);
      this.functionalityEditForm.controls['functionalityDefault'].setValue(this.functionality.functionalityDefault);
      this.functionalityEditForm.controls['functionalityUOI'].setValue(this.functionality.functionalityUOI);

    });    
  }  

  cancel(){
        var sourceComponentPath = '/admin-home/functionality-edit';
        var destinationComponentPath = '/admin-home/functionality-list';
        var destinationComponentParameterArray = []     
        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }


}
