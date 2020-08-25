import { ActivatedRoute } from '@angular/router';
import { Validators, FormGroup, FormBuilder, FormControl,NgForm } from '@angular/forms';
import {RaidAddUpdateService} from './raid-add-update-module/raid-add-update.service';
import { Component, inject,ViewChild,OnInit,OnDestroy,ElementRef,Input } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatRadioChange } from '@angular/material';
import { NavtntService } from './../../navtnt.service';
import { HttpErrorResponse } from "@angular/common/http";
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import 'rxjs/Rx';
import {forkJoin} from 'rxjs';
import { UserNameService } from 'Services/user-name.service';
import { ServiceForm } from 'Services/form';
import { DatePipe } from '@angular/common';

// s.sprintName,s.sprintUNID,s.scopelevel

export interface childNode {
  sprintUNID: string;
  sprintName: string;
}

export interface parentGroup {
  // disabled: true;
  scopelevel: string;
  childgroup: childNode[];
}


@Component({
  selector: 'app-raid-add-update',
  templateUrl: './raid-add-update.component.html',
  styleUrls: ['./raid-add-update.component.css']
})
export class RaidAddUpdateComponent implements OnInit {
  RaidAddUpdateForm: FormGroup;
  public formErrors = {
    Owner: '',
    Status: '',
    Description: '',
    DateRaised: '',
    Resolved: '',
    TargetDate: '',
    Epic:'',
    Sprint:'',
    AppID:'',
    Type:''
   };
  private RaidID : string;
  private Client : string;
  private Sector : string;
  private Industry : string;
  private Flag : string;
  private ViewFlag: string;
  private Epic: string;
  private Sprint: string;
  private AppID: string;
  private epicName : string;
  private sprintName : string;
  private AppName : string;
  // private MasterSTInfoid : string;          
  private Type: string;
  private IntegrationID: string;
  private OwningTTS: string;
  private Description : string;
  private Status: string;
  private Owner : string;
  private TargetDate : string;
  private Priority: string;  
  private OverAllFlag: string;
  // private LevelNames: any;
  private RaidSubscription:Subscription;
  private InsertSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private loadRaidAddUpdate: Subscription;
  private AppselectSubscription: Subscription;
  private SprintselectSubscription: Subscription;
  private RiskselectSubscription: Subscription;
  private localgetProfile :any = '';
  private ResponsePlan :any='';
  private RaidType :any=''; 
  private RaidAddData: any='';
  private RaidInfo :any='';
  private scopeLevel : string = '';
  private scopeText : string = '';
  private scopeOverall : string = '';
  private Scope_UNID : string = '';
  private RaidSprintValues :any='';
  private RaidSprintValues1 :any='';
  private RaidApplData :any='';
  private formEpicValue: any='';
  private ApplArray: any='';
  private RiskProb:any='';
  private RiskInternal:any='';
  private RiskExposure:any='';
  private RiskImpact:any='';
  private ReportingLevel:any='';
  private RiskPriority:any='';
  private RiskStatus:any='';
  private username: any='';
  private RaidShowstopper: any='';  
  private Raid_Levels : any = '';
  private Scope_Level : any ='';
  private MasterRadioFlag : string = 'Yes'
   UpdateFlagUnsubscribe: number=0;
   RiskSelectFlagUnsubscribe: number=0;
   SprintSelectFlagUnsubscribe:number=0;
   AppSelectFlagUnsubscribe:number=0;
   maxDate: Date;
  emailcheck: any;
  Empnamecheck: any;
  DOemailcheck: any;
  DOnamecheck: any;
  count: number;
  radioSelection : string = '';
  MasterRadioSelection : string = '';
  Employee_Name = [];
  DependencyOwner_Name=[];
  myJSON = '';
  @ViewChild('Owner') nameField: ElementRef;
  // RaidLevelsParameters_var: any = '';
  private RaidLevelsParametersSubscription : Subscription;
  ATlist :any ='' ;
  STlist :any  = '';
  OverAlllist :any ='' ;
  customSprintGroup: parentGroup[] = []
  
  dropdownpush(){
  this.customSprintGroup = 
    [
      {
        scopelevel: "AT",
        childgroup: this.ATlist
        
      },
      {
        scopelevel: 'ST',
        childgroup: this.STlist
      },
      {
        scopelevel: 'Others',
        childgroup: this.OverAlllist
      }
    ];
    console.log(this.customSprintGroup)
    
  }

