import { Component, OnInit, Input } from '@angular/core';
import { NavtntService } from '../navtnt.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-consentform',
  templateUrl: './view-consentform.component.html',
  styleUrls: ['./view-consentform.component.css']
})
export class ViewConsentformComponent implements OnInit {

  // @Input() public activePage: string;

  constructor() { }

  ngOnInit() {
  }

  // goTo(destination){

  //   var sourceComponentPath = this.activePage;
  //   var destinationComponentPath = destination;
  //   var destinationComponentParameterArray:any = []    

  //   this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)   
  // }

}
