import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { UserRole } from 'Vo/userRole';
import { UserRoleService } from 'Services/userRole.service';
import { MatTableDataSource } from '@angular/material';
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-user-role-add',
  templateUrl: './user-role-add.component.html',
  styleUrls: ['./user-role-add.component.css']
})
export class UserRoleAddComponent implements OnInit {

  
  userId:string="-1";
  userName:string='';
  userRoleAddForm: FormGroup;
  roles: any[]=[];
  selected:any;


  userRole: UserRole = {
    roleId:'',
    userRoleId:'',
    roleName:'',
    roleDescription:''
  }

  userRoleAdds: UserRole[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'userRoleName', 'userRoleDescription', 'userRoleId'];

  constructor(private nav:NavtntService, fbuilder: FormBuilder, private userRoleService: UserRoleService,  private router: Router, private route: ActivatedRoute) { 


    //const controls = this.functionalities.map(c => new FormControl(true)
    
    this.userRoleAddForm = fbuilder.group({
 
      //functionalities: fb.array([fb.group({'X':''})])

      roles: fbuilder.array([
        fbuilder.array([])
     ])
    })
  }

  ngOnInit() {

 
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.userId = this.nav.getParameterValue(p.filter, 'userId')       
          this.userName = this.nav.getParameterValue(p.filter, 'userName')          
          this.getAssignedAndNotAssignedUserRoleList(this.userId);
      }
    });


    /*
    
    this.route.queryParams
    .filter(params => params.userId)
    .subscribe(params => {
      console.log(params); //

      this.userId = params.userId;
      //this.getUserData(this.userId);
      this.getAssignedAndNotAssignedUserRoleList(this.userId);
      
    });

    */
    

      //functionalities: fb.array([fb.group({})])
    

    //this.userRoleAddForm.setControl('functionalities', fb.array([]))
  
    //this.userId = this.route.snapshot.paramMap.get('id');   
    
    
  }


  
  getAssignedAndNotAssignedUserRoleList(userId){

    console.log(  "getUserRoleAddList()");
    this.userRoleService.getAssignedAndNotAssignedUserRoleList(userId).subscribe((userRoleAdds:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("clients.length "+userRoleAdds.length); 

      var userRoleAdds_tmp: UserRole[];

      if (userRoleAdds.length>0){
        // Clears old data
        this.userRoleAdds = [];
      }
                    
      for(var i=0; i<userRoleAdds.length; i++) {

          console.log("Value of i"+i);


          let userRole: UserRole = {
            roleId:'',
            userRoleId:'',
            roleName:'',
            roleDescription:''           
          }
           
       
          userRole.roleId = userRoleAdds[i].ROLE_ID;  
          userRole.userRoleId = userRoleAdds[i].USER_ROLE_ID;          
          userRole.roleName = userRoleAdds[i].ROLE_NAME;
          userRole.roleDescription = userRoleAdds[i].ROLE_DESCRIPTION;

           this.userRoleAdds.push(userRole);
           //this.functionalities.push(userRole.userRoleId);
      }

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.userRoleAdds);
      
           //this.clients = clients1;
    });    
  }





addRoles() {

     
      var X='';
      for(var i=0; i<this.roles.length; i++) {

        if (i>0){
          X = X +',';
        }  
        X = X + this.roles[i];
}

let rolesParameter = '{"roles":"'+X+'"}'
    
    //alert("this.userId  "+this.userId);
    this.userRoleService.addRoles(rolesParameter, this.userId ).subscribe((applications:any[]) => {                     
      console.log("##################################################################################################");
      //this.router.navigate(['/admin-home/','user-role-list/'+this.userId]);
      //this.router.navigate(["/admin-home/user-role-list"],{queryParams:{userId:this.userId}})
      var sourceComponentPath = '/admin-home/user-role-add';
      var destinationComponentPath = '/admin-home/user-role-list';
      var destinationComponentParameterArray = [{ id: 'userId', param: this.userId }, { id: 'userName', param: this.userName } ] 
      this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
    });
    
    
  }

  gotoUserRoleAdd() {
       
    this.router.navigate(['controller-tnt', 'role-functionality-add/'+this.userId]);
    var sourceComponentPath = '/admin-home/user-role-add';
    var destinationComponentPath = '/admin-home/role-functionality-add';
    var destinationComponentParameterArray = [{ id: 'userId', param: this.userId } ] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        

  }


  onChange(event) {

    const roles = this.userRoleAddForm.get('roles') as FormArray;

    if(event.checked) {
      roles.push(new FormControl(event.source.value))
      this.roles.push(event.source.value)
    } else {
      const i = roles.controls.findIndex(x => x.value === event.source.value);
      roles.removeAt(i);
      this.roles.splice(i-1,1);
    }
  }

}
