import { Component, OnInit } from '@angular/core';
import { Role } from 'Vo/role';
import { RoleService } from 'Services/role.service';
import { Country } from 'Vo/country';
import { UtilityService } from 'Services/utility.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';




@Component({
  selector: 'app-role-edit',
  templateUrl: './role-edit.component.html',
  styleUrls: ['./role-edit.component.css']
})
export class RoleEditComponent implements OnInit {


  title = 'Admin';

  tran_id:string="-1";

  countries: Country[] = [];
  roles: Role[] = [];
  
  roleId:string='';

  roleEditForm: FormGroup;
  role: Role = {
    roleId:'',
    roleName:'',
    roleDescription:''
  }


  constructor(private nav:NavtntService, fb: FormBuilder,private dataandparamService: DataandparamService, private roleService: RoleService,private utilityService: UtilityService, private router: Router, private route: ActivatedRoute) {
    this.roleEditForm = fb.group({
      roleName:[''],
      roleRouterLink:[''],
      roleDescription:[''],
    });
  }

  ngOnInit() {


    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.roleId = this.nav.getParameterValue(p.filter, 'roleId')                
          this.getRoleData(this.roleId);
      }
    });

   /*
    this.route.queryParams
    .filter(params => params.roleId)
    .subscribe(params => {
      console.log(params); //

      this.roleId = params.roleId;
      
    });
    //this.roleId = this.dataandparamService.getRoleId();
    //this.roleId = this.route.snapshot.paramMap.get('id');   
    this.getRoleData(this.roleId);
    */
  }


  
  onSubmit() {

    this.role.roleName = this.roleEditForm.controls['roleName'].value;
    this.role.roleDescription = this.roleEditForm.controls['roleDescription'].value;    
 
    if (this.role.roleName.trim() =='' || this.role.roleDescription.trim()==''){
      alert("Manadtory fields must not be empty!");
 
     }else{
           this.updateRole();  
     }  

  }

  updateRole(){
    
    let roleParameter = 
    '{ "ROLE_NAME": "'+ this.role.roleName+ '",  "ROLE_DESCRIPTION": "'+ this.role.roleDescription +'"}';

    console.log("Update "+roleParameter);

    this.roleService.updateRole(this.roleId, roleParameter ).subscribe((applications:any[]) => {
                     
      console.log("###########################################");
      console.log(roleParameter);
      this.router.navigate(['/admin-home/role-list']);


      var sourceComponentPath = '/admin-home/role-edit';
      var destinationComponentPath = '/admin-home/role-list';
      var destinationComponentParameterArray = [] ;   
      this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        


    });    
  }  

  getRoleData(role_id){

    console.log(  "getRoleData()"); 

    this.roleService.getRoleData(role_id).subscribe((roles:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("roles.length "+roles.length); 

     
                    
      for(var i=0; i<roles.length; i++) {

          console.log("Value of i"+i);

          let role: Role = { 
            roleId:'',  
            roleName:'',      
            roleDescription:''
          }
           
    
          role.roleId = roles[0].ROLE_ID;          
          role.roleName = roles[0].ROLE_NAME;
          role.roleDescription = roles[0].ROLE_DESCRIPTION;
          

           this.roles.push(role);
      }
       
      this.role = this.roles.pop();

       this.roleEditForm.controls['roleName'].setValue(this.role.roleName);
       this.roleEditForm.controls['roleDescription'].setValue(this.role.roleDescription);  

    });    
  }  

  cancel(){
    var sourceComponentPath = '/admin-home/role-edit';
    var destinationComponentPath = '/admin-home/role-list';
    var destinationComponentParameterArray = [] ;   
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)            
  }

}
