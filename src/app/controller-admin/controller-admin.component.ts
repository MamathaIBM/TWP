import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Keyvalue } from 'Vo/keyvalue';
import { ControllerServiceService } from '../controller-service.service';

@Component({
  selector: 'app-controller-admin',
  templateUrl: './controller-admin.component.html',
  styleUrls: ['./controller-admin.component.css']
})
export class ControllerAdminComponent implements OnInit {



  constructor(private controllerService: ControllerServiceService) { }
        ngOnInit() {
        //alert("#########################In Controller Admin #############################################################")

//          this.controllerService.goToComponent();
        }

}
