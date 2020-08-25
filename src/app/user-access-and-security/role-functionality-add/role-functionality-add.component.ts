import { Component, OnInit } from '@angular/core';
import { RoleFunctionality } from 'Vo/roleFunctionality';
import { RoleFunctionalityService } from 'Services/roleFunctionality.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { FormArray } from '@angular/forms';
import { NavtntService } from 'src/app/navtnt.service';


@Component({
  selector: 'app-role-functionality-add',
  templateUrl: './role-functionality-add.component.html',
  styleUrls: ['./role-functionality-add.component.css']
})
export class RoleFunctionalityAddComponent implements OnInit {

  roleId:string="-1";
  roleName:string='';
  roleFunctionalityAddForm: FormGroup;
  functionalities: any[]=[];
  selected:any;


  roleFunctionality: RoleFunctionality = {
    functionalityId:'',
    roleFunctionalityId:'',
    roleFunctionalityName:'',
    roleFunctionalityDescription:''
  }

  roleFunctionalityAdds: RoleFunctionality[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'roleFunctionalityName', 'roleFunctionalityDescription', 'roleFunctionalityId'];

  constructor(private nav: NavtntService, fbuilder: FormBuilder, private roleFunctionalityService: RoleFunctionalityService,  private router: Router, private route: ActivatedRoute) { 


    //const controls = this.functionalities.map(c => new FormControl(true)
    
    this.roleFunctionalityAddForm = fbuilder.group({
 
      //functionalities: fb.array([fb.group({'X':''})])

      functionalities: fbuilder.array([
        fbuilder.array([])
     ])
    })
  }

  ngOnInit() {


    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.roleId = this.nav.getParameterValue(p.filter, 'roleId')        
          this.roleName = this.nav.getParameterValue(p.filter, 'roleName')          
          this.getAssignedAndNotAssignedRoleFunctionalityList(this.roleId);      
      }
    });
    
 

    /*
    this.route.queryParams
    .filter(params => params.roleId)
    .subscribe(params => {
      console.log(params); //

      this.roleId = params.roleId;
      this.getAssignedAndNotAssignedRoleFunctionalityList(this.roleId);      
      
    });
    */
    

      //functionalities: fb.array([fb.group({})])
    

    //this.roleFunctionalityAddForm.setControl('functionalities', fb.array([]))
  
    //this.roleId = this.route.snapshot.paramMap.get('id');   
    
    this.getAssignedAndNotAssignedRoleFunctionalityList(this.roleId);
  }


  
  getAssignedAndNotAssignedRoleFunctionalityList(roleId){

    console.log(  "getRoleFunctionalityAddList()");
    this.roleFunctionalityService.getAssignedAndNotAssignedRoleFunctionalityList(roleId).subscribe((roleFunctionalityAdds:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("clients.length "+roleFunctionalityAdds.length); 

      var roleFunctionalityAdds_tmp: RoleFunctionality[];

      if (roleFunctionalityAdds.length>0){
        // Clears old data
        this.roleFunctionalityAdds = [];
      }
                    
      for(var i=0; i<roleFunctionalityAdds.length; i++) {

          console.log("Value of i"+i);


          let roleFunctionality: RoleFunctionality = {
            functionalityId:'',
            roleFunctionalityId:'',            
            roleFunctionalityName:'',            
            roleFunctionalityDescription:''            
          }
           
       
          roleFunctionality.functionalityId = roleFunctionalityAdds[i].FUNCTIONALITY_ID;  
          roleFunctionality.roleFunctionalityId = roleFunctionalityAdds[i].ROLE_FUNCTIONALITY_ID;          
          roleFunctionality.roleFunctionalityName = roleFunctionalityAdds[i].FUNC_NAME;
          roleFunctionality.roleFunctionalityDescription = roleFunctionalityAdds[i].FUNC_DESCRIPTION;

           this.roleFunctionalityAdds.push(roleFunctionality);
           //this.functionalities.push(roleFunctionality.roleFunctionalityId);
      }

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.roleFunctionalityAdds);
      
           //this.clients = clients1;
    });    
  }





  addFunctionalities() {
    //console.log("Update Clicked "+roleFunctionalityAdd.roleFunctionalityAddId);    
    //this.router.navigate(['controller-tnt', 'roleFunctionalityAdd-edit/'+roleFunctionalityAdd.roleFunctionalityAddId]);

    /*
    const selectedOrderIds = this.roleFunctionalityAddForm.value.functionalities
      .map((v, i) => v ? this.functionalities[i].id : null)
      .filter(v => v !== null);

    console.log(selectedOrderIds);
    */

   // var functionalities = JSON.stringify(this.functionalities);
    //console.log( "functionalities " + functionalities);


    /*
    var S='';
    for(var i=0; i<this.functionalities.length; i++) {
        S = S + ',"param'+i +'" : "'+this.functionalities[i]+'" ';
    }

    let functionalityParameter = 
    '{ "COUNT": "'+ 
    this.functionalities.length+ '" '+ S + '}';

*/


 var X='';
 for(var i=0; i<this.functionalities.length; i++) {

  if (i>0){
    X = X +',';
  }  
  X = X + this.functionalities[i];
}

let functionalityParameter = '{"functionalities":"'+X+'"}'
    
    //alert(functionalityParameter);
    this.roleFunctionalityService.addFunctionalities(functionalityParameter, this.roleId ).subscribe((applications:any[]) => {                     
      console.log("###########################################################################");
      //this.router.navigate(['controller-tnt','role-functionality/'+this.roleId]);

      //this.router.navigate(["/admin-home/role-functionality"],{queryParams:{roleId:this.roleId}})



      
      var sourceComponentPath = "/admin-home/role-functionality-add";
      var destinationComponentPath = "/admin-home/role-functionality";
      var destinationComponentParameterArray = [{ id: 'roleId', param: this.roleId }, { id: 'roleName', param: this.roleName } ] 
  
    
      this.nav.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray) 


    });
    
    
  }

  gotoRoleFunctionalityAdd() {
       
    this.router.navigate(['controller-tnt', 'role-functionality-add/'+this.roleId]);

    
    //var sourceComponentPath = "/admin-home/role-functionality-add";
    //var destinationComponentPath = "/admin-home/role-functionality-add";
    //var destinationComponentParameterArray = [{ id: 'roleId', param: this.roleId } ] 
  }


  onChange(event) {
    const functionalities = this.roleFunctionalityAddForm.get('functionalities') as FormArray;

    if(event.checked) {
          functionalities.push(new FormControl(event.source.value))
          this.functionalities.push(event.source.value)
    } else {
          const i = functionalities.controls.findIndex(x => x.value === event.source.value);
          functionalities.removeAt(i);
          this.functionalities.splice(i-1,1);
    }
  }

  gotoBack(){
    
  }


}
