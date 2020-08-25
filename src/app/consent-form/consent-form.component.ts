import { Component, OnInit } from '@angular/core';
import { NavtntService } from '../navtnt.service';


@Component({
  selector: 'app-consent-form',
  templateUrl: './consent-form.component.html',
  styleUrls: ['./consent-form.component.css']
})
export class ConsentFormComponent implements OnInit {
  

  constructor(private navigation: NavtntService) { }

  ngOnInit() {
   
  }


  gotoManageActiveTransitionsComponent(){

        //var controllerPath = 'controller-tnt'
        var sourceComponentPath = 'ConsentFormComponent'
        var destinationComponentPath = 'ManageActiveTransitionsComponent'
        var destinationComponentParameterArray:any = []     

        this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }
}
