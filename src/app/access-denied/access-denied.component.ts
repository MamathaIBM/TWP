import { Component, OnInit } from '@angular/core';
import { ActivatedRoute} from "@angular/router";
import { Router} from "@angular/router";
import { Input } from '@angular/core';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { NavtntService } from '../navtnt.service';

@Component({
  selector: 'app-access-denied',
  templateUrl: './access-denied.component.html',
  styleUrls: ['./access-denied.component.css']
})
export class AccessDeniedComponent implements OnInit {

  public message='Access denied';
  constructor(private router: Router,private nav: NavtntService, private route: ActivatedRoute, private userAccessProfile: UserAccessProfileService) { }
  

  ngOnInit() {
    
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){
          this.message = this.nav.getParameterValue(p.filter, 'access_denied_msg') 
          //alert("this.message "+this.message)         
      }
    });    

    //alert("this.message   "+this.dataandparamService.getProperty("error_meassge"));
  }

}
