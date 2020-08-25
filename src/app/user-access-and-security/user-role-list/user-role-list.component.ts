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
  selector: 'app-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.css']
})
export class UserRoleListComponent implements OnInit {

  userId:string="-1";
  userName:string='';
  userRoleListForm: FormGroup;
  functionalities: any[]=[];
  selected:any;


  userRole: UserRole = {
    roleId:'',
    userRoleId:'',
    roleName:'',
    roleDescription:''
  }

  userRoleList: UserRole[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'userRoleName', 'userRoleDescription', 'userRoleId'];

  constructor(private nav: NavtntService, fbuilder: FormBuilder, private userRoleListService: UserRoleService,  private router: Router, private route: ActivatedRoute) { 


    //const controls = this.functionalities.map(c => new FormControl(true)
    
    this.userRoleListForm = fbuilder.group({
 
      //functionalities: fb.array([fb.group({'X':''})])

      functionalities: fbuilder.array([
        fbuilder.array([])
     ])
    })
  }

  ngOnInit() {

  
    //this.userId = this.route.snapshot.paramMap.get('id');  
    
  


    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.userId = this.nav.getParameterValue(p.filter, 'userId')     
          this.userName = this.nav.getParameterValue(p.filter, 'userName')               
          this.getAssignedUserRoleList(this.userId);
      }
    });
    
  }


  
  getAssignedUserRoleList(userId){

    console.log(  "getUserRoleListAddList()");
    this.userRoleListService.getAssignedUserRoleList(userId).subscribe((userRoleListAdds:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("clients.length "+userRoleListAdds.length); 

      var userRoleListAdds_tmp: UserRole[];

      if (userRoleListAdds.length>0){
        // Clears old data
        this.userRoleList = [];
      }
                    
      for(var i=0; i<userRoleListAdds.length; i++) {

          console.log("Value of i"+i);


          let userRoleList: UserRole = {
            roleId:'',
            userRoleId:'',
            roleName:'',
            roleDescription:''           
          }
           
       
          userRoleList.roleId = userRoleListAdds[i].ROLE_ID;  
          userRoleList.userRoleId = userRoleListAdds[i].USER_ROLE_ID;          
          userRoleList.roleName = userRoleListAdds[i].ROLE_NAME;
          userRoleList.roleDescription = userRoleListAdds[i].ROLE_DESCRIPTION;

           this.userRoleList.push(userRoleList);

      }

      this.dataSource = new MatTableDataSource(this.userRoleList);
      
  
    });    
  }


  gotoUserRoleAdd(userId) {       
    //this.router.navigate(['controller-tnt', 'user-role-add/'+this.userId]);

    //this.router.navigate(["/admin-home/user-role-add"],{queryParams:{userId:userId}})
    var sourceComponentPath = '/admin-home/user-role-list';
    var destinationComponentPath = '/admin-home/user-role-add';
    var destinationComponentParameterArray = [{ id: 'userId', param: userId }, { id: 'userName', param: this.userName } ] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)            
  }


  deleteUserRole(user_role_id){

    this.userRoleListService.deleteUserRole(user_role_id ).subscribe((userRoles:any[]) => {                           
         this.getAssignedUserRoleList(this.userId);
    });
  }

  onDelete(user) {    
         this.deleteUserRole(user.userRoleId );
  }


}
