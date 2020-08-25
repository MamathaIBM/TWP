import {Component, Inject, OnInit,ViewChild} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatTabChangeEvent} from '@angular/material';
import { NavtntService } from './../../navtnt.service';
import { ActivatedRoute } from '@angular/router';
import { SevenKeyModuleService } from './../seven-key/seven-key-module/seven-key-module.service';
import { HttpErrorResponse } from "@angular/common/http";
import { MatTableDataSource } from '@angular/material';
import { Validators,FormGroup ,FormBuilder,FormArray,FormControl } from '@angular/forms';
import { ServiceForm } from 'Services/form';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import {  MatSort } from '@angular/material';

export interface DialogData {
  IntegrationID :any ;
  username :any;
  end_of_week :any;
  recordexist :any;
  view :any;
}

@Component({
  selector: 'app-seven-key',
  templateUrl: './seven-key.component.html',
  styleUrls: ['./seven-key.component.css']
})

export class SevenKeyComponent implements OnInit {

  private Integration_ID : string;
  private isButtonVisible = false;
  private user_name : any;
  private weekend_date : any;
  private record_exist : any;
  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private recordSubscription: Subscription;
  private recordSubscriptionFlag : number;
  private loadparamsSubscriptionFlag : number;
  private savedFlag = false;
  submitted = false;
  TransitionAccName: any;
  show : any;
  dataSource = new MatTableDataSource<any>();
  dtlist = new MatTableDataSource<any>();
  weekenddtlist = [];
  sevenKeyInfo = new MatTableDataSource<any>();
  sevenKeyForm : FormGroup;
  overall_rag : string;
  trend_as :string;
  summary_for_program : string;
  current_week_progress : string;
  next_week_plan : string;
  scope_color : string;
  scope_comment : string;
  team_color : string;
  team_comment : string;
  risk_color : string;
  risk_comment : string;
  org_color : string;
  org_comment : string;
  work_color : string;
  work_comment : string;
  business_color : string;
  business_comment : string;
  financial_color : string;
  financial_comment : string;
  dataLength: number;
  key1: any;
  baseURL: string;
  viewflag: string;
  FlagHide: string;
  private colorcode = [];
  public formErrors = {
    overall_rag: '',
    trend_as: '',
    summary_for_program: ''
  };
  sort: MatSort;
  WeekEndDate: any;
   
  constructor(public dialog: MatDialog,private activatedRoute : ActivatedRoute,private navigation: NavtntService,private _service : SevenKeyModuleService,private fb : FormBuilder,private toastr : ToastrService,public Form_Service: ServiceForm,public datepipe: DatePipe) {
    this.dataLength = 0;
  this.recordSubscriptionFlag = 0;
  this.loadparamsSubscriptionFlag = 0;
    this.sevenKeyForm =  this.fb.group ({       
      IntegrationID:[''],
      Usr_name : [''],
      week_end_dt : [''],
      EndofWeek : [''],
      overall_rag : ['', [Validators.required]],
      trend_as : ['', [Validators.required]],
      summary_for_program : ['', [Validators.required]],
      current_week_progress : [''],
      next_week_plan : [''],
      scope_color : [''],
      key1 : [''],
      scope_comment : [''],
      team_color : [''],
      team_comment : [''],
      risk_color : [''],
      risk_comment : [''],
      org_color : [''],
      org_comment : [''],
      work_color : [''],
      work_comment : [''],
      business_color : [''],
      business_comment : [''],
      financial_color : [''],
      financial_comment : [''],
      last_modified_by : [''],
      last_modified_on : ['']
    });
  }

