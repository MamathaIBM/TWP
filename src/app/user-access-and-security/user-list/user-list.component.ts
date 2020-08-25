import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'Vo/user';
import { UserService } from 'Services/user.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource, MatSort } from '@angular/material';
import {Router} from "@angular/router";
import { NavtntService } from 'src/app/navtnt.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  title="";
  @ViewChild(MatSort) sort: MatSort;
  sourceComponentPath = '/user-list';

  tran_id:string="-1";
  userListForm: FormGroup;
  user: User = {
      userId:'',    
      userName:'',
      userEmail:'',
      userCountry:'',
      userOrg:'',
      userCity:'',
      userComments:''
  }


  users: User[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'userName', 'userEmail',  'userCountry', 'userOrg','userCity', 'userComments', 'userId'];

  constructor(private navigation: NavtntService, 
              private userService: UserService, 
              private fb: FormBuilder,  
              private router: Router) { 
                   
    this.userListForm = fb.group({
          userName:[''],
    });
    

  }

  ngOnInit() {


    this.getUserList();
  
  }

  getUserList(){

    console.log(  "getUserList()"); 

    this.userService.getUserList().subscribe((users:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("clients.length "+users.length); 

      var users_tmp: User[];

      if (users.length>0){
        // Clears old data
        this.users = [];
      }
                    
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
          user.userCity = users[i].USER_CITY_LOCATION;
          user.userComments = users[i].USER_COMMENTS;

          this.users.push(user);
      }

      

      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
      
      
    });    
  }

  deleteUser(user_id:string){

    this.userService.deleteUser(user_id ).subscribe((users:any[]) => {
                     
      console.log("#####################################################################");
      this.getUserList();
    });
  }

  onDelete(user) {
    console.log("Delete Clicked "+user.userId);    
    this.deleteUser(user.userId);
    this.router.navigate(['controller-tnt', 'user-list']);
  }


  gotoUserRole(user){
    //this.router.navigate(['controller-tnt', 'user-role-list/'+user.userId]);      
    //this.router.navigate(['/admin-home/user-role-list'],{queryParams:{userId:user.userId}})
    
    var destinationComponentPath = '/admin-home/user-role-list';
    var destinationComponentParameterArray = [{ id: 'userId', param: user.userId }, { id: 'userName', param: user.userName } ]     
    
    this.navigation.goToComponent(this.sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)            
  }

  gotoUserTransition(user){
    //this.router.navigate(['controller-tnt', 'user-transition-list/'+user.userId]);    
    var destinationComponentPath = '/admin-home/user-transition-list';      
    var destinationComponentParameterArray = [{ id: 'userId', param: user.userId } ]         
    this.navigation.goToComponent(this.sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                
  }

  onUpdate(user) {
    console.log("Update Clicked "+user.userId);    
    //this.router.navigate(['controller-tnt', 'user-edit/'+user.userId]);
    //this.router.navigate(["/admin-home/user-edit"],{queryParams:{userId:user.userId}})
    var destinationComponentPath = '/admin-home/user-edit';      
    var destinationComponentParameterArray = [{ id: 'userId', param: user.userId } ]         
    this.navigation.goToComponent(this.sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                

  }

  createNew() {  
    //this.router.navigate(['/admin-home/user-add']);
    var destinationComponentPath = '/admin-home/user-add';      
    var destinationComponentParameterArray = []         
    this.navigation.goToComponent(this.sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                

  }

  getTransitionOrgList(orgs){
     
      var S="";

      /*
      for(var i=0; i<transitionOrgs.length;i++){
         
      }
      */
  }


  getAllUsers(){
    this.getUserList();
  }

  searchUser(){

    console.log(  "getUserList()"); 

    var userName = this.userListForm.controls['userName'].value;

    this.userService.getUserSearchList(userName).subscribe((users:any[]) => {
      this.userListForm.controls['userName'].setValue('');               

      if (users.length>0){
        // Clears old data
        this.users = [];
      }
                
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
        user.userCity = users[i].USER_CITY_LOCATION;
        user.userComments = users[i].USER_COMMENTS;

        this.users.push(user);
    }

      this.dataSource = new MatTableDataSource(this.users);
      this.dataSource.sort = this.sort;
    });    
  }


}
