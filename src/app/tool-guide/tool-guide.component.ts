import { Component, OnInit, Input } from '@angular/core';
import { NavtntService } from '../navtnt.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-tool-guide',
  templateUrl: './tool-guide.component.html',
  styleUrls: ['./tool-guide.component.css']
})
export class ToolGuideComponent implements OnInit {
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