  exportAsPPT(){
    if(this.sevenKeyForm.touched !== true || this.FlagHide === 'Yes'){
    var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
    var index = this.weekenddtlist.indexOf(this.sevenKeyForm.controls['week_end_dt'].value);  
    this.baseURL = environment.baseUrl
    this._service.exportAsPPT(this.user_name,this.weekenddtlist[index-1], this.sevenKeyForm.controls['week_end_dt'].value,this.Integration_ID,'7 Keys Report-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
    window.open(this.baseURL+'/ExportkeyPPT/'+this.user_name+'/'+this.weekenddtlist[index-1]+'/'+this.sevenKeyForm.controls['week_end_dt'].value+'/'+this.Integration_ID+'/'+'7 Keys Report-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
  }else{
    this.toastr.warning('Please save the form before generating the Report.');
    return false;
  }
}

  WSRPPT(){
    if(this.sevenKeyForm.touched !== true || this.FlagHide === 'Yes'){
    var Ttoday =  this.datepipe.transform(new Date(), 'ddMMMyyyy');
    var index = this.weekenddtlist.indexOf(this.sevenKeyForm.controls['week_end_dt'].value);  
    this.baseURL = environment.baseUrl
    this._service.WSRPPT(this.user_name,this.weekenddtlist[index-1], this.sevenKeyForm.controls['week_end_dt'].value,this.Integration_ID,'WSR Report-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
    window.open(this.baseURL+'/WSRPPT/'+this.user_name+'/'+this.weekenddtlist[index-1]+'/'+this.sevenKeyForm.controls['week_end_dt'].value+'/'+this.Integration_ID+'/'+'WSR Report-'+this.TransitionAccName+'-'+Ttoday+'.pptx');
   }else{
    this.toastr.warning('Please save the form before generating the Report.');
    return false;
   }
   
  }
  
  openKeyRisks() {  

    this.dialog.open(KeyRisksDialog, {
      data: {
        IntegrationID : this.Integration_ID,
        username : this.user_name,
        end_of_week : this.sevenKeyForm.controls['week_end_dt'].value,
        recordexist : this.record_exist,
        view : this.FlagHide
      }
    });
  }

  openIssues() {   
    this.dialog.open(IssuesDialog, {
      data: {
        IntegrationID : this.Integration_ID,
        username : this.user_name,
        end_of_week : this.sevenKeyForm.controls['week_end_dt'].value,
        recordexist : this.record_exist,
        view : this.FlagHide
      }
    });
  }

  openActions() {   
    this.dialog.open(ActionsDialog, {
      data: {
        IntegrationID : this.Integration_ID,
        username : this.user_name,
        end_of_week : this.sevenKeyForm.controls['week_end_dt'].value,
        recordexist : this.record_exist,
        view : this.FlagHide
      }
    });
  }

  openDependencies() {
    this.dialog.open(DependencyDialog, {
      data: {
        IntegrationID : this.Integration_ID,
        username : this.user_name,
        end_of_week : this.sevenKeyForm.controls['week_end_dt'].value,
        recordexist : this.record_exist,
        view : this.FlagHide
      }
    });
  }

  openDeliverables() {
    this.dialog.open(DeliverablesDialog, {
      data: {
        IntegrationID : this.Integration_ID
      }
    });
  }

  openDetailedSchedule() {
    this.dialog.open(DetailedScheduleDialog, {
      data: {
        IntegrationID : this.Integration_ID
      },
      height: '80%',
    });
  }

  getColor(pos: number,newsetcolor :string) { 
    this.colorcode[pos] = newsetcolor; 
  }

  onSubmit(){   
  }

  hideProfileDiv(event){
    this.show = false;    
  }

  repCheck(){
    this.sevenKeyForm.markAsUntouched();  
  }

  resetFields(){
    this.sevenKeyForm.controls['overall_rag'].setValue('');
    this.sevenKeyForm.controls['trend_as'].setValue('');
    this.sevenKeyForm.controls['summary_for_program'].setValue('');
    this.sevenKeyForm.controls['current_week_progress'].setValue('');
    this.sevenKeyForm.controls['next_week_plan'].setValue('');
    this.sevenKeyForm.controls['scope_color'].setValue('');          
    this.sevenKeyForm.controls['scope_comment'].setValue('');
    this.sevenKeyForm.controls['team_color'].setValue('');
    this.sevenKeyForm.controls['team_comment'].setValue('');
    this.sevenKeyForm.controls['risk_color'].setValue('');
    this.sevenKeyForm.controls['risk_comment'].setValue('');
    this.sevenKeyForm.controls['org_color'].setValue('');
    this.sevenKeyForm.controls['org_comment'].setValue('');
    this.sevenKeyForm.controls['work_color'].setValue('');
    this.sevenKeyForm.controls['work_comment'].setValue('');
    this.sevenKeyForm.controls['business_color'].setValue('');            
    this.sevenKeyForm.controls['business_comment'].setValue('');
    this.sevenKeyForm.controls['financial_color'].setValue('');
    this.sevenKeyForm.controls['financial_comment'].setValue(''); 
    this.sevenKeyForm.controls['last_modified_by'].setValue('');
    this.sevenKeyForm.controls['last_modified_on'].setValue('');

    this.colorcode[0] = null;
    this.colorcode[1] = null;
    this.colorcode[2] = null;
    this.colorcode[3] = null;
    this.colorcode[4] = null;
    this.colorcode[5] = null;
    this.colorcode[6] = null;
    this.colorcode[7] = null;
  }

  fetchSevenKey(){
   
    this.show = true;
    this.sevenKeyForm.controls['EndofWeek'].setValue(this.sevenKeyForm.controls['week_end_dt'].value);
    //To check whether Data exist or not
    this.recordSubscription = this._service.recordExist(this.sevenKeyForm.value).subscribe(res=>{      
      this.recordSubscriptionFlag = 1;
      this.dataSource.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
      console.log("record exist from profile="+this.dataSource.data[0].result); 
      this.record_exist = this.dataSource.data[0].result;
      // If Record Exist , then Update Existing record
      if(this.record_exist>=1){
        this.loadparamsSubscription = this._service.loadSevenKeyProfile(this.sevenKeyForm.value).subscribe(res=>{      
          this.loadparamsSubscriptionFlag = 1
          this.sevenKeyInfo = res;  
          this.colorcode[0] = this.sevenKeyInfo[0].overall_rag
          this.colorcode[1] = this.sevenKeyInfo[0].scope_color
          this.colorcode[2] = this.sevenKeyInfo[0].team_color
          this.colorcode[3] = this.sevenKeyInfo[0].risk_color
          this.colorcode[4] = this.sevenKeyInfo[0].organization_color
          this.colorcode[5] = this.sevenKeyInfo[0].work_color
          this.colorcode[6] = this.sevenKeyInfo[0].business_color
          this.colorcode[7] = this.sevenKeyInfo[0].financial_color
          
          this.sevenKeyForm.controls['overall_rag'].setValue(this.sevenKeyInfo[0].overall_rag);
          this.sevenKeyForm.controls['trend_as'].setValue(this.sevenKeyInfo[0].trend_as);
          this.sevenKeyForm.controls['summary_for_program'].setValue(this.sevenKeyInfo[0].summary_for_program);
          this.sevenKeyForm.controls['current_week_progress'].setValue(this.sevenKeyInfo[0].current_week_program);
          this.sevenKeyForm.controls['next_week_plan'].setValue(this.sevenKeyInfo[0].next_week_plan);
          this.sevenKeyForm.controls['scope_color'].setValue(this.sevenKeyInfo[0].scope_color);          
          this.sevenKeyForm.controls['scope_comment'].setValue(this.sevenKeyInfo[0].scope_comment);
          this.sevenKeyForm.controls['team_color'].setValue(this.sevenKeyInfo[0].team_color);
          this.sevenKeyForm.controls['team_comment'].setValue(this.sevenKeyInfo[0].team_comment);
          this.sevenKeyForm.controls['risk_color'].setValue(this.sevenKeyInfo[0].risk_color);
          this.sevenKeyForm.controls['risk_comment'].setValue(this.sevenKeyInfo[0].risk_comment);
          this.sevenKeyForm.controls['org_color'].setValue(this.sevenKeyInfo[0].organization_color);
          this.sevenKeyForm.controls['org_comment'].setValue(this.sevenKeyInfo[0].organization_comment);
          this.sevenKeyForm.controls['work_color'].setValue(this.sevenKeyInfo[0].work_color);
          this.sevenKeyForm.controls['work_comment'].setValue(this.sevenKeyInfo[0].work_comment);
          this.sevenKeyForm.controls['business_color'].setValue(this.sevenKeyInfo[0].business_color);            
          this.sevenKeyForm.controls['business_comment'].setValue(this.sevenKeyInfo[0].business_comment);
          this.sevenKeyForm.controls['financial_color'].setValue(this.sevenKeyInfo[0].financial_color);
          this.sevenKeyForm.controls['financial_comment'].setValue(this.sevenKeyInfo[0].financial_comment); 
          this.sevenKeyForm.controls['last_modified_by'].setValue(this.sevenKeyInfo[0].Modified_by);
          var lasted_modified_dt=moment(this.sevenKeyInfo[0].Modified_date).format("YYYY-MM-DD");
          this.sevenKeyForm.controls['last_modified_on'].setValue(lasted_modified_dt);

          this.sevenKeyForm.markAsUntouched(); 
          
        }, (err : HttpErrorResponse)=>{
          if(err.error instanceof Error ){
            console.log("Client Side Error.");
          }
          else{
            this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
            console.log("Server Side Error.");
          }
        })        
      }
      else{
        this.resetFields();
      }
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.');
      }
    });              
  }

  // right before we submit our form to the server we check if the form is valid
  // if not, we pass the form to the validateform function again. Now with check dirty false
  // this means we check every form field independent of wether it's touched

  buildForm() {
    this.Form_Service.markFormGroupTouched(this.sevenKeyForm);
    if (this.sevenKeyForm.valid) {
    } else {
      this.toastr.warning('Please fill all mandatory fields.');
      this.formErrors = this.Form_Service.validateForm(this.sevenKeyForm, this.formErrors, false);      
    }
    this.sevenKeyForm.valueChanges.subscribe((data) => {
      this.formErrors = this.Form_Service.validateForm(this.sevenKeyForm, this.formErrors, true);
    });
  }

  saveSevenKey(){
    console.log(this.sevenKeyForm.value) 
    this.savedFlag = true;
    this.buildForm();
    if (this.sevenKeyForm.invalid) {
      return;
    }
    // If Record Exist , then Update Existing record
    console.log("this.record_exist="+this.record_exist);
    if(this.record_exist>=1){
      this.saveSubscription = this._service.updateSevenKeyProfile(this.sevenKeyForm.value).subscribe(res=>{      
        if (res.save === "Success"){
          this.toastr.success('Updated Succcessfully','Seven Key')
          this.fetchSevenKey(); 
        }else
        {
          this.toastr.error('Update Fail','Seven Key')
        }  
      }, (err : HttpErrorResponse)=>{
        if(err.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Update Existing record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
        }
      })        
    }
    // If Record does not Exist , then Insert New record
    else if(this.record_exist==0){
      this.saveSubscription = this._service.insertSevenKeyProfile(this.sevenKeyForm.value).subscribe(res=>{      
        if (res.save === "Success"){
          this.toastr.success('Inserted Succcessfully','Seven Key')
          this.fetchSevenKey(); 
        }else{
          this.toastr.error('Insert Fail','Seven Key')
        }  
      }, (err : HttpErrorResponse)=>{
        if(err.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Add new record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Insert Add new record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
        }
      }) 
    } 
  }
  
  ngOnInit(){
   
    this.user_name = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.user_name = decodeURIComponent(this.user_name._value);

    this.TransitionAccName = JSON.parse(sessionStorage.getItem('ACCOUNTClientName'));
    this.TransitionAccName = decodeURIComponent(this.TransitionAccName._value);

    this.activatedRoute.queryParams.subscribe((respar: any) => {
      if (respar.filter) {
        this.viewflag = this.navigation.getParameterValue(respar.filter, 'ViewFlag')
        if (this.navigation.getParameterValue(respar.filter, 'ViewFlag') === 'Yes') {
          //this.TransitionProfileForm.disable();
          this.FlagHide = 'Yes';          
        }
        else {
          this.FlagHide = 'No';
        }
        console.log("this.FlagHide="+this.FlagHide);
      }
    });

    this.activatedRoute.queryParams.subscribe((res: any) => {    
      if (res.filter){        
          this.Integration_ID = this.navigation.getParameterValue(res.filter, 'Id')
      }
    });
   
    var weekend_diff = 5 - moment().day();
    var endOfWeek;
    if(weekend_diff >= 0){
      endOfWeek   = moment().add(weekend_diff , 'days').format("YYYY-MM-DD") ;
      console.log("end date ="+endOfWeek);
    }
    this.weekend_date = endOfWeek;

    this.sevenKeyForm.controls['Usr_name'].setValue(this.user_name);
    this.sevenKeyForm.controls['IntegrationID'].setValue(this.Integration_ID)
    console.log("this.data.IntegrationID="+this.Integration_ID +"|"+ this.user_name);

    //To fetch list of Week end date list for Integration id
    this.loadparamsSubscription = this._service.listofweekenddt(this.Integration_ID).subscribe(res=>{
      this.dtlist.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dtlist.data.length;
      console.log("week end dt list="+this.dtlist.data+"|"+this.dataLength+"|"+this.weekenddtlist.length);

      for (var i = 0; i < this.dataLength; i++) {         
        this.weekenddtlist.push(moment(this.dtlist.data[i].weekend_date).format("YYYY-MM-DD"));
      }

      if(this.dataLength != 0){
        if(moment(this.dtlist.data[this.dataLength-1].weekend_date).format("YYYY-MM-DD")!=this.weekend_date){
          this.weekenddtlist.push(this.weekend_date);
        }
      }
      else
        this.weekenddtlist.push(this.weekend_date);
      },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.');
      }
    }); 
    this.dtlist.sort = this.sort; 
  }

