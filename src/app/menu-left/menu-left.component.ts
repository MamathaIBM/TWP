import { Component, OnInit, Input } from '@angular/core';
import { NavtntService } from '../navtnt.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-menu-left',
  templateUrl: './menu-left.component.html',
  styleUrls: ['./menu-left.component.css']
})
export class MenuLeftComponent implements OnInit {

  
  @Input() public activePage: string;
  menuname: string;
  
  constructor(private navigation : NavtntService,
              private userAccessProfileService: UserAccessProfileService,
              private router: Router,
              private activatedRoute: ActivatedRoute,) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res: any) => {
      if (res.filter) {
        if (this.navigation.getParameterValue(res.filter, 'ViewFlag') === 'Yes') {
          this.menuname = 'AllTransitionAccountsComponent';
        }else if ((this.navigation.getParameterValue(res.filter, 'ViewFlag') === 'No')&&(this.navigation.getParameterValue(res.filter, 'SaveFlag') === 'Save')) {  
          this.menuname = 'NewExecutionComponent';
        }else if (this.navigation.getParameterValue(res.filter, 'ViewFlag') === 'No'){
          this.menuname = 'ManageActiveTransitionsComponent';
        }
      } 
    });
  }

  goTo(destination){

    var sourceComponentPath = this.activePage;
    var destinationComponentPath = destination;
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)   

  }

}
