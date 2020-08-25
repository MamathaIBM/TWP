import { Component, OnInit } from '@angular/core';
import { User } from 'Vo/user';
import { UserService } from 'Services/user.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder, Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';
import { SessionStorageService } from 'angular-web-storage';



@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {

  dropdownList = [];
  selectedItems:Keyvalue[] = [];
  dropdownSettings = {};


  title = "";
  tran_id:string="-1";

  countries: Country[] = [];
  users: User[] = [];
  orgs: Keyvalue[] = [];
  userId:string='';
  

  userEditForm: FormGroup;
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
              private route: ActivatedRoute,
              public session: SessionStorageService) {

    this.userEditForm = fb.group({
      userName:[''],
      userEmail:[''],
      userCountry:[''],
      userOrg:[''],
      userCity:[''],
      userComments:[]
    });
  }

  ngOnInit() {

    this.countries = this.utilityService.getCountryList();
    this.orgs = this.utilityService.getTransitionOrgList(this.orgs);
    //this.orgs =  this.utilityService.getTransitionOrgListMultiple();

   



    /*
    this.selectedItems = [
      { item_id: 'IMT Germany', item_text: 'IMT Germany' },
      { item_id: 'Korea', item_text: 'Korea' }
    ];

    */


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'item_id',
      textField: 'item_text',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: false
    };
  
    //this.userId = this.route.snapshot.paramMap.get('id');


    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.userId = this.nav.getParameterValue(p.filter, 'userId')                
          this.getUserData(this.userId);    
          this.getUserTransitionOrgs(this.userId); 
      }
    });


    /*
    this.route.queryParams
    .filter(params => params.userId)
    .subscribe(params => {
      console.log(params); //

      this.userId = params.userId;
      this.getUserData(this.userId);
      
    });
    */
   
  }


  
  onSubmit() {

      this.user.userName = this.userEditForm.controls['userName'].value;
      this.user.userEmail = this.userEditForm.controls['userEmail'].value;
      this.user.userCountry = this.userEditForm.controls['userCountry'].value;
      this.user.userOrg = this.userEditForm.controls['userOrg'].value;
      this.user.userCity = this.userEditForm.controls['userCity'].value;
      this.user.userComments = this.userEditForm.controls['userComments'].value;
    
 
        
      if (this.user.userName.trim() =='' || this.user.userEmail.trim() ==''){
         
          alert("Manadaory fields must not be empty!");
       }else{
            this.updateUser();  
       }
  }

  updateUser(){

    
    let userParameter = 
    '{ "USER_NAME": "'+ this.user.userName.trim()+ '","USER_EMAIL":"'+ this.user.userEmail.trim()+'", '+
    '  "USER_COUNTRY": "'+ this.user.userCountry+ '","USER_ORG":"'+ this.user.userOrg+'", '+    
    '  "USER_CITY_LOCATION": "'+ this.user.userCity+ '",  "USER_COMMENTS": "'+ this.user.userComments.trim() +'"}';


   //alert("userParameter"+userParameter);

    
    this.userService.updateUser(this.userId, userParameter ).subscribe((applications:any[]) => {
                     
      console.log("##################################################################################################");
      //this.router.navigate(['/admin-home/user-list']);

      var sourceComponentPath = '/admin-home/user-edit';
      var destinationComponentPath = '/admin-home/user-list';
      var destinationComponentParameterArray = [] 
      this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)              
    });    

    
  }  

  getUserData(user_id){

    console.log(  "getUserData()"); 

    this.userService.getUserData(user_id).subscribe((users:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("clients.length "+users.length); 

     
                    
      for(var i=0; i<users.length; i++) {

          console.log("Value of i"+i);


          let user: User = {
            userId:'',          
            userName:'',
            userEmail:'',                      
            userCountry:'',
            userOrg:'',
            userCity:'',
            userComments:'',
          }
           

          user.userId = users[i].USER_ID;      
          user.userName = users[i].USER_NAME;
          user.userEmail = users[i].USER_EMAIL;
          user.userCountry = users[i].USER_COUNTRY;
            

          user.userOrg = users[i].USER_TRANSITION_ORG;
          this.userEditForm.controls['userOrg'].setValue(user.userOrg.split(','));

          console.log("Multi value selct "+user.userOrg.split(','));
          user.userCity = users[i].USER_CITY_LOCATION;
         
          user.userComments = users[i].USER_COMMENTS;
          

           this.users.push(user);
      }
       
      this.user = this.users.pop();

  
      this.userEditForm.controls['userName'].setValue(this.user.userName);
      this.userEditForm.controls['userEmail'].setValue(this.user.userEmail);
      this.userEditForm.controls['userCountry'].setValue(this.user.userCountry);
      this.userEditForm.controls['userOrg'].setValue(this.user.userOrg.split(','));

      this.userEditForm.controls['userCity'].setValue(this.user.userCity);
      this.userEditForm.controls['userComments'].setValue(this.user.userComments);

    });    
  }  





  
  getUserTransitionOrgs(user_id){
      console.log(  "getUserData()"); 
      this.userService.getUserTransitionOrgs(user_id).subscribe((orgs:any[]) => {  

                   
         for(var i=0; i<orgs.length; i++){
            //this.selectedItems.push({item_id:orgs[i].OWNING_TTS_ORG, item_text:orgs[i].OWNING_TTS_ORG })   
            this.selectedItems.push({id:orgs[i].OWNING_TTS_ORG, param:orgs[i].OWNING_TTS_ORG})                 
         }

      });    
  }


  onCancel(){
    var sourceComponentPath = '/admin-home/user-edit';
    var destinationComponentPath = '/admin-home/user-list';
    var destinationComponentParameterArray = [] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)   
  }



}