  ngOnDestroy() {
    if(this.loadparamsSubscriptionFlag ===1){
      this.loadparamsSubscription.unsubscribe();
    }    
    // this.recordSubscription.unsubscribe();
    if(this.recordSubscriptionFlag === 1){
      this.recordSubscription.unsubscribe();
    }


    if (this.savedFlag === true )
      this.saveSubscription.unsubscribe();
  }
}

@Component({
  selector: 'key-risks',
  templateUrl: 'key-risks-dialog.html',
})
export class KeyRisksDialog{

  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private recordSubscription: Subscription;
  private savedFlag = false;
  private loadFlag = false;
  private updateFlag = false;
  

  dataSource = new MatTableDataSource<any>();
  dataSource1 = new MatTableDataSource<any>();
  keyriskInfo = new MatTableDataSource<any>();
  dataLength: number;
  temp : any;
  index :number;
  KeyRisksForm : FormGroup; 
  FlagHide : any;
    
  displayedColumns: string[] = ['RaidID', 'Description', 'Risk Type', 'Status', 'Owner', 'TargetDate', 'RaisedDate', 'Priority'];
  @ViewChild(MatSort) sort: MatSort;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private _service : SevenKeyModuleService,private fb : FormBuilder,private toastr : ToastrService) {
    this.dataLength = 0;
    this.KeyRisksForm =  this.fb.group ({ 
      RaidID : this.fb.array([]),         
      IntegrationID:[''],
      Usr_name : [''],
      Type : [''],
      EndofWeek : [''] 
    });
  }
  ngOnInit() {
      this.KeyRisksForm.controls['Usr_name'].setValue( this.data.username);
      this.KeyRisksForm.controls['IntegrationID'].setValue(this.data.IntegrationID)
      this.KeyRisksForm.controls['Type'].setValue('Risk')
      this.KeyRisksForm.controls['EndofWeek'].setValue(this.data.end_of_week)
      this.FlagHide = this.data.view
     // console.log("this.data.IntegrationID="+this.data.IntegrationID +"|"+ this.data.username+"|"+this.data.end_of_week+"|"+this.data.recordexist+"|"+this.data.view);
      this.loadData(); 
      this.dataSource.sort = this.sort;
  }

  loadData(){
    //riskArray :any;
    this.recordSubscription = this._service.loadSevenKeyData(this.data.IntegrationID,'Risk').subscribe(res=>{
      this.dataSource.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
      let arr = [];this.index=0;
      console.log("from risk="+this.dataLength+"this.data.recordexist="+this.data.recordexist);
    //To check whether Data exist or not
      if(this.data.recordexist>=1){
        this.loadFlag = true;
        this.loadparamsSubscription = this._service.loadSevenKeyProfile(this.KeyRisksForm.value).subscribe(res=>{      
          this.keyriskInfo = res; 
          //Setting Flag if Raid id is already saved
          this.index=0;
          arr = [];

          if(this.keyriskInfo[0].Risk != null && this.keyriskInfo[0].Risk != ''){
            console.log("risk checkbox val="+this.keyriskInfo[0].Risk);
            arr = this.keyriskInfo[0].Risk.split(',');
          }

      //Testing whether Raid id is already present or not
      for (let entry of this.dataSource.data) {            
        this.temp = false;
        for (var i = 0; i < arr.length; i++){
          if(arr[i] == entry.RaidID){
            this.temp = true;
            break;
          }
        }
        console.log("Raid ID="+entry.RaidID+" present="+this.temp);
        this.dataSource.data[this.index++].IntegrationID = this.temp; 
        if(this.temp){
          const raidIDFormArray = <FormArray>this.KeyRisksForm.controls.RaidID;
          let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
          if(indx < 0)
            raidIDFormArray.push(new FormControl(entry.RaidID));
        }
      } 

        }, (err : HttpErrorResponse)=>{
          if(err.error instanceof Error ){
            console.log("Client Side Error.");
          }
          else{
            this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
            console.log("Server Side Error.");
          }
        })        
      } 
      else{
      //Testing whether Raid id is already present or not
        for (let entry of this.dataSource.data) {            
          this.temp = false;
          for (var i = 0; i < arr.length; i++){
            if(arr[i] == entry.RaidID){
              this.temp = true;
              break;
            }
          }
          console.log("Raid ID="+entry.RaidID+" present="+this.temp);
          this.dataSource.data[this.index++].IntegrationID = this.temp; 
          if(this.temp){
            const raidIDFormArray = <FormArray>this.KeyRisksForm.controls.RaidID;
            let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
            if(indx < 0)
              raidIDFormArray.push(new FormControl(entry.RaidID));
          }
        } 
      }       
      console.log(this.dataLength);     
      },(err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client Sider Error.');
          } else {console.log('Server Sider Error.');
        }
    });  
  }

  //Managing List of Checked value of Risk
  onChange(raid:string, isChecked: any) {
    const raidIDFormArray = <FormArray>this.KeyRisksForm.controls.RaidID;
  
    if(isChecked.checked) {
      raidIDFormArray.push(new FormControl(raid));
    } else {
      let index = raidIDFormArray.controls.findIndex(x => x.value == raid)
      if(index >= 0)
        raidIDFormArray.removeAt(index);
    }
    this.updateFlag = true;
    console.log("checked val="+raidIDFormArray.value+" || updateFlag="+this.updateFlag);
  }

  saveRisk(){
    console.log(this.KeyRisksForm.value)   
    // If Record Exist , then Update Existing record
    if(this.data.recordexist>=1){
      this.saveSubscription = this._service.updateSevenKey(this.KeyRisksForm.value).subscribe(res=>{ 
        this.savedFlag = true;     
        if (res.save === "Success"){
          this.toastr.success('Updated Succcessfully','KeyRisk')
          this.loadData(); 
        }else
        {
          this.toastr.error('Update Fail','KeyRisk')
        }  
      }, (err : HttpErrorResponse)=>{
        if(err.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Update Existing record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
        }
      })        
    }
    // If Record does not Exist , then Insert New record
    else if(this.data.recordexist==0){
      this.toastr.error('Please Fill Mandatory Fields in Weekly Transition Review Screen 1st');
    }
  }

  ngOnDestroy() {

    if (this.loadFlag === true)
      this.loadparamsSubscription.unsubscribe();

    if (this.savedFlag === true)
      this.saveSubscription.unsubscribe();

    this.recordSubscription.unsubscribe();
  }
}

