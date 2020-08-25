import { Component, OnInit, ViewChild } from '@angular/core';
import { Functionality } from 'Vo/functionality';
import { FunctionalityService } from 'Services/functionality.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {MatSort} from '@angular/material/sort'
import { MatSortModule } from '@angular/material/sort'; 
import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { FormBuilder, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-functionality-list',
  templateUrl: './functionality-list.component.html',
  styleUrls: ['./functionality-list.component.css']
})
export class FunctionalityListComponent implements OnInit {

  tran_id:string="-1";
  dataLength = 0;

  @ViewChild(MatSort) sort: MatSort;

  funcListForm: FormGroup;
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

  functionalitys: Functionality[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'FUNC_NAME', 'FUNC_ROUTERLINK','FUNC_DEFAULT', 'FUNC_UOI', 'FUNC_OPERATION_TYPE','FUNC_TRANSITION_DEPENDENCY','FUNC_MODULE', 'FUNC_DESCRIPTION', 'FUNC_LINKED_ROLES', 'FUNCTIONALITY_ID'];

  constructor(private route:Router,private navigation: NavtntService, 
              private userAccessProfileService: UserAccessProfileService, 
              private functionalityService: FunctionalityService, 
              private fb: FormBuilder, 
              private router: Router) { 
    this.funcListForm = fb.group({
      funcName:[''],
    })}

  ngOnInit() {

    //this.dataSource.sort = this.sort;
    //this.tran_id = this.dataandparamService.getTransitionId();
    this.getFunctionalityList();
  }

  getFunctionalityList(){

    console.log(  "getFunctionalityList()"); 

    this.functionalityService.getFunctionalityList().subscribe((functionalitys:any[]) => {
                     
      console.log("###########################################");

      console.log("clients.length "+functionalitys.length); 

      var functionalitys_tmp: Functionality[];

      if (functionalitys.length>0){
        // Clears old data
        this.functionalitys = [];
      }
             
      
      /*
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
            functionalityDefault:'',
            functionalityUOI:''                        
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

      */

      //this.dataSource =this.clients;

      this.functionalitys = functionalitys;

      this.dataSource = new MatTableDataSource(this.functionalitys);
      this.dataSource.sort = this.sort;

      this.dataLength =  this.dataSource.data.length;
      
           //this.clients = clients1;
    });    
  }

  deleteFunctionality(functionality_id:string){

    this.functionalityService.deleteFunctionality(functionality_id ).subscribe((functionalitys:any[]) => {
                     
      console.log("#####################################");
      this.getFunctionalityList();
    });
  }

  onDelete(functionality) {
    console.log("Delete Clicked "+functionality.FUNCTIONALITY_ID);    
    this.deleteFunctionality(functionality.FUNCTIONALITY_ID);
  }


  onUpdate(functionality) {
    console.log("Update Clicked "+functionality.FUNCTIONALITY_ID);    
    //this.router.navigate(['/admin-home/functionality-list/'+functionality.functionalityId]);
    //this.router.navigate(['/admin-home/functionality-edit/'+functionality.functionalityId]);
    //this.router.navigate(["/admin-home/functionality-edit"],{queryParams:{functionalityId:functionality.functionalityId}})
    //this.router.navigate(["/admin-home/functionality-edit/"+functionality.functionalityId])

    //this.router.navigate(["/admin-home/controller-admin"],{queryParams:{destination:'/admin-home/functionality-list'}}) 

    /*
    var myQueryParams = [
      { id: 'destination', param: '/admin-home/functionality-edit' },
      { id: 'functionalityId', param: functionality.functionalityId }      
    ];
    */

    //this.router.navigate(['/admin-home/controller-admin'], {queryParams: {filter: JSON.stringify(myQueryParams)}})


    //var controllerPath = '/controller-tnt'
    var sourceComponentPath = "/admin-home/functionality-list";
    var destinationComponentPath = "/admin-home/functionality-edit";
    var destinationComponentParameterArray = [{ id: 'functionalityId', param: functionality.FUNCTIONALITY_ID } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }



  copyAndCreateNew(functionalityId) {
    //console.log("copyAndCreateNew Clicked "+functionalityId);   
    //this.router.navigate(["/admin-home/functionality-add"],{queryParams:{functionalityId:functionalityId}}) 
    //this.router.navigate(['controller-tnt', 'functionality-add/'+functionalityId]);
    
    var sourceComponentPath = "/admin-home/functionality-list";
    var destinationComponentPath = "/admin-home/functionality-add";
    var destinationComponentParameterArray = [{ id: 'functionalityId', param: functionalityId } ] 

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }

  gotoFileUpload() {
       
    var sourceComponentPath = '/admin-home/functionality-list';
    var destinationComponentPath = '/admin-home/functionality-upload';
    var destinationComponentParameterArray = [] 
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    

  }

  getAllFunctionality(){
    this.getFunctionalityList();
  }

  searchFunctionality(){

    console.log(  "getFunctionalitySearchList()"); 

    var funcName = this.funcListForm.controls['funcName'].value;

    this.functionalityService.getFunctionalitySearchList(funcName).subscribe((functionalitys:any[]) => {
      this.funcListForm.controls['funcName'].setValue('');               

      if (functionalitys.length>0){
        // Clears old data
        this.functionalitys = [];
      }
                

      this.functionalitys = functionalitys;

      this.dataSource = new MatTableDataSource(this.functionalitys);
      this.dataSource.sort = this.sort;

      this.dataLength =  this.dataSource.data.length;
      
    });    
  }


}
