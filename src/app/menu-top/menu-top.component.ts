import { Component, OnInit, Input } from '@angular/core';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from '../navtnt.service';
import { environment } from 'src/environments/environment'; 


@Component({
  selector: 'app-menu-top',
  templateUrl: './menu-top.component.html',
  styleUrls: ['./menu-top.component.css']
})
export class MenuTopComponent implements OnInit {

  userName:string='';
  userPhoto:any= '';
  @Input() public activePage: string;
  FlagHide: string;
  serverURL = environment.serverURL+'/logout'

    constructor( private userAccessProfileService: UserAccessProfileService,
    private navigation : NavtntService) { }
  //constructor() { }

  ngOnInit() {
     //this.userName  = this.userAccessProfileService.getUserName();

    //  this.userName = encodeURIComponent (this.userAccessProfileService.getUserName());
    this.userName = decodeURIComponent (this.userAccessProfileService.getUserName());
    //alert("MenuTOP Component UserName "+this.userName);
    this.userPhoto  = this.userAccessProfileService.getUserPhoto();

    if(location.pathname === '/ConsentFormComponent'){
     this.FlagHide = 'Yes';
    }else{
     this.FlagHide = 'No';
    }
  }

  goTo(destination){

    //alert("this.activePage"+this.activePage)
    //var controllerPath = 'controller-tnt'
    var sourceComponentPath = this.activePage;
    var destinationComponentPath = destination;
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