@Component({
  selector: 'issue',
  templateUrl: 'issue-dialog.html',
})
export class IssuesDialog{

  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private recordSubscription: Subscription;
  private savedFlag = false;
  private loadFlag = false;
  private updateFlag = false;
  dataSource = new MatTableDataSource<any>();
  issueInfo = new MatTableDataSource<any>();
  temp : any;
  index :number;
  dataLength: number;
  issueForm : FormGroup; 
  FlagHide : any; 

  displayedColumns: string[] = ['RaidID', 'Description', 'Issue Type', 'Status', 'Owner', 'TargetDate', 'RaisedDate', 'Priority'];
  @ViewChild(MatSort) sort: MatSort;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private _service : SevenKeyModuleService,private fb : FormBuilder,private toastr : ToastrService) {
    this.dataLength = 0;
    this.issueForm =  this.fb.group ({ 
      RaidID : this.fb.array([]),         
      IntegrationID:[''],
      Usr_name : [''],
      Type : [''],
      EndofWeek : [''] 
    });
  }
  ngOnInit() {
    this.issueForm.controls['Usr_name'].setValue( this.data.username);
    this.issueForm.controls['IntegrationID'].setValue(this.data.IntegrationID)
    this.issueForm.controls['Type'].setValue('Issue')
    this.issueForm.controls['EndofWeek'].setValue(this.data.end_of_week)
    this.FlagHide = this.data.view
   // console.log("this.data.IntegrationID="+this.data.IntegrationID +"|"+ this.data.username+"|"+this.data.end_of_week);
    this.loadData();
    this.dataSource.sort = this.sort; 
  }

  loadData(){
    this.recordSubscription = this._service.loadSevenKeyData(this.data.IntegrationID,'Issue').subscribe(res=>{
      this.dataSource.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
      this.index=0;
      let arr = [];
    //  console.log(this.dataLength);
      
      if(this.data.recordexist>=1){
        this.loadFlag = true;
        this.loadparamsSubscription = this._service.loadSevenKeyProfile(this.issueForm.value).subscribe(res=>{      
          this.issueInfo = res; 
          
          //Setting Flag if Raid id is already saved
          this.index=0;
          arr = [];
          if(this.issueInfo[0].Issue != null && this.issueInfo[0].Issue != ''){
            console.log("issue checkbox val="+this.issueInfo[0].Issue);
            arr = this.issueInfo[0].Issue.split(',');
          }

          //Testing whether Raid id is already present or not
          for (let entry of this.dataSource.data) {
            
            this.temp = false;
            for (var i = 0; i < arr.length; i++){
              if(arr[i] == entry.RaidID){
                this.temp = true;
                break;
              }
            }
            console.log("Raid ID="+entry.RaidID+" present="+this.temp);
            this.dataSource.data[this.index++].IntegrationID = this.temp; 
            if(this.temp){
              const raidIDFormArray = <FormArray>this.issueForm.controls.RaidID;
              let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
              if(indx < 0)
                raidIDFormArray.push(new FormControl(entry.RaidID));
            }
          }        
        }, (err : HttpErrorResponse)=>{
          if(err.error instanceof Error ){
            console.log("Client Side Error.");
          }
          else{
            this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
            console.log("Server Side Error.");
          }
        })        
      } 
      else{
        //Testing whether Raid id is already present or not
          for (let entry of this.dataSource.data) {            
            this.temp = false;
            for (var i = 0; i < arr.length; i++){
              if(arr[i] == entry.RaidID){
                this.temp = true;
                break;
              }
            }
            console.log("Raid ID="+entry.RaidID+" present="+this.temp);
            this.dataSource.data[this.index++].IntegrationID = this.temp; 
            if(this.temp){
              const raidIDFormArray = <FormArray>this.issueForm.controls.RaidID;
              let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
              if(indx < 0)
                raidIDFormArray.push(new FormControl(entry.RaidID));
            }
          } 
        }  
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.');
      }
    });  
  }

  //Managing List of Checked value of Issue
  onChange(raid :String, isChecked: any) { 

    const raidIDFormArray = <FormArray>this.issueForm.controls.RaidID;

    if(isChecked.checked) {
      raidIDFormArray.push(new FormControl(raid));
    } else {
      let index = raidIDFormArray.controls.findIndex(x => x.value == raid)
      if(index >= 0)
        raidIDFormArray.removeAt(index);
    }
    this.updateFlag = true;
    console.log(raidIDFormArray.value);
  }

  saveIssue(){
   // console.log(this.issueForm.value)

    // If Record Exist , then Update Existing record
    if(this.data.recordexist>=1){
      this.saveSubscription = this._service.updateSevenKey(this.issueForm.value).subscribe(res=>{      
        this.savedFlag = true;
        if (res.save === "Success"){
          this.toastr.success('Updated Succcessfully','Issue')
          this.loadData(); 
        }else
        {
          this.toastr.error('Update Fail','Issue')
        }  
      }, (err : HttpErrorResponse)=>{
        if(err.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Update Existing record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
        }
      })        
    }
    // If Record does not Exist , then Insert New record
    else if(this.data.recordexist==0){
      this.toastr.error('Please Fill Mandatory Fields in Weekly Transition Review Screen 1st');
    } 
  }

  ngOnDestroy() {

    if (this.loadFlag === true)
      this.loadparamsSubscription.unsubscribe();

    this.recordSubscription.unsubscribe();

    if (this.savedFlag === true )
      this.saveSubscription.unsubscribe();
  }
}

