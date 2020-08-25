import { Component, OnInit, forwardRef } from '@angular/core';
import { ControllerServiceService } from '../controller-service.service';


@Component({
  selector: 'app-controller-tnt',
  templateUrl: './controller-tnt.component.html',
  styleUrls: ['./controller-tnt.component.css']
})



export class ControllerTntComponent implements OnInit {

  constructor(private controllerService: ControllerServiceService) {  
  }

  ngOnInit() {

    //alert("#########################In ControllerTnT #############################################################")
       // this.controllerService.goToComponent();
  }

}
