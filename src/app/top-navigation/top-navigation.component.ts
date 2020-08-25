
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { UserNameService } from 'Services/user-name.service';
import { HttpErrorResponse } from "@angular/common/http";
import { UserAccessProfileService } from 'Services/user-access-profile.service';


@Component({
  selector: 'app-top-navigation',
  templateUrl: './top-navigation.component.html',
  styleUrls: ['./top-navigation.component.css']
})
export class TopNavigationComponent implements OnInit {
  url : any;
  rootURL = "http://localhost:8080"
  
  // this.href = this.router.url;

  rowData:any;
  nm:any;
  photo:string;
  constructor(private _Ser:UserNameService, private router : Router, public userAccessProfileService: UserAccessProfileService ) { }

  ngOnInit() {
    
    this.url =window.location.pathname;
    console.log(this.url)

    this._Ser.getIBMusername().subscribe(res=>{
 
      this.rowData = res;
      console.log(this.rowData._json.emailAddress)
      this.nm = this.rowData._json.cn;
      this.nm = this.nm.replace("%20", " ");
      this.photo = "https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/"+this.rowData._json.uid;

      //this.userAccessProfileService.populateUserAccessProfile(this.rowData._json.emailAddress)
     
     },(err:HttpErrorResponse)=>{
       if(err.error instanceof Error){
         console.log("Client Sider Error.");
       }
       else{console.log("Server Sider Error.");
     }
     }); 

     this._Ser.Toollogout().subscribe(res=>{

      this.rowData = res;
     
     },(err:HttpErrorResponse)=>{
       if(err.error instanceof Error){
         console.log("Client Sider Error.");
       }
       else{console.log("Server Sider Error.");
     }
     }); 
  }
}