@Component({
  selector: 'action',
  templateUrl: 'action-dialog.html',
})
export class ActionsDialog{

  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private recordSubscription: Subscription;
  private savedFlag = false;
  private loadFlag = false;
  private updateFlag = false;
  dataSource = new MatTableDataSource<any>();
  actionInfo = new MatTableDataSource<any>();
  temp : any;
  index :number;
  dataLength: number;
  actionForm : FormGroup; 
  FlagHide : any; 

  displayedColumns: string[] = ['RaidID', 'Description', 'Action Type', 'Status', 'Owner', 'TargetDate', 'RaisedDate', 'Priority'];
  @ViewChild(MatSort) sort: MatSort;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private _service : SevenKeyModuleService,private fb : FormBuilder,private toastr : ToastrService) {
    this.dataLength = 0;
    this.actionForm =  this.fb.group ({ 
      RaidID : this.fb.array([]),         
      IntegrationID:[''],
      Usr_name : [''],
      Type : [''],
      EndofWeek : [''] 
    });
  }
  ngOnInit() {
    this.actionForm.controls['Usr_name'].setValue( this.data.username);
    this.actionForm.controls['IntegrationID'].setValue(this.data.IntegrationID)
    this.actionForm.controls['Type'].setValue('Action')
    this.actionForm.controls['EndofWeek'].setValue(this.data.end_of_week)
    this.FlagHide = this.data.view
   // console.log("this.data.IntegrationID="+this.data.IntegrationID +"|"+ this.data.username+"|"+this.data.end_of_week);
    this.loadData();
    this.dataSource.sort = this.sort;
  }

  loadData(){
    this.recordSubscription = this._service.loadSevenKeyData(this.data.IntegrationID,'Action').subscribe(res=>{
      this.dataSource.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
      this.index=0;
      let arr = [];
      console.log(this.dataLength);
      
      if(this.data.recordexist>=1){
        this.loadFlag = true;
        this.loadparamsSubscription = this._service.loadSevenKeyProfile(this.actionForm.value).subscribe(res=>{      
          this.actionInfo = res; 
          
          //Setting Flag if Raid id is already saved
          this.index=0;
          arr = [];
          if(this.actionInfo[0].Action != null && this.actionInfo[0].Action != ''){
            console.log("Action checkbox val="+this.actionInfo[0].Action);
            arr = this.actionInfo[0].Action.split(',');
          }

          //Testing whether Raid id is already present or not
          for (let entry of this.dataSource.data) {
            
            this.temp = false;
            for (var i = 0; i < arr.length; i++){
              if(arr[i] == entry.RaidID){
                this.temp = true;
                break;
              }
            }
            console.log("Raid ID="+entry.RaidID+" present="+this.temp);
            this.dataSource.data[this.index++].IntegrationID = this.temp; 
            if(this.temp){
              const raidIDFormArray = <FormArray>this.actionForm.controls.RaidID;
              let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
              if(indx < 0)
                raidIDFormArray.push(new FormControl(entry.RaidID));
            }
          }        
        }, (err : HttpErrorResponse)=>{
          if(err.error instanceof Error ){
            console.log("Client Side Error.");
          }
          else{
            this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
            console.log("Server Side Error.");
          }
        })        
      } 
      else{
        //Testing whether Raid id is already present or not
          for (let entry of this.dataSource.data) {            
            this.temp = false;
            for (var i = 0; i < arr.length; i++){
              if(arr[i] == entry.RaidID){
                this.temp = true;
                break;
              }
            }
            console.log("Raid ID="+entry.RaidID+" present="+this.temp);
            this.dataSource.data[this.index++].IntegrationID = this.temp; 
            if(this.temp){
              const raidIDFormArray = <FormArray>this.actionForm.controls.RaidID;
              let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
              if(indx < 0)
                raidIDFormArray.push(new FormControl(entry.RaidID));
            }
          } 
        } 
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.');
      }
    });  
  }

  //Managing List of Checked value of Issue
  onChange(raid :String, isChecked: any) { 

    const raidIDFormArray = <FormArray>this.actionForm.controls.RaidID;

    if(isChecked.checked) {
      raidIDFormArray.push(new FormControl(raid));
    } else {
      let index = raidIDFormArray.controls.findIndex(x => x.value == raid)
      if(index >= 0)
        raidIDFormArray.removeAt(index);
    }
    this.updateFlag = true;
    console.log(raidIDFormArray.value);
  }

  saveAction(){
    console.log(this.actionForm.value)

    // If Record Exist , then Update Existing record
    if(this.data.recordexist>=1){
      this.saveSubscription = this._service.updateSevenKey(this.actionForm.value).subscribe(res=>{      
        this.savedFlag = true;
        if (res.save === "Success"){
          this.toastr.success('Updated Succcessfully','Action')
          this.loadData(); 
        }else
        {
          this.toastr.error('Update Fail','Action')
        }  
      }, (err : HttpErrorResponse)=>{
        if(err.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Update Existing record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
        }
      })        
    }
    // If Record does not Exist , then Insert New record
    else if(this.data.recordexist==0){
      this.toastr.error('Please Fill Mandatory Fields in Weekly Transition Review Screen 1st');
    } 
  }
  ngOnDestroy() {

    if (this.loadFlag === true)
      this.loadparamsSubscription.unsubscribe();
    this.recordSubscription.unsubscribe();

    if (this.savedFlag === true )
      this.saveSubscription.unsubscribe();
  }
}