  constructor(
    private toaster: ToastrService,
    private _ser: RaidAddUpdateService,
    private activatedRoute : ActivatedRoute,
    private navigation: NavtntService,
    public Form_Service: ServiceForm,
    private fb: FormBuilder,
    public datepipe: DatePipe, ) {
     this.dropdownpush()
    this.RaidAddUpdateForm = this.fb.group({OverAll:false,
      IntegrationID:[''],
      RaidID:[''],	
      Description:['', [Validators.required]],
      Status:['', [Validators.required]],	
      Owner:['', [Validators.required]],
      TargetDate:['', [Validators.required]],	
      Priority:[''], 
      DateRaised:['', [Validators.required]],
      AppID: ['', [Validators.required]],      
      Epic: ['', [Validators.required]],
      Sprint:['', [Validators.required]],
      Type:['', [Validators.required]],
      AssociatedApplication:[''],
      ImpactConsequences:[''],
      DateLastUpdated:[''],
      ReportedTo:[''],
      RaisedBy:[''],
      Resolved:['', [Validators.required]],
      ClassificationCategory:[''],
      Probability:[''],
      Exposure:[''],
      ReportingLevel:[''],
      RiskResponsePlan:[''],
      ContaintmentApproach:[''],
      IssueNumber:[''],
      DateLaunched:[''],
      AssociatedActionIDs:[''],
      Category:[''],
      Comments:[''],
      Source:[''],
      DateOfEscalation:[''],
      ShowStopper:[''],
      DependencyOwner:[''],
      ActionsToResolve:[''],
      RiskType:[''],
      LastUpdatedBy:[''],
      CurrentUser:[''],
      EpicUNID:[''],
      SprintUNID:[''],
      AppUNID:[''],
      // MasterSTInfoid : [''],
      scopeLevel : [''],
      scopeOverall : [''] ,
      Scope_UNID : ['']
      });
      
   }

          ngOnInit() {
            this.initializeFields();
            this.loadDropdownValues()

            this.maxDate = new Date();
            this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
            this.username = decodeURIComponent(this.username._value);
            this.activatedRoute.queryParams.subscribe((res: any) => {  
              this.Client = this.navigation.getParameterValue(res.filter, 'ClientName');
              this.Sector = this.navigation.getParameterValue(res.filter, 'Sector');
              this.Industry = this.navigation.getParameterValue(res.filter, 'Industry');
              this.Flag = this.navigation.getParameterValue(res.filter, 'Flag') ;
              this.Epic = this.navigation.getParameterValue(res.filter, 'EpicUNID');
              this.Sprint = this.navigation.getParameterValue(res.filter, 'SprintUNID')
              this.AppID = this.navigation.getParameterValue(res.filter, 'AppUNID');
              this.epicName = this.navigation.getParameterValue(res.filter, 'EpicName');
              this.sprintName = this.navigation.getParameterValue(res.filter, 'SprintName')
              this.AppName = this.navigation.getParameterValue(res.filter, 'AppName');
              // this.MasterSTInfoid = this.navigation.getParameterValue(res.filter, 'MasterSTInfoid');
              this.Type = this.navigation.getParameterValue(res.filter, 'Type');
              this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id');
              this.RaidID = this.navigation.getParameterValue(res.filter, 'RaidID') ;
              this.ViewFlag = this.navigation.getParameterValue(res.filter, 'ViewFlag') ;
              this.OwningTTS = this.navigation.getParameterValue(res.filter, 'OwningTTS') ;
              this.scopeLevel = this.navigation.getParameterValue(res.filter, 'scopeLevel') ;
              this.scopeOverall = this.navigation.getParameterValue(res.filter, 'scopeOverall') ;
              this.Scope_UNID = this.navigation.getParameterValue(res.filter, 'Scope_UNID') ;
              if (this.RaidAddUpdateForm.controls['Status'].value === '') {
                this.RaidAddUpdateForm.controls['Status'].setValue('Open')
              this.disableDateResolved('Open')
              }
            
              
              if(this.ViewFlag==='Yes'){
                this.RaidAddUpdateForm.disable();
              }
              
              this.RaidAddUpdateForm.controls['IntegrationID'].setValue(this.IntegrationID);
              this.RaidAddUpdateForm.controls['CurrentUser'].setValue(this.username);     

              if((this.Flag === 'Update')||(this.ViewFlag==='Yes')){
                  this.RaidAddUpdateForm.controls['Type'].setValue(this.Type); 
                  this.RaidAddUpdateForm.controls['AppUNID'].setValue(this.AppID);
                  this.RaidAddUpdateForm.controls['EpicUNID'].setValue(this.Epic);
                  this.RaidAddUpdateForm.controls['SprintUNID'].setValue(this.Sprint);
                  this.RaidAddUpdateForm.controls['RaidID'].setValue(this.RaidID);
                  this.riskUpdate();
                }
              if(this.Flag==='Add'){
                  this.riskAdd();
              }
                this.OverAllFlag="0";

              });
        }

