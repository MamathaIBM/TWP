import { Component, OnInit, ViewChild } from '@angular/core';
import { Role } from 'Vo/role';
import { RoleService } from 'Services/role.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import {Router} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-role-list',
  templateUrl: './role-list.component.html',
  styleUrls: ['./role-list.component.css']
})
export class RoleListComponent implements OnInit {

  title = 'Admin';

  @ViewChild(MatSort) sort: MatSort;

  role: Role = {
    roleId:'',
    roleName:'',
    roleDescription:''
  }

  roles: Role[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'roleName',  'roleDescription', 'roleLinkedUsers', 'roleId'];

  constructor(private navigation: NavtntService, private roleService: RoleService, private dataandparamService: DataandparamService, private router: Router) { }

  ngOnInit() {

        this.getRoleList();
  }

  getRoleList(){

    console.log(  "getRoleList()"); 

    this.roleService.getRoleList().subscribe((roles:any[]) => {
                     
      console.log("##################################################################################################");

      //console.log("clients.length "+roles.length); 

      var roles_tmp: Role[];

      //if (roles.length>0){
        // Clears old data
      this.roles = [];
      //}
        
      /*
      for(var i=0; i<roles.length; i++) {

          console.log("Value of i"+i);


          let role: Role = {
            roleId:'',            
            roleName:'',            
            roleDescription:''            
          }
           
       

          role.roleId = roles[i].ROLE_ID;          
          role.roleName = roles[i].ROLE_NAME;    
          role.roleDescription = roles[i].ROLE_DESCRIPTION;

           this.roles.push(role);
      }
      */
     this.roles = roles;

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.roles);
      this.dataSource.sort = this.sort;
      
           //this.clients = clients1;
    });    
  }

  onRoleFunctionality(role){                     
            console.log("##################################################################################################");
            //this.router.navigate(['controller-tnt', 'role-functionality/'+role.roleId]);    

            //this.router.navigate(["/admin-home/role-functionality"],{queryParams:{roleId:role.roleId}})

            //var controllerPath = '/controller-tnt'
            var sourceComponentPath = '/admin-home/role-list';
            var destinationComponentPath = '/admin-home/role-functionality';
            var destinationComponentParameterArray = [{ id: 'roleId', param: role.ROLE_ID }, { id: 'roleName', param: role.ROLE_NAME } ]     

            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

}


deleteRole(roleId:string){

  this.roleService.deleteRole(roleId ).subscribe((roles:any[]) => {
                   
    console.log("#####################################");
    this.getRoleList();
  });
}

  onDelete(role) {
    if(confirm("You have selected "+role.ROLE_NAME+". Are you sure to delete?")) {  
          this.deleteRole(role.ROLE_ID);
    }
  }


  onUpdate(role) {
    console.log("Update Clicked "+role.ROLE_ID);    
    //this.router.navigate(['controller-tnt', 'role-edit/'+role.roleId]);
    //this.router.navigate(["/admin-home/role-edit"],{queryParams:{roleId:role.roleId}})

    var sourceComponentPath = '/admin-home/role-list';
    var destinationComponentPath = '/admin-home/role-edit';
    var destinationComponentParameterArray = [{ id: 'roleId', param: role.ROLE_ID } ]     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

  createNew() {
    //console.log("Update Clicked "+role.roleId);    
    //this.router.navigate(['/admin-home/role-add']);
    var sourceComponentPath = '/admin-home/role-list';
    var destinationComponentPath = '/admin-home/role-add';
    var destinationComponentParameterArray = [] ;   
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        
  }

}