@Component({
  selector: 'dependencies',
  templateUrl: 'dependencies-dialog.html',
})
export class DependencyDialog {

  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private recordSubscription: Subscription;
  private savedFlag = false;
  private loadFlag = false;
  private updateFlag = false;
  dataSource = new MatTableDataSource<any>();
  dependencyInfo = new MatTableDataSource<any>();
  temp : any;
  index :number;
  dataLength: number;
  dependencyForm : FormGroup;
  FlagHide : any;
    
  displayedColumns: string[] = ['RaidID', 'Description', 'Dependency Type', 'Status', 'Owner', 'TargetDate', 'RaisedDate', 'Priority'];
  @ViewChild(MatSort) sort: MatSort;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private _service : SevenKeyModuleService,private fb : FormBuilder,private toastr : ToastrService) {
    this.dataLength = 0;
    this.dependencyForm =  this.fb.group ({ 
      RaidID : this.fb.array([]),         
      IntegrationID:[''],
      Usr_name : [''],
      Type : [''],
      EndofWeek : [''] 
    });
  }
  ngOnInit() {
    this.dependencyForm.controls['Usr_name'].setValue( this.data.username);
    this.dependencyForm.controls['IntegrationID'].setValue(this.data.IntegrationID)
    this.dependencyForm.controls['Type'].setValue('Dependency')
    this.dependencyForm.controls['EndofWeek'].setValue(this.data.end_of_week)
    this.FlagHide = this.data.view
   // console.log("this.data.IntegrationID="+this.data.IntegrationID +"|"+ this.data.username+"|"+this.data.end_of_week);
    this.loadData();
    this.dataSource.sort = this.sort;
  }

  loadData(){
    this.recordSubscription = this._service.loadSevenKeyData(this.data.IntegrationID,'Dependency').subscribe(res=>{
      this.dataSource.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
      this.index=0;
      let arr = [];
      console.log(this.dataLength);
      
      if(this.data.recordexist>=1){
        this.loadFlag = true;
        this.loadparamsSubscription = this._service.loadSevenKeyProfile(this.dependencyForm.value).subscribe(res=>{      
          this.dependencyInfo = res; 
          
          //Setting Flag if Raid id is already saved
          this.index=0;
          arr = [];

          if(this.dependencyInfo[0].Dependency != null && this.dependencyInfo[0].Dependency != ''){
            console.log("depen checkbox val="+this.dependencyInfo[0].Dependency);
            arr = this.dependencyInfo[0].Dependency.split(',');
          }

          //Testing whether Raid id is already present or not
          for (let entry of this.dataSource.data) {
            
            this.temp = false;
            for (var i = 0; i < arr.length; i++){
              if(arr[i] == entry.RaidID){
                this.temp = true;
                break;
              }
            }
            console.log("Raid ID="+entry.RaidID+" present="+this.temp);
            this.dataSource.data[this.index++].IntegrationID = this.temp; 
            if(this.temp){
              const raidIDFormArray = <FormArray>this.dependencyForm.controls.RaidID;
              let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
              if(indx < 0)
                raidIDFormArray.push(new FormControl(entry.RaidID));
            }
        }        
        }, (err : HttpErrorResponse)=>{
          if(err.error instanceof Error ){
            console.log("Client Side Error.");
          }
          else{
            this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
            console.log("Server Side Error.");
          }
        })        
      }
      else{
        //Testing whether Raid id is already present or not
          for (let entry of this.dataSource.data) {            
            this.temp = false;
            for (var i = 0; i < arr.length; i++){
              if(arr[i] == entry.RaidID){
                this.temp = true;
                break;
              }
            }
            console.log("Raid ID="+entry.RaidID+" present="+this.temp);
            this.dataSource.data[this.index++].IntegrationID = this.temp; 
            if(this.temp){
              const raidIDFormArray = <FormArray>this.dependencyForm.controls.RaidID;
              let indx = raidIDFormArray.controls.findIndex(x => x.value == entry.RaidID)
              if(indx < 0)
                raidIDFormArray.push(new FormControl(entry.RaidID));
            }
          } 
        }  
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.');
      }
    }); 
  }

  //Managing List of Checked value of Dependency
  onChange(raid :String, isChecked: any) { 

    const raidIDFormArray = <FormArray>this.dependencyForm.controls.RaidID;

    if(isChecked.checked) {
      raidIDFormArray.push(new FormControl(raid));
    } else {
      let index = raidIDFormArray.controls.findIndex(x => x.value == raid)
      if(index >= 0)
        raidIDFormArray.removeAt(index);
    }
    this.updateFlag = true;
    console.log(raidIDFormArray.value);
  }

  saveDependency(){
    console.log("dependency log ="+this.dependencyForm.value)
    
    // If Record Exist , then Update Existing record
    if(this.data.recordexist>=1){
      this.saveSubscription = this._service.updateSevenKey(this.dependencyForm.value).subscribe(res=>{      
        this.savedFlag = true;
        if (res.save === "Success"){
          this.toastr.success('Updated Succcessfully','Dependency')
          this.loadData(); 
        }else
        {
          this.toastr.error('Update Fail','Dependency')
        }  
      }, (err : HttpErrorResponse)=>{
        if(err.error instanceof Error ){
          console.log("Client Side Error.");
          this.toastr.error('Client side Update Existing record Error','ttstoolssupport@in.ibm.com')
        }
        else{
          this.toastr.error('Server Update Existing record Error','ttstoolssupport@in.ibm.com')
          console.log("Server Side Error.");
        }
      })        
    }
    // If Record does not Exist , then Insert New record
    else if(this.data.recordexist==0){
      this.toastr.error('Please Fill Mandatory Fields in Weekly Transition Review Screen 1st');
    }  
  }
  ngOnDestroy() {

    if (this.loadFlag === true)
      this.loadparamsSubscription.unsubscribe();
    this.recordSubscription.unsubscribe();

    if (this.savedFlag === true )
      this.saveSubscription.unsubscribe();
  }
}

