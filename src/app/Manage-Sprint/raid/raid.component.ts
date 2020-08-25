import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {PageEvent} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from 'rxjs';
import {RaidService} from './raid-module/raid.service';
import { Validators,FormGroup, FormControl,FormBuilder } from '@angular/forms';
import { NavtntService } from './../../navtnt.service';
import { environment } from 'src/environments/environment'; 
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-raid',
  templateUrl: './raid.component.html',
  styleUrls: ['./raid.component.css']
})
export class RAIDComponent implements OnInit {
  Flag: string;
  editFlag: number; 
  raidUpdateeForm : FormGroup;
  baseURL = environment.baseUrl;
  private loadparamsRaid: Subscription;
  private saveSubscription: Subscription;
  private deleteSubscription: Subscription;
  private IntegrationID: string;
  dataSource = new MatTableDataSource<any>();
  dataLength: number; 
  selectedRow: number;
  deleteFlag: number
  addValue: any;
  private Client: string;
  private Sector: string;
  private Industry: string;
  private ViewFlag: string;
  public loadDat : any;
  public username: any;
  private OwningTTS: string;
  TransitionAccName: any;
  private excelIcon : boolean = true;
  private selectTypeRadioButtonValue : string ='';
  @ViewChild(MatPaginator) paginator: MatPaginator;    // Pagination
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = [ 'Level', 'Type', 'Description','Status','TargetDate','Owner','Priority', 'Edit', 'Delete', 'View'];
  //'Level',
 
  constructor(private _service : RaidService,
              private toaster: ToastrService,
              public datepipe: DatePipe,
              private fb : FormBuilder ,
              private route : Router,
              private activatedRoute : ActivatedRoute,
              private navigation: NavtntService         
            ){  
              this.editFlag =0;
              this.selectedRow = 0;
              this.raidUpdateeForm =  this.fb.group ({ 
              Level : [''], 
              Type:[''],
              Description :[''] ,
              Status : [''],
              TargetDate : [''],
              Owner : [''],
              Priority :  ['']  ,
              RaidID : ['']          
            });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((res: any) => {    
      if (res.filter){
        this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
        this.username = decodeURIComponent(this.username._value);

        this.TransitionAccName = JSON.parse(sessionStorage.getItem('ACCOUNTClientName'));
        this.TransitionAccName = decodeURIComponent(this.TransitionAccName._value);
        this.TransitionAccName = this.TransitionAccName.replace(/\s/g,'');

        this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id')
        this.Client = this.navigation.getParameterValue(res.filter, 'ClientName')
        this.Sector = this.navigation.getParameterValue(res.filter, 'Sector')
        this.Industry = this.navigation.getParameterValue(res.filter, 'Industry')
        this.ViewFlag = this.navigation.getParameterValue(res.filter, 'ViewFlag')
        this.OwningTTS = this.navigation.getParameterValue(res.filter, 'OwningTTS')
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
          this.loadData();
          }
      });
  }

  
  loadData(){
    this.loadparamsRaid = this._service.getRaidData(this.IntegrationID).subscribe(res=>{
      this.loadDat = res;

for(var i=0;i<this.loadDat.length ;i++){
  if((this.loadDat[i].EpicUNID=='')&&(this.loadDat[i].sprintUNID=='')&&(this.loadDat[i].AppUNID==null)){
    this.loadDat[i].epicName='Overall Level';
  }
}
    },(err:HttpErrorResponse)=>{
       if(err.error instanceof Error){
         console.log("Client Sider Error.");
       }
       else{
         console.log("Server Sider Error.");
     }

     },()=>{
      this.dataSource.data = this.loadDat;       
      this.dataLength = this.dataSource.data.length;
     } );         
  }

  onDelete(obj: any) {
    if (confirm('Are you sure want to delete the record?' )) {
       this.deleteSubscription = this._service.DeleteRaid(obj.RaidID).subscribe(res => {
           this.loadData();
           if (res.Delete === 'Success') {
             this.toaster.success('Deleted Succcessfully', 'RAID Record');
           } else {
            this.toaster.error('Delete Failed', 'RAID Record');
           }
       }, (err: HttpErrorResponse) => {
           if (err.error instanceof Error) {
               this.toaster.error('Client side delete Error', 'ttstoolssupport@in.ibm.com');
           } else {
               this.toaster.error('Server side delete Error', 'ttstoolssupport@in.ibm.com');
           }
       });
              this.deleteFlag = 1;
   } else {
       this.deleteFlag = 0;
      // this.toaster.info('Delete Cancelled.', 'RAID Record');
    }
  }

