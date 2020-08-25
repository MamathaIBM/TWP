import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { User } from 'Vo/user';
import { UserService } from 'Services/user.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import {Router} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';
import { Alert } from 'selenium-webdriver';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.css']
})
export class UserAddComponent implements OnInit {

  dropdownList = [];
  selectedItems = [];
  dropdownSettings = {};
  title="";

  countries: Country[] = [];
  orgs: Keyvalue[] = [];

  userAddForm: FormGroup;
  user: User = {
    userId:'',    
    userName:'',
    userEmail:'',
    userCountry:'',
    userOrg:'',
    userCity:'',
    userComments:'',
  }


  constructor(private nav:NavtntService, 
              fb: FormBuilder,
              private dataandparamService: DataandparamService, 
              private userService: UserService,
              private utilityService: UtilityService, 
              private router: Router,
              public session: SessionStorageService) {
    this.userAddForm = fb.group({
      userName:[''],
      userEmail:[''],
      userCountry:[''],
      userOrg:[''],
      userCity:[''],
      userComments:[]
    });
  }

  ngOnInit() {  
    //this.countries = this.utilityService.getCountryList();
    this.countries = this.utilityService.getCountryList();
    this.orgs = this.utilityService.getTransitionOrgList(this.orgs);
    //this.orgs = this.utilityService.getTransitionOrgList(this.orgs);
    //this.getDropdownValues('OwningTTS');
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 100,
      allowSearchFilter: false
    };
  }


  
  onSubmit() {

    this.user.userName = this.userAddForm.controls['userName'].value;
    this.user.userEmail = this.userAddForm.controls['userEmail'].value;
    this.user.userCountry = this.userAddForm.controls['userCountry'].value;
    this.user.userOrg = this.userAddForm.controls['userOrg'].value;
    this.user.userCity = this.userAddForm.controls['userCity'].value;
    this.user.userComments = this.userAddForm.controls['userComments'].value;

      if (this.user.userName.trim() == '' || this.user.userEmail.trim() ==''){
         
            alert("Manadaory fields must not be empty!");
      }else{
            this.addUser();
      }
 
      
    
  }

  addUser(){

    let userParameter = 
    '{ "USER_NAME": "'+ this.user.userName.trim()+ '","USER_EMAIL":"'+ this.user.userEmail.trim()+'", '+    
    '  "USER_COUNTRY": "'+ this.user.userCountry+ '","USER_ORG":"'+ this.user.userOrg+'", '+    
    '  "USER_CITY_LOCATION": "'+ this.user.userCity.trim()+ '",  "USER_COMMENTS": "'+ this.user.userComments.trim() +'"}';
      
    //alert("userParameter "+userParameter);

    this.userService.createUser(userParameter ).subscribe((applications:any[]) => {
                     
      console.log("##################################################################################################");
      //this.router.navigate(['/admin-home/user-list']);
      var sourceComponentPath = '/admin-home/user-add';
      var destinationComponentPath = '/admin-home/user-list';
      var destinationComponentParameterArray = [] 
      this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
    });
  }

  cancel(){
    var sourceComponentPath = '/admin-home/user-add';
    var destinationComponentPath = '/admin-home/user-list';
    var destinationComponentParameterArray = [] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
  }

  getDropdownValues(dropDownKey){

    var query = "select Categoryvalues from adminprofile where FieldCategoryName='"+dropDownKey+"'";
    //this.orgs  = this.session.get('ADMIN_'+dropDownKey);
    if (this.session.get('ADMIN_'+dropDownKey) == null){                 
         this.utilityService.getRecords(query).subscribe((records:any[]) => {        
                 for(var i=0; i<records.length; i++) {

                         let keyValue: Keyvalue = {
                             id:'',
                             param:''
                         }  

                         keyValue.id = records[i].Categoryvalues;
                         keyValue.param = records[i].Categoryvalues;
                         this.orgs.push(keyValue);
                 }  
                 
                 //put it in the session
                 this.session.set('ADMIN_'+dropDownKey, this.orgs);    // to avoid conflict with other session variable   
         });         
    }    
}

}