@Component({
  selector: 'deliverables',
  templateUrl: 'deliverables-dialog.html',
})
export class DeliverablesDialog {

  private loadparamsSubscription: Subscription;
  dataSource = new MatTableDataSource<any>();
  dataLength: number;

  displayedColumns: string[] = ['DeliverableName', 'DeliverableValues', 'ContractDoc_OwnerNM', 'ContractDeliver_Status', 'ContractDeliver_Comments'];
  @ViewChild(MatSort) sort: MatSort;
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private _service : SevenKeyModuleService) {
    this.dataLength = 0;
  }

  ngOnInit() {
   
    this.loadparamsSubscription = this._service.loadDeliverables(this.data.IntegrationID).subscribe(res=>{
      this.dataSource.data = res;
      this.dataSource.sort = this.sort; 
      this.dataLength = res.length;
      this.dataLength = this.dataSource.data.length;
         
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.');
      }
    }); 
  }

  ngOnDestroy() {   
    this.loadparamsSubscription.unsubscribe();
  }
}

@Component({
  selector: 'detailed-schedule',
  templateUrl: 'detailed-schedule-dialog.html',
})
export class DetailedScheduleDialog {

  private loadparamsSubscription: Subscription;

  dataSource_epic = new MatTableDataSource<any>();
  dataSource_sprint = new MatTableDataSource<any>();
  dataSource_app = new MatTableDataSource<any>();
  dataLength: number;
  Service_Bcklog = [];
  Sprint_Bcklog = [];
  TranClosure = [];
  displayedColumns_app: string[];

