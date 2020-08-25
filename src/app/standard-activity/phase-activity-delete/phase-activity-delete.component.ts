import { Component, OnInit } from '@angular/core';
import * as XLSX from 'xlsx';
import { StandardActivityService } from 'Services/standard-activity.service';
import { NavtntService } from 'src/app/navtnt.service';
import { ActivatedRoute } from '@angular/router';

@Component({
          selector: 'app-phase-activity-delete',
          templateUrl: './phase-activity-delete.component.html',
          styleUrls: ['./phase-activity-delete.component.css']
})

export class PhaseActivityDeleteComponent implements OnInit {

    file:any;
    arrayBuffer:any;
    phase:string;
    phaseName:string;

    constructor(private standardActivityService: StandardActivityService, private navigation : NavtntService, private route: ActivatedRoute) {}

     ngOnInit() {
                        this.route.queryParams.subscribe((p: any) => {    
                              if (p.filter){
                                    
                                    this.phase = this.navigation.getParameterValue(p.filter, 'phase')    
                                    this.phaseName = this.navigation.getParameterValue(p.filter, 'phaseTitle')       
                                                                     
                              }
                        });                              
    }
}