        loadDropdownValues(){   
                this.RaidSubscription = forkJoin([this._ser.getRaidType(),
                  this._ser.getRiskResponsePlan(),
                  this._ser.getRiskProbability(),
                  this._ser.getRiskInternal(),
                  this._ser.getRiskExposure(),
                  this._ser.getRiskImpact(),
                  this._ser.getReportingLevel(),
                  this._ser.getPriority(),
                this._ser.getStatus(),
                this._ser.getShowstopper()]).subscribe((res:any)=>{
              this.RaidType = res[0];
              this.ResponsePlan = res[1];
              this.RiskProb = res[2];
              this.RiskInternal = res[3];
              this.RiskExposure = res[4]
              this.RiskImpact = res[5]
              this.ReportingLevel = res[6];
              this.RiskPriority = res[7];
              this.RiskStatus = res[8];
              this.RaidShowstopper = res[9];                 
              });  
        }   

        initializeFields(){
          this.RaidLevelsParametersSubscription =  this._ser.RaidLevelsParameters().subscribe((res : any) =>{
            this.Raid_Levels = res ;
            //  console.log(this.RaidLevelsParameters_var)
            // this.Raid_Levels = this.RaidLevelsParameters_var
            // this.Scope_Level = this.RaidLevelsParameters_var.filter(Raid_Levels => Raid_Levels.FieldCategoryName ==='Scope Level')
            // console.log(this.Raid_Levels)
            // console.log( this.Scope_Level)
        },(RaidLevelsParametersSubscriptionResponse : HttpErrorResponse)=>{
              if(RaidLevelsParametersSubscriptionResponse.error instanceof Error){
                // console.log("Client Side Error.");
                this.toaster.error('Client side Error', 'ttstoolssupport@in.ibm.com');
                  } else {
                this.toaster.error('Server side Error', 'ttstoolssupport@in.ibm.com');
              //  console.log("Server Side delete Error.");
              }
        }  )
        }

