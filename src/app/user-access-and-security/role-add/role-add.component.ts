import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material';
import { Role } from 'Vo/role';
import { RoleService } from 'Services/role.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import { Router} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';


@Component({
  selector: 'app-role-add',
  templateUrl: './role-add.component.html',
  styleUrls: ['./role-add.component.css']
})
export class RoleAddComponent implements OnInit {

  title = 'Admin';
  

  roleAddForm: FormGroup;
  role: Role = {
    roleId:'',
    roleName:'',
    roleDescription:''
  }


  constructor(private navigation: NavtntService, fb: FormBuilder,private roleService: RoleService,private utilityService: UtilityService, private router: Router) {
    this.roleAddForm = fb.group({
      roleName:[''],      
      roleDescription:[''],
    });
  }

  ngOnInit() {
  }


  
  onSubmit() {

    console.log("Create Button Clicked")
    // TODO: Use EventEmitter with form value

    this.role.roleName = this.roleAddForm.controls['roleName'].value;
    this.role.roleDescription = this.roleAddForm.controls['roleDescription'].value;

    if (this.role.roleName.trim() =='' || this.role.roleDescription.trim()==''){
     alert("Manadtory fields must not be empty!");

    }else{
      this.createRole();
    }
 
    
    
  }

  createRole(){


    
    let roleParameter = 
    '{ "ROLE_NAME": "'+ this.role.roleName+ '",  "ROLE_DESCRIPTION": "'+ this.role.roleDescription+ '"}';

    this.roleService.createRole(roleParameter ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");
      //this.router.navigate(['/admin-home/role-list']);


      var sourceComponentPath = '/admin-home/role-add';
      var destinationComponentPath = '/admin-home/role-list';
      var destinationComponentParameterArray = [] ;   
      this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        

    });

    
  }

  cancel(){
    var sourceComponentPath = '/admin-home/role-add';
    var destinationComponentPath = '/admin-home/role-list';
    var destinationComponentParameterArray = [] ;   
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        

  }

}
