import { Component, OnInit } from '@angular/core';
import { RoleFunctionality } from 'Vo/roleFunctionality';
import { RoleFunctionalityService } from 'Services/roleFunctionality.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';

@Component({
  selector: 'app-role-functionality',
  templateUrl: './role-functionality.component.html',
  styleUrls: ['./role-functionality.component.css']
})
export class RoleFunctionalityComponent implements OnInit {

  roleId:string="-1";
  roleName:string='';

  roleFunctionality: RoleFunctionality = {
    functionalityId:'',
    roleFunctionalityId:'',
    roleFunctionalityName:'',
    roleFunctionalityDescription:''
  }

  roleFunctionalitys: RoleFunctionality[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'roleFunctionalityName', 'roleFunctionalityDescription', 'roleFunctionalityId'];

  constructor(private nav:NavtntService, private roleFunctionalityService: RoleFunctionalityService, private dataandparamService: DataandparamService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.roleId = this.nav.getParameterValue(p.filter, 'roleId')        
          this.roleName = this.nav.getParameterValue(p.filter, 'roleName')   
          //alert("this.roleName "+this.roleName);     
          this.getAssignedRoleFunctionalityList(this.roleId);   
      }
    });


    /*

    this.route.queryParams
    .filter(params => params.roleId)
    .subscribe(params => {
      console.log(params); //

      this.roleId = params.roleId;
      this.getAssignedRoleFunctionalityList(this.roleId);      
      
    });
   */
    //this.roleId = this.route.snapshot.paramMap.get('id');   
    

  }

  getAssignedRoleFunctionalityList(roleId){

    console.log(  "getRoleFunctionalityList()"); 

    this.roleFunctionalityService.getAssignedRoleFunctionalityList(roleId).subscribe((roleFunctionalitys:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("clients.length "+roleFunctionalitys.length); 

      var roleFunctionalitys_tmp: RoleFunctionality[];

      //if (roleFunctionalitys.length>0){
        // Clears old data
        this.roleFunctionalitys = [];
      //}
                    
      for(var i=0; i<roleFunctionalitys.length; i++) {

          console.log("Value of i"+i);


          let roleFunctionality: RoleFunctionality = {
            functionalityId:'',
            roleFunctionalityId:'',            
            roleFunctionalityName:'',            
            roleFunctionalityDescription:''            
          }
           
       

          roleFunctionality.roleFunctionalityId = roleFunctionalitys[i].ROLE_FUNCTIONALITY_ID;          
          roleFunctionality.roleFunctionalityName = roleFunctionalitys[i].FUNC_NAME;
          roleFunctionality.roleFunctionalityDescription = roleFunctionalitys[i].FUNC_DESCRIPTION;

           this.roleFunctionalitys.push(roleFunctionality);
      }

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.roleFunctionalitys);
      
           //this.clients = clients1;
    });    
  }

  deleteRoleFunctionality(roleFunctionality_id:string){

    this.roleFunctionalityService.deleteRoleFunctionality(roleFunctionality_id ).subscribe((roleFunctionalitys:any[]) => {
                     
      console.log("##################################################################################################");
      //this.router.navigate(['controller-tnt', 'roleFunctionality-edit/'+roleFunctionality.roleFunctionalityId]);
      this.getAssignedRoleFunctionalityList(this.roleId); 
    });
  }

  onDelete(roleFunctionality) {
    console.log("Delete Clicked "+roleFunctionality.roleFunctionalityId);    

    if(confirm("You have selected "+roleFunctionality.roleFunctionalityName+". Are you sure to delete?")) {
         this.deleteRoleFunctionality(roleFunctionality.roleFunctionalityId);
    }
  }


  onUpdate(roleFunctionality) {
    console.log("Update Clicked "+roleFunctionality.roleFunctionalityId);    
    //this.router.navigate(['controller-tnt', 'roleFunctionality-edit/'+roleFunctionality.roleFunctionalityId]);
    //this.router.navigate(["/admin-home/role-functionality-edit"],{queryParams:{roleFunctionalityId:roleFunctionality.roleFunctionalityId}})


    var sourceComponentPath = '/admin-home/role-functionality';
    var destinationComponentPath = '/admin-home/role-functionality-edit';
    var destinationComponentParameterArray = [{ id: 'roleFunctionalityId', param: roleFunctionality.roleFunctionalityId } ] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)        


  }

  gotoRoleFunctionalityAdd() {
           
    //this.router.navigate(['controller-tnt', 'role-functionality-add/'+this.roleId]);
    //this.router.navigate(["/admin-home/role-functionality-add"],{queryParams:{roleId:this.roleId}})
    var sourceComponentPath = '/admin-home/role-functionality';
    var destinationComponentPath = '/admin-home/role-functionality-add';
    var destinationComponentParameterArray = [{ id: 'roleId', param: this.roleId },{ id: 'roleName', param: this.roleName } ] 
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)            
  }

  gotoRoleList(){
    
    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/role-list";
    var destinationComponentParameterArray:any = []     
    this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