        onChange(event: MatRadioChange){
            this.RaidAddUpdateForm.controls['Epic'].setValue('');
            this.RaidAddUpdateForm.controls['Sprint'].setValue('');
            this.RaidAddUpdateForm.controls['AppID'].setValue(''); 
            this.RaidAddUpdateForm.controls['Type'].enable();   
            this.RaidSprintValues= [];
            this.RaidApplData=[];
            var radioValue = event.value;
            this.radioSelection  = '';
            this.radioSelection  = radioValue;
            
            if(radioValue=='OverAll'){
              this.OverAllFlag = "1";
              this.RaidAddUpdateForm.controls['Epic'].disable();
              this.RaidAddUpdateForm.controls['Sprint'].disable(); 
              this.RaidAddUpdateForm.controls['AppID'].disable();    
            }else if(radioValue=='Epic'){
              this.RaidAddUpdateForm.controls['Epic'].enable();
              this.RaidAddUpdateForm.controls['Sprint'].disable();     
              this.RaidAddUpdateForm.controls['AppID'].disable();     
            }else if(radioValue=='Sprint'){
              this.RaidAddUpdateForm.controls['Epic'].enable();
              this.RaidAddUpdateForm.controls['Sprint'].enable();     
              this.RaidAddUpdateForm.controls['AppID'].disable(); 
            }else if(radioValue=='App'){
              this.RaidAddUpdateForm.controls['Epic'].enable();
              this.RaidAddUpdateForm.controls['Sprint'].enable();     
              this.RaidAddUpdateForm.controls['AppID'].enable();
            } 
            
        }
        riskAdd(){
          this.RiskSelectFlagUnsubscribe = 1;
          this.RaidAddUpdateForm.controls['Epic'].disable();
          this.RaidAddUpdateForm.controls['Sprint'].disable();     
          this.RaidAddUpdateForm.controls['AppID'].disable(); 
          this.RaidAddUpdateForm.controls['Type'].disable();
          this.RiskselectSubscription =  this._ser.getRaidEpic(this.RaidAddUpdateForm.value).subscribe((res)=>{
            this.RaidAddData = res; 
          });
        }
        loadnewSprintValues(){
          console.log("loadnewSprintValues")
          console.log(this.RaidSprintValues)
          this.ATlist = this.RaidSprintValues.filter( at => at.scopelevel === 'AT' );
          this.STlist = this.RaidSprintValues.filter( a => a.scopelevel === 'ST' );
          this.OverAlllist = this.RaidSprintValues.filter( a => a.scopelevel === 'Others' );
          console.log(this.ATlist)
          console.log(this.STlist)
          console.log(this.OverAlllist)
          this.dropdownpush()
        

        }
        SprintSelect(epicUnId){
          this.SprintSelectFlagUnsubscribe = 1;
          this.SprintselectSubscription =  this._ser.getRaidSprint(epicUnId,this.IntegrationID,this.radioSelection).subscribe((res:any)=>{
            this.RaidSprintValues1 = res;
            console.log("this.RaidSprintValues1 = res;")
          },  (err: HttpErrorResponse) => {
            if (err.error instanceof Error) {
                console.log('Client Sider Error.');
            } else {
                console.log('Server Sider Error.');
            }
        },
          ()=>{
            console.log("setTimeout(()=>{")
            this.RaidSprintValues = this.RaidSprintValues1
            this.loadnewSprintValues()            
          } );  
        }
        AppSelect(scopeLevel : string){
          this.scopeText = '';
        this.AppSelectFlagUnsubscribe = 1;
          this.AppselectSubscription = this._ser.getRaidAppl(this.RaidAddUpdateForm.value,scopeLevel).subscribe((res)=>{
            console.log(res.Scope_UNID)             
            this.RaidApplData = res;                 
            this.scopeLevel = scopeLevel;
        });
        console.log(scopeLevel)
        if ( scopeLevel === 'AT'){
          this.scopeText = "Application Name"
        } else if ( scopeLevel === 'ST'){
          this.scopeText = "ST Scope"
        }else if ( scopeLevel === 'Others'){
          this.scopeText = "Others Scope"
        }else {
          this.scopeText = ''
        }
        

        }

        updateSTorAPPID(STorAPPID : string,Scope_UNID : string){  
          console.log(STorAPPID)
          console.log(Scope_UNID)
            this.RaidAddUpdateForm.controls['Scope_UNID'].setValue(Scope_UNID )
          this.RaidAddUpdateForm.controls['scopeLevel'].setValue(this.scopeLevel)
          // if ( this.scopeLevel === 'ST'){       
              // this.RaidAddUpdateForm.controls['MasterSTInfoid'].setValue('');
              // this.RaidAddUpdateForm.controls['MasterSTInfoid'].setValue(STorAPPID) ;
        }

        getEmployeeName(Name: string) {

          this.Employee_Name = [];
          this._ser.getEmployeeDirectory(Name).subscribe(res => {
          this.count = res.body.split('\n').length - 2;
          this.count = res.body.split('\n')[this.count].split(',')[1].split('=')[1];
            for ( let i = 0; i < this.count ; i++) {
              this.emailcheck = res.body.split('\n')[i * 69 + 22].split(':')[1];
              if ((this.emailcheck === '') || (this.emailcheck === undefined) || (this.emailcheck === null)) {
                this.emailcheck = 'No email ID in Bluepages';
              }
              this.Empnamecheck = res.body.split('\n')[i * 69 + 57].split(': ')[1] + res.body.split('\n')[i * 69 + 59].split(':')[1];
              if ((this.Empnamecheck === '') || (this.Empnamecheck === undefined) || (this.Empnamecheck === null)) {
                this.Empnamecheck = res.body.split('\n')[ i * 69 + 12].split(': ')[1];
              }
              const item = {
                'name': res.body.split('\n')[ i * 69 + 12].split(': ')[1],
                'email': this.emailcheck,
                'Emp_Name' : this.Empnamecheck,
                'cnum' : res.body.split('\n')[i * 69 + 0].split(': ')[1],
                'photo' : 'https://w3-services1.w3-969.ibm.com/myw3/unified-profile-photo/v1/image/' + res.body.split('\n')[i * 69 + 0].split(': ')[1]
              };
                  this.Employee_Name.push(item);
            }
            this.myJSON = JSON.parse(JSON.stringify(this.Employee_Name));
          this.nameField.nativeElement.focus();
        });
        }
        disableDateResolved(statusValue){
          if(statusValue === 'Open'){
            this.RaidAddUpdateForm.controls['Resolved'].setValue('');
            this.RaidAddUpdateForm.controls['Resolved'].disable();
          }else if(statusValue === 'Closed'){
            this.RaidAddUpdateForm.controls['Resolved'].enable();
          }
        }