  Refresh() {
    var sourceComponentPath = '/transition-Main/raid';
    var destinationComponentPath = '/transition-Main/raid';
    var destinationComponentParameter = [{ id: 'Id', param: this.IntegrationID },
    { id: 'ClientName', param: this.Client },
    { id: 'Sector', param: this.Sector },
    { id: 'Industry', param: this.Industry },
    { id: 'ViewFlag', param: this.ViewFlag },
    { id: 'OwningTTS', param: this.OwningTTS }]
    this.navigation.goToComponent(sourceComponentPath, destinationComponentPath, destinationComponentParameter) 
  }
Add() {
  this.Flag = 'Add';
  this.addValue = this.selectedRow;
  var sourceComponentPath = '/transition-Main/raid';
  var destinationComponentPath = '/transition-Main/raid-add-update';
  var destinationComponentParameterArray = [{ id: 'Id', param: this.IntegrationID },
                                            { id: 'Flag', param: this.Flag},
                                            { id: 'Type', param: this.addValue.Type },
                                            { id: 'ClientName', param: this.Client },
                                            { id: 'Sector', param: this.Sector },
                                            { id: 'Industry', param: this.Industry },
                                            { id: 'ViewFlag', param: this.ViewFlag },
                                            { id: 'OwningTTS', param: this.OwningTTS }]           
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)     
}
Update(obj: any) {
 this.Flag = 'Update';
 this.addValue = obj;
  if(this.addValue.epicName=='Overall Level'){
    var epicVal = '';
  }else{
    epicVal=this.addValue.EpicUNID;
  }
  var sourceComponentPath = '/transition-Main/raid';
  var destinationComponentPath = '/transition-Main/raid-add-update';
  var destinationComponentParameterArray = [{ id: 'Id', param: this.IntegrationID},
                                             { id: 'editFlag', param: this.editFlag},
                                             { id: 'Flag', param: this.Flag},
                                             { id: 'Type', param: this.addValue.Type },
                                             { id: 'EpicUNID', param: epicVal}, 
                                             { id: 'EpicName', param: this.addValue.epicName}, 
                                             { id: 'SprintUNID', param: this.addValue.sprintUNID },
                                             { id: 'SprintName', param: this.addValue.sprintName },
                                             { id: 'AppUNID', param: this.addValue.AppUNID },                                            
                                             { id: 'AppName', param: this.addValue.AppName }, 
                                            { id: 'ClientName', param: this.Client },
                                            { id: 'Sector', param: this.Sector },
                                            { id: 'Industry', param: this.Industry },
                                            { id: 'ViewFlag', param: this.ViewFlag } ,
                                            { id: 'RaidID', param: this.addValue.RaidID},
                                            { id: 'OwningTTS', param: this.OwningTTS } ]            
  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)     
}
View(obj: any) {
  this.Flag = 'View';
  this.addValue = obj;
   if(this.addValue.epicName=='Overall Level'){
     var epicVal = '';
   }else{
     epicVal=this.addValue.EpicUNID;
   }
   var sourceComponentPath = '/transition-Main/raid';
   var destinationComponentPath = '/transition-Main/raid-add-update';
   var destinationComponentParameterArray = [{ id: 'Id', param: this.IntegrationID},
                                              { id: 'editFlag', param: this.editFlag},
                                              { id: 'Flag', param: this.Flag},
                                              { id: 'Type', param: this.addValue.Type },                                              
                                              { id: 'EpicUNID', param: epicVal}, 
                                              { id: 'EpicName', param: this.addValue.epicName}, 
                                              { id: 'SprintUNID', param: this.addValue.sprintUNID },
                                              { id: 'SprintName', param: this.addValue.sprintName },
                                              { id: 'AppUNID', param: this.addValue.AppUNID },                                            
                                              { id: 'AppName', param: this.addValue.AppName }, 
                                             { id: 'ClientName', param: this.Client },
                                             { id: 'Sector', param: this.Sector },
                                             { id: 'Industry', param: this.Industry },
                                             { id: 'ViewFlag', param: this.ViewFlag } ,
                                             { id: 'RaidID', param: this.addValue.RaidID},
                                             { id: 'OwningTTS', param: this.OwningTTS } ]            
   this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)     
 }
 selectTypeRadioButton(selectTypeRadioButtonValue : string ){
   this.selectTypeRadioButtonValue = selectTypeRadioButtonValue
   this.excelIcon = false;
 }
 RAIDexportAsXLSX(){  
  var TypeRadioButtonValue = this.selectTypeRadioButtonValue
  this.selectTypeRadioButtonValue =''
  var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
    this._service.getexecelfile(this.username,this.IntegrationID,this.TransitionAccName+'-'+Ttoday,TypeRadioButtonValue);
   window.open(this.baseURL+'/getexcelRAID/'+this.username+"/"+this.IntegrationID+"/"+this.TransitionAccName+'-'+Ttoday+"/"+TypeRadioButtonValue);
  }
 ngOnDestroy() {
  this.loadparamsRaid.unsubscribe();
 }


}