  displayedColumns_epic: string[] = ['Epic Name',
  'Plan Start Date','Plan End Date','Replan Start Date','Replan End Date','Actual Start Date','Actual End Date'];

  displayedColumns_sprint: string[] = ['Plan Start Date','Plan End Date','Replan Start Date','Replan End Date','Actual Start Date','Actual End Date'];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private _service : SevenKeyModuleService) {
    this.dataLength = 0;
  }

  ngOnInit() {

    this.loadparamsSubscription = this._service.getEpics(this.data.IntegrationID).subscribe(res=>{
      console.log("schedule="+this.data.IntegrationID);
      this.dataSource_epic.data = res;
      this.dataLength = res.length;
      this.dataLength = this.dataSource_epic.data.length;
        
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.'); 
      }
    }); 
  } 

  getSerBacklogData(){
    this._service.getServiceBcklogData(this.data.IntegrationID).subscribe(Seres=>{
      this.Service_Bcklog=Seres;
    });
  }

  getSpBacklogData(){
    this._service.getSprintBcklogData(this.data.IntegrationID).subscribe(Spres=>{
      this.Sprint_Bcklog=Spres;
    });
  }

  getTranClosureData(){
    this._service.getTranClosureData(this.data.IntegrationID).subscribe(Tres=>{
      this.TranClosure=Tres;
    });
  }

  getSprint(value :any){

    this.loadparamsSubscription = this._service.getSprintbyepic(value).subscribe(res=>{
      this.dataSource_sprint.data = res; 
      this.dataLength = res.length;
      this.dataLength = this.dataSource_sprint.data.length;
      console.log("sprint copy="+this.dataLength);     
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.'); 
      }
    });
  }

  getApp(sprintid :any,scopelevel :any){
  if(scopelevel==="AT"){  
  this.displayedColumns_app = ['Application',
  'Plan Start Date','Plan End Date','Replan Start Date','Replan End Date','Actual Start Date','Actual End Date','Status'];
  }else  if(scopelevel==="ST"){  
    this.displayedColumns_app = ['ST Scope',
    'Plan Start Date','Plan End Date','Replan Start Date','Replan End Date','Actual Start Date','Actual End Date','Status'];
  }else if(scopelevel==="Others"){  
    this.displayedColumns_app = ['Backlog Activity',
    'Plan Start Date','Plan End Date','Replan Start Date','Replan End Date','Actual Start Date','Actual End Date','Status'];
  }

    this.loadparamsSubscription = this._service.getAppbysprint(sprintid,scopelevel).subscribe(res=>{
      this.dataSource_app.data = res; 
      this.dataLength = res.length;
      this.dataLength = this.dataSource_app.data.length;
      console.log(this.dataLength);     
    },(err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {console.log('Server Sider Error.'); 
      }
    });
  }

  ngOnDestroy() {
    this.loadparamsSubscription.unsubscribe();
  }
}