        riskUpdate(){  
          this.UpdateFlagUnsubscribe = 1;
          // this.loadRaidAddUpdate = forkJoin([
          //                     // this._ser.getRaid(this.RaidAddUpdateForm.value),
          //                     this._ser.getRaid(this.RaidID),
          //                     this._ser.getNames(this.RaidAddUpdateForm.value)]).subscribe((res:any)=>{
          //     this.RaidInfo = res[0];      
          //     this.LevelNames = res[1];
          this.loadRaidAddUpdate = this._ser.getRaid(this.RaidID).subscribe((res:any)=>{
                                    this.RaidInfo = res;
              // if((this.LevelNames!='undefined')||(this.LevelNames!='')){
                this.RaidAddUpdateForm.controls['Epic'].setValue(this.epicName);
                this.RaidAddUpdateForm.controls['Sprint'].setValue(this.sprintName);
                this.RaidAddUpdateForm.controls['AppID'].setValue(this.AppName);
                this.RaidAddUpdateForm.controls['IntegrationID'].setValue(this.RaidInfo[0].IntegrationID);
                this.RaidAddUpdateForm.controls['TargetDate'].setValue(this.RaidInfo[0].TargetDate);
                this.RaidAddUpdateForm.controls['Description'].setValue(this.RaidInfo[0].Description);
                this.RaidAddUpdateForm.controls['Status'].setValue(this.RaidInfo[0].Status);
                this.RaidAddUpdateForm.controls['Owner'].setValue(this.RaidInfo[0].Owner);
                this.RaidAddUpdateForm.controls['Priority'].setValue(this.RaidInfo[0].Priority);
                this.RaidAddUpdateForm.controls['DateRaised'].setValue(this.RaidInfo[0].DateRaised);
                this.RaidAddUpdateForm.controls['ImpactConsequences'].setValue(this.RaidInfo[0].ImpactConsequences);
              //this.RaidAddUpdateForm.controls['DateLastUpdated'].setValue(this.RaidInfo[0].DateLastUpdated);
                var dt = this.datepipe.transform(this.RaidInfo[0].DateLastUpdated, 'MM/dd/yyyy');
                this.RaidAddUpdateForm.controls['DateLastUpdated'].setValue(dt);
                this.RaidAddUpdateForm.controls['ReportedTo'].setValue(this.RaidInfo[0].ReportedTo);
                this.RaidAddUpdateForm.controls['RaisedBy'].setValue(this.RaidInfo[0].RaisedBy);
                this.RaidAddUpdateForm.controls['Resolved'].setValue(this.RaidInfo[0].Resolved);
                this.RaidAddUpdateForm.controls['ClassificationCategory'].setValue(this.RaidInfo[0].ClassificationCategory);
                this.RaidAddUpdateForm.controls['Probability'].setValue(this.RaidInfo[0].Probability);
                this.RaidAddUpdateForm.controls['Exposure'].setValue(this.RaidInfo[0].Exposure);
                this.RaidAddUpdateForm.controls['ReportingLevel'].setValue(this.RaidInfo[0].ReportingLevel);
                this.RaidAddUpdateForm.controls['RiskResponsePlan'].setValue(this.RaidInfo[0].RiskResponsePlan);
                this.RaidAddUpdateForm.controls['ContaintmentApproach'].setValue(this.RaidInfo[0].ContaintmentApproach);
                this.RaidAddUpdateForm.controls['Resolved'].setValue(this.RaidInfo[0].Resolved);
                this.RaidAddUpdateForm.controls['RiskType'].setValue(this.RaidInfo[0].RiskType);
                this.RaidAddUpdateForm.controls['LastUpdatedBy'].setValue(this.RaidInfo[0].LastUpdatedBy);
                this.RaidAddUpdateForm.controls['Category'].setValue(this.RaidInfo[0].Category);
                this.RaidAddUpdateForm.controls['Comments'].setValue(this.RaidInfo[0].Comments);
                this.RaidAddUpdateForm.controls['Source'].setValue(this.RaidInfo[0].Source);
                this.RaidAddUpdateForm.controls['DateOfEscalation'].setValue(this.RaidInfo[0].DateOfEscalation);
                this.RaidAddUpdateForm.controls['ShowStopper'].setValue(this.RaidInfo[0].ShowStopper);
                this.RaidAddUpdateForm.controls['DependencyOwner'].setValue(this.RaidInfo[0].DependencyOwner);
                this.RaidAddUpdateForm.controls['ActionsToResolve'].setValue(this.RaidInfo[0].ActionsToResolve);
                if(this.RaidInfo[0].Status === 'Open'){
                  this.RaidAddUpdateForm.controls['Resolved'].setValue('');
                  this.RaidAddUpdateForm.controls['Resolved'].disable();
                }
              // }
            },(err:HttpErrorResponse)=>{
              if(err.error instanceof Error){
                console.log("Client Sider Error.");
              }
              else{
                console.log("Server Sider Error.");
            }
            });    
        }   

