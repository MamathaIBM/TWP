import { Component, OnInit } from '@angular/core';
import { Transition } from 'Vo/transition';
import { TransitionService } from 'Services/transition.service';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";



@Component({
  selector: 'app-transition-list',
  templateUrl: './transition-list.component.html',
  styleUrls: ['./transition-list.component.css']
})
export class TransitionListComponent implements OnInit {

  transitions:Transition[]=[];
  transition: Transition = {

    transition_id:'',
    client_name: '',
    transition_name: '',
    start_date:'',
    fte:'',
    sector:'',
    industry:'',
    serviceline:'',
    geo:'',
    incumbent_vendor:'',
    country:'',
    tcv:'',
    tier:'',
    siebel:'',
    iot:''
  };


  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'client_name', 'transition_name', 'transition_id'];

  constructor(private transitionService: TransitionService, private dataandparamService: DataandparamService,  private router: Router, private route: ActivatedRoute) 
  { 

  }

  ngOnInit() {

    //let userId = this.route.snapshot.paramMap.get('id');
    this.getTransitionList('1');
  }

  getTransitionList(userId:string){

    console.log(  "getTransitionList()"); 

    this.transitionService.getTransitionList(userId).subscribe((transitions:any[]) => {
                     
      console.log("##################################################################################################");

      console.log("clients.length "+transitions.length); 

      var transitions_tmp: Transition[];

      if (transitions.length>0){
        // Clears old data
        this.transitions = [];
      }
                    
      for(var i=0; i<transitions.length; i++) {

          console.log("Value of i"+i);


          let transition: Transition = {

            transition_id:'',
            transition_name:'',
            client_name: '',
            start_date:'',
            fte:'',
            sector:'',
            industry:'',
            serviceline:'',
            geo:'',
            incumbent_vendor:'',
            country:'',
            tcv:'',
            tier:'',
            siebel:'',
            iot:'',
          }
               

          transition.transition_id = transitions[i].TRANSITION_ID
          transition.client_name = transitions[i].TRAN_CLIENT_NAME
          transition.transition_name = transitions[i].TRAN_PROJECT_NAME
          transition.start_date = transitions[i].TRAN_START_DATE 
          transition.fte = transitions[i].TRAN_FTE
          transition.sector = transitions[i].TRAN_SECTOR 
          transition.industry = transitions[i].TRAN_INDUSTRY
          transition.serviceline = transitions[i].TRAN_SERVICE_LINE  
          transition.geo = transitions[i].TRAN_GEO
          transition.incumbent_vendor = transitions[i].TRAN_INCUMBENT_VENDOR  
          transition.country = transitions[i].TRAN_COUNTRIES
          transition.tcv = transitions[i].TRAN_TCV  
          transition.tier = transitions[i].TRAN_TIER    
          transition.siebel = transitions[i].TRAN_SIEBEL  
          transition.iot = transitions[i].TRAN_IOT            

           this.transitions.push(transition);
      }

      //this.dataSource =this.clients;

      this.dataSource = new MatTableDataSource(this.transitions);
      
           //this.clients = clients1;
    });    
  }

  /*
  deleteTransition(transition_id:string){

    this.transitionService.deleteTransition(transition_id ).subscribe((transitions:any[]) => {
                     
      console.log("##################################################################################################");
      this.getTransitionList();
    });
  }

  */

  /*
  onDelete(transition) {
    console.log("Delete Clicked "+transition.transitionId);    
    this.deleteTransition(transition.transitionId);
  }

  */



  
  onUpdate(transition) {


    console.log("Update Clicked X "+transition.transition_id);  
    
    this.dataandparamService.setTransitionId(transition.transition_id);
    this.dataandparamService.setClientName(transition.client_name);



    //this.router.navigate(['profile', transition.transition_id]);
    this.router.navigate(['controller-tnt','profile']);

  }
  

}