        //closing riskUpdate()

        public buildForm() {
          console.log("In build form--validating")
          this.Form_Service.markFormGroupTouched(this.RaidAddUpdateForm);
          // right before we submit our form to the server we check if the form is valid
          // if not, we pass the form to the validateform function again. Now with check dirty false
          // this means we check every form field independent of wether it's touched
          if (this.RaidAddUpdateForm.valid) {

          } else {
            console.log("In if condition---error exists")
            this.toaster.warning('Please fill all the mandatory fields.');
            this.formErrors = this.Form_Service.validateForm(this.RaidAddUpdateForm, this.formErrors, false);    
          }
          this.RaidAddUpdateForm.valueChanges.subscribe((data) => {
            this.formErrors = this.Form_Service.validateForm(this.RaidAddUpdateForm, this.formErrors, true);
          });
        }
        Save() {

          if (this.Flag === 'Update') { 
            var fldarrremove=['Epic', 'Sprint', 'AppID']
            for (let i= 0; i< fldarrremove.length ;i++) {
              console.log(fldarrremove[i])
              this.RaidAddUpdateForm.get(fldarrremove[i]).clearValidators();  
              this.RaidAddUpdateForm.controls[fldarrremove[i]].setErrors(null);
              this.RaidAddUpdateForm.controls[fldarrremove[i]].setValidators(null);    
            }     
          }   

          this.buildForm();
          var TargetDt = new Date(this.RaidAddUpdateForm.controls['TargetDate'].value);
          var DtRaised = new Date(this.RaidAddUpdateForm.controls['DateRaised'].value);
          var DtOfEscalation = new Date(this.RaidAddUpdateForm.controls['DateOfEscalation'].value);
          var DtResolved = new Date(this.RaidAddUpdateForm.controls['Resolved'].value)
                if (new Date(TargetDt) < new Date(DtRaised)) {
                    this.toaster.error('Target Date must be greater to Date raised');
                    return false;
                  }
                  if (new Date(DtRaised) > new Date(TargetDt)) {
                    this.toaster.error('Date raised must be less to Target Date');
                    return false;
                  }
                if(this.RaidAddUpdateForm.controls['DateOfEscalation'].value!=null){
                  if (new Date(DtOfEscalation) < new Date(DtRaised)) {
                    this.toaster.error('Date Of Escalation must be greater to Date raised');
                    return false;
                  }
                  if (new Date(DtRaised) > new Date(DtOfEscalation)) {
                    this.toaster.error('Date raised must be less to Date Of Escalation');
                    return false;
                  }
                }
                if(this.RaidAddUpdateForm.controls['Resolved'].value!=null){
                  if (new Date(DtResolved) < new Date(DtRaised)) {
                    this.toaster.error('Date Of Resolved must be greater to Date raised');
                    return false;
                  }
                  if (new Date(DtRaised) > new Date(DtResolved)) {
                    this.toaster.error('Date raised must be less to Date Of Resolved');
                    return false;
                  }
                  if (this.RaidAddUpdateForm.invalid) {
                    return;
                  }
                  }
                  var sourceComponentPath = '/transition-Main/raid-add-update';
                  var destinationComponentPath ='/transition-Main/raid';
                  var destinationComponentParameter = [{id:'Id',param:this.IntegrationID},
                                                      { id: 'ClientName', param: this.Client },
                                                      { id: 'Sector', param: this.Sector },
                                                      { id: 'Industry', param: this.Industry }]            
                  
                if ( this.Flag === 'Add') {
                console.log(this.RaidAddUpdateForm.value)
                      this.InsertSubscription =  this._ser.InsertRaidInfo(this.RaidAddUpdateForm.value).subscribe(res => {
                        if (res.RecordSave === 'Sucess') {
                            this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameter) 
                            this.toaster.success('RAID information saved sucessfully.');
                      } else {
                            this.toaster.error('RAID information save failed.');
                      }
                  });
                } else if (this.Flag === 'Update') { 
                this.UpdateSubscription =  this._ser.UpdateRaidInfo(this.RaidAddUpdateForm.value).subscribe(res => {
                if (res.RecordSave === 'Sucess') {
                  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameter) 
                  this.toaster.success('RAID information updated sucessfully.');
                } else {
                  this.toaster.error('RAID information update failed.');
                }
            });
              
              
          }
        }

        RemoveFormvalues(){
          var FieldsNames =['Description',	'Status',	'Owner',	'TargetDate',	'Priority',	'DateRaised',	
          'AssociatedApplication',	'ImpactConsequences',	'DateLastUpdated',	'ReportedTo',	'RaisedBy',	
          'Resolved',	'ClassificationCategory',	'Probability',	'Exposure',	'ReportingLevel',	'RiskResponsePlan',	
          'ContaintmentApproach',	'IssueNumber',	'DateLaunched',	'AssociatedActionIDs',	'Category',	
          'Comments',	'Source',	'DateOfEscalation',	'ShowStopper',	'DependencyOwner',	'ActionsToResolve']
          for( let i=0; i< FieldsNames.length; i++){  
            if (FieldsNames[i] ==='Status'){
              if (this.RaidAddUpdateForm.controls['Status'].value === '') {
                this.RaidAddUpdateForm.controls['Status'].setValue('Open')
              this.disableDateResolved('Open')
              }
            }else {
                this.RaidAddUpdateForm.controls[FieldsNames[i]].setValue('')
                this.RaidAddUpdateForm.markAsUntouched();
            }  
          }
        }

        RAIDBack(){
          var sourceComponentPath = '/transition-Main/raid';
          var destinationComponentPath = '/transition-Main/raid';
          var destinationComponentParameterArray = [{ id: 'Id', param: this.IntegrationID },
                                                    { id: 'ClientName', param: this.Client },
                                                    { id: 'Sector', param: this.Sector },
                                                    { id: 'Industry', param: this.Industry },
                                                    { id: 'ViewFlag', param: this.ViewFlag },
                                                    { id: 'OwningTTS', param: this.OwningTTS }]             
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)  

        }
        ngOnDestroy() {
          console.log("Unsubscribing Raid");
          this.RaidSubscription.unsubscribe();
          if(this.UpdateFlagUnsubscribe === 1){
            console.log("UpdateFlagUnsubscribe"+this.UpdateFlagUnsubscribe);
            this.loadRaidAddUpdate.unsubscribe();
          }
          if(this.RiskSelectFlagUnsubscribe === 1){
            console.log("RiskSelectFlagUnsubscribe"+this.RiskSelectFlagUnsubscribe);
            this.RiskselectSubscription.unsubscribe();
          }
          if(this.SprintSelectFlagUnsubscribe === 1){
            console.log("SprintSelectFlagUnsubscribe"+this.SprintSelectFlagUnsubscribe);
            this.SprintselectSubscription.unsubscribe();
          }
          if(this.AppSelectFlagUnsubscribe === 1){
            console.log("AppSelectFlagUnsubscribe"+this.AppSelectFlagUnsubscribe);
            this.AppselectSubscription.unsubscribe();
          }
          /* if (this.Flag === 'Add' ) {
            console.log("Flag"+this.Flag);
            this.InsertSubscription.unsubscribe();
          }
          if (this.Flag === 'Update' ) {
            console.log("Flag"+this.Flag);
            this.UpdateSubscription.unsubscribe();
          } */

        } 

}
