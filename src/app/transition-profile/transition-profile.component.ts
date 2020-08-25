import { ControllerServiceService } from './../controller-service.service';
import { NavtntService } from './../navtnt.service';
import { Validators, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import 'rxjs/Rx';
import { forkJoin } from 'rxjs';
import { UserNameService } from 'Services/user-name.service';
import { ServiceForm } from 'Services/form';
import { TransitionProfileService } from './Service/transition-profile.service';
import { Subscription } from 'rxjs';
import { NewExecutionService } from '../new-execution/service/new-execution.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormCanDeactivate } from '../form-can-deactivate/form-can-deactivate';
import { NgForm } from '@angular/forms';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { ContractualDeliverablesService } from '../Master/contractual-deliverables/contractual-deliverables/contractual-deliverables.service'

@Component({
  selector: 'app-transition-profile',
  templateUrl: './transition-profile.component.html',
  styleUrls: ['./transition-profile.component.css']
})
export class TransitionProfileComponent extends FormCanDeactivate implements OnInit {
  @ViewChild("form") form: NgForm;

  TransitionProfileForm: FormGroup;
  public formErrors = {
    ClientName: '',
    TransitionName: '',
    TransStartDt: '',
    TransEndDt: '',
    Geo: '',
    Sector: '',
    Industry: '',
    SiebelOppNo: '',
    TCV: '',
    TransitionType: '',
    TransitionScope: '',
    SteadyStateScope: '',
  };
  private loadparamsSubscription: Subscription;
  private saveSubscription: Subscription;
  private UpdateSubscription: Subscription;
  private ValidationSubscription: Subscription;
  private SolOwnTTS = [];
  private SolSector: any;
  private TransitionStatus: any;
  private Industry: any;
  private IndCom: any;
  private IndDis: any;
  private IndFSS: any;
  private IndInd: any;
  private IndPub: any;
  private IOT: any;
  private boolan: any;
  private IncumbentVendor: any;
  private nm: any;
  private TransitionVal: any;
  private ID: Date = new Date();
  private Flag: string;
  private submitted = false;
  private localgetProfile: any = '';
  private IntegrationID: string;
  private username: any;
  SolCICLocations: any;
  APIOT: any;
  EuropeIOT: any;
  NAIOT: any;
  LAIOT: any;
  IOTCountry: any;
  FlagHide: string;
  localgetProfileval: any;
  viewflag: string;
  GCGIOT: any;
  JAPANIOT: any;
  MAEIOT: any;
  IncVendorval = [];
  saveflg: boolean;
  userID: any;
  Userroles: any;
  roles = [];
  roleID = [];
  RoleIDs: any;
  useremail: any;
  USER_ORG: any;
  SOlOwning = [];
  ServiceLine: any;
  CICval: any;
  minDate: Date;
  userOrg: any;
  CurOwnOrg: any;
  ChangeOwnOrg: any;
  TransitionType: any;
  TransitionScope: any;
  SteadyStateScope: any;
  CDMandatoryFields: any;


  constructor(private _Ser: NewExecutionService,
    private _Ser1: TransitionProfileService,
    private _SerCD:ContractualDeliverablesService,
    private fb: FormBuilder,
    private _UserSer: UserNameService,
    public datepipe: DatePipe,
    private toaster: ToastrService,
    private activatedRoute: ActivatedRoute,
    private route: Router,
    private userAccessProfileService: UserAccessProfileService,
    private navigation: NavtntService,
    public Form_Service: ServiceForm,
  ) {
    super();
    this.TransitionProfileForm = this.fb.group({
      IntegrationID: [''],
      TransitionStatus: [''],
      Sector: ['', [Validators.required]],
      Industry: ['', [Validators.required]],
      ClientName: ['', [Validators.required]],
      TransitionName: ['', [Validators.required]],
      TransStartDt: ['', [Validators.required]],
      TransEndDt: ['', [Validators.required]],
      ServiceLine: [''],
      ProjectID: [''],
      Geo: ['', [Validators.required]],
      CountriesInvolved: [''],
      CICLocations: [''],
      IncumbentVendor: [''],
      NumberofFTE: [''],
      NoAppinScope: [''],
      IOT: [''],
      SiebelOppNo: ['', [Validators.required]],
      TransitionTier: [''],
      TCV: ['', [Validators.required]],
      OtherVendor: [''],
      CreatedBy: [''],
      CreatedDate: [''],
      ModifiedBy: [''],
      ModifiedDate: [''],
      TransitionType: ['', [Validators.required]],
      TransitionScope: ['', [Validators.required]],
      SteadyStateScope: ['', [Validators.required]],
      ContractDuration: [''],
    });

    //  this.Form_Service.transformerr = 'Yes'

  }

  public buildForm() {
    this.Form_Service.markFormGroupTouched(this.TransitionProfileForm);
    // right before we submit our form to the server we check if the form is valid
    // if not, we pass the form to the validateform function again. Now with check dirty false
    // this means we check every form field independent of wether it's touched
    if (this.TransitionProfileForm.valid) {
    } else {
      this.toaster.warning('Please fill all mandatory fields.');
      this.formErrors = this.Form_Service.validateForm(this.TransitionProfileForm, this.formErrors, false);

    }
    this.TransitionProfileForm.valueChanges.subscribe((data) => {
      this.formErrors = this.Form_Service.validateForm(this.TransitionProfileForm, this.formErrors, true);
    });
  }

  onSubmit() {
    this.Save();
  }

  ngOnInit() {

    this.minDate = new Date();
    this.saveflg = false;
    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);

    this.useremail = this.userAccessProfileService.getUserEmail();

    this.userID = JSON.parse(sessionStorage.getItem('USER_ID'));
    this.userID = decodeURIComponent(this.userID._value);

    this.userOrg = JSON.parse(sessionStorage.getItem('USER_TRAN_ORG'));
    this.userOrg = decodeURIComponent(this.userOrg._value);

    this.activatedRoute.queryParams.subscribe((respar: any) => {
      if (respar.filter) {
        this.viewflag = this.navigation.getParameterValue(respar.filter, 'ViewFlag')
        if (this.navigation.getParameterValue(respar.filter, 'ViewFlag') === 'Yes') {
          this.TransitionProfileForm.disable();
          this.FlagHide = 'Yes';
        }
      }
    });
    this.IncVendorval.push(this.TransitionProfileForm.controls['IncumbentVendor'].value);
    this.boolan = true;
    if (this.TransitionProfileForm.controls['CreatedBy'].value === '' || this.TransitionProfileForm.controls['CreatedBy'].value === undefined || this.TransitionProfileForm.controls['CreatedBy'].value === null) {
      this.Flag = 'Save';
    } else {
      this.Flag = 'Update';
    }
    return forkJoin([this._Ser.getOwnTTSKeywordResult(),
    this._Ser.getSectorKeywordResult(),
    this._Ser.getIncumbentVendorResult(),
    this._Ser.getIOTResult(),
    this._Ser.getTransStatusResult(),
    this._Ser.getCICLocationsResult(),
    this._Ser.getServiceLineKeywordResult(),
    this._Ser.getTransTypeResult(),
    this._Ser.getTransScopeResult(),
    this._Ser.getStStateScopeResult(),
    this._SerCD.getCDMandatoryFields()
    ])
      .subscribe(res => {
        this.USER_ORG = JSON.parse(sessionStorage.getItem('USER_TRAN_ORG'));
        this.SolOwnTTS.push(decodeURIComponent(this.USER_ORG._value));
        const str = this.SolOwnTTS.join('\n').split(',');
        this.SolOwnTTS = str;
        this.SolSector = res[1];
        this.IncumbentVendor = res[2];
        this.IOT = res[3];
        this.TransitionStatus = res[4];
        this.SolCICLocations = res[5];
        this.ServiceLine = res[6];
        this.TransitionType = res[7];
        this.TransitionScope = res[8];
        this.SteadyStateScope = res[9];
        this.CDMandatoryFields = res[10];

        this.activatedRoute.queryParams.subscribe((res: any) => {
          if (res.filter) {
            this.IntegrationID = this.navigation.getParameterValue(res.filter, 'Id');
            if (this.IntegrationID === undefined || this.IntegrationID === '') {
              // tslint:disable-next-line:max-line-length
              this.IntegrationID = 'ID-' + this.datepipe.transform(this.ID, 'yyyyMMddhmmss');
            }
            // tslint:disable-next-line:no-shadowed-variable
            this._Ser1.getTransitionProfile(this.IntegrationID).subscribe(res => {
              this.localgetProfileval = res;
            },
              error => console.log(error),
              () => {
                this.localgetProfile = this.localgetProfileval;
                if (this.localgetProfile[0] === '' || this.localgetProfile[0] === undefined) {
                  this.AssginData();
                  this.Flag = 'Save';
                } else {

                  this.EditData();
                  this.Flag = 'Update';
                }
                this.onKeyIndustry();
                if ((this.TransitionProfileForm.controls['IOT'].value.length !== 0)) {
                  this.onKeyIOT();
                }
              }
            );
          }
        });

      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Client Sider Error.');
        } else {
          console.log('Server Sider Error.');
        }
      });

  }

  AssginData(): any {

    if (this.TransitionProfileForm.touched !== true) {
      // tslint:disable-next-line:max-line-length
      this.TransitionProfileForm.controls['IntegrationID'].setValue(this._Ser.TranVal.IntegrationID);
      this.TransitionProfileForm.controls['NumberofFTE'].setValue(this._Ser.TranVal.TotalIBMFTE);
      if (this._Ser.TranVal.IntegrationID === undefined || this._Ser.TranVal.IntegrationID === '') {
        // tslint:disable-next-line:max-line-length
        this.TransitionProfileForm.controls['IntegrationID'].setValue('ID-' + this.datepipe.transform(this.ID, 'yyyyMMddhmmss'));
        this.TransitionProfileForm.controls['NumberofFTE'].setValue(0);
      }
      this.TransitionProfileForm.controls['TransitionStatus'].setValue('Active');
      this.TransitionProfileForm.controls['Sector'].setValue(this._Ser.TranVal.Sector);
      this.TransitionProfileForm.controls['Industry'].setValue(this._Ser.TranVal.Industry);
      this.TransitionProfileForm.controls['ClientName'].setValue(this._Ser.TranVal.ClientName);
      this.TransitionProfileForm.controls['Geo'].setValue(this._Ser.TranVal.OwningTTS);
      this.TransitionProfileForm.controls['SiebelOppNo'].setValue(this._Ser.TranVal.SiebelNo);
      this.TransitionProfileForm.controls['TransitionTier'].setValue(this._Ser.TranVal.Tier);
      this.TransitionProfileForm.controls['TCV'].setValue(this._Ser.TranVal.AMSTCV);
      if (this._Ser.TranVal.GDCLoc !== undefined) {
        this.TransitionProfileForm.controls['CICLocations'].setValue(this._Ser.TranVal.GDCLoc.split(','));
      }
    }
  }

  EditData() {
    console.log(this.localgetProfile)
    if (this.TransitionProfileForm.touched !== true) {
      this.TransitionProfileForm.controls['IntegrationID'].setValue(this.localgetProfile[0].IntegrationID);
      this.TransitionProfileForm.controls['TransitionStatus'].setValue(this.localgetProfile[0].TransitionStatus);
      this.TransitionProfileForm.controls['Sector'].setValue(this.localgetProfile[0].Sector);
      if (this.localgetProfile[0].Industry === '') {
        this.TransitionProfileForm.controls['Industry'].setValue('');
      } else {
        this.TransitionProfileForm.controls['Industry'].setValue(this.localgetProfile[0].Industry);
      }
      this.TransitionProfileForm.controls['ClientName'].setValue(this.localgetProfile[0].ClientName);
      this.TransitionProfileForm.controls['TransitionName'].setValue(this.localgetProfile[0].TransitionName);
      this.TransitionProfileForm.controls['TransStartDt'].setValue(this.localgetProfile[0].TransStartDt);
      this.TransitionProfileForm.controls['TransEndDt'].setValue(this.localgetProfile[0].TransEndDt);
      this.TransitionProfileForm.controls['ServiceLine'].setValue(this.localgetProfile[0].ServiceLine);
      this.TransitionProfileForm.controls['ProjectID'].setValue(this.localgetProfile[0].ProjectID);
      this.TransitionProfileForm.controls['Geo'].setValue(this.localgetProfile[0].Geo);
      this.TransitionProfileForm.controls['NumberofFTE'].setValue(this.localgetProfile[0].NumberofFTE);
      this.TransitionProfileForm.controls['NoAppinScope'].setValue(this.localgetProfile[0].NoAppinScope);
      this.TransitionProfileForm.controls['IOT'].setValue(this.localgetProfile[0].IOT);
      this.TransitionProfileForm.controls['SiebelOppNo'].setValue(this.localgetProfile[0].SiebelOppNo);
      this.TransitionProfileForm.controls['TransitionTier'].setValue(this.localgetProfile[0].TransitionTier);
      this.TransitionProfileForm.controls['TCV'].setValue(this.localgetProfile[0].TCV);
      this.TransitionProfileForm.controls['OtherVendor'].setValue(this.localgetProfile[0].OtherVendor);
      this.TransitionProfileForm.controls['CreatedBy'].setValue(this.localgetProfile[0].CreatedBy);
      this.TransitionProfileForm.controls['CreatedDate'].setValue(this.localgetProfile[0].CreatedDate);
      this.TransitionProfileForm.controls['ModifiedBy'].setValue(this.localgetProfile[0].ModifiedBy);
      this.TransitionProfileForm.controls['CountriesInvolved'].setValue(this.localgetProfile[0].CountriesInvolved.split(','));
      this.TransitionProfileForm.controls['CICLocations'].setValue(this.localgetProfile[0].CICLocations.split(','));
      this.TransitionProfileForm.controls['IncumbentVendor'].setValue(this.localgetProfile[0].IncumbentVendor.split(','));
    
      if (this.localgetProfile[0].TransitionType === null) {
        this.TransitionProfileForm.controls['TransitionType'].setValue('');
      } else {
        this.TransitionProfileForm.controls['TransitionType'].setValue(this.localgetProfile[0].TransitionType.split(','));
      }
      
      if (this.localgetProfile[0].TransitionScope === null) {
        this.TransitionProfileForm.controls['TransitionScope'].setValue('');
      } else {
        this.TransitionProfileForm.controls['TransitionScope'].setValue(this.localgetProfile[0].TransitionScope.split(','));
      }
      if (this.localgetProfile[0].SteadyStateScope === null) {
        this.TransitionProfileForm.controls['SteadyStateScope'].setValue('');
      } else {
        this.TransitionProfileForm.controls['SteadyStateScope'].setValue(this.localgetProfile[0].SteadyStateScope.split(','));
      }
      
      this.TransitionProfileForm.controls['ContractDuration'].setValue(this.localgetProfile[0].ContractDuration);
    }
  }


  public numberOnly(event): boolean {

    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode !== 46 && charCode > 31
      && (charCode < 48 || charCode > 57)) {
      alert('Please Enter Numeric values');
      return false;
    } else {
      return true;
    }
  }

  public numericvalueApp(event) {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      alert('Please Enter Numeric values');
      return false;

    } else {
      return true;
    }
  }

  public deselectInd() {
    this.TransitionProfileForm.controls['Industry'].setValue('');
  }
  public onKeyIndustry() {
    this._Ser1.getIndustry(this.TransitionProfileForm.controls['Sector'].value).subscribe(res => {
      this.Industry = res;
    });
  }

  public onKeyIOT() {
    // this.TransitionProfileForm.controls['CountriesInvolved'].setValue('')
    this._Ser1.getCountries(this.TransitionProfileForm.controls['IOT'].value).subscribe(res => {
      this.IOTCountry = res;
    });

  }

  public UpdateFTE(value) {
    const with2Decimals = this.TransitionProfileForm.controls['NumberofFTE'].value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    this.TransitionProfileForm.controls['NumberofFTE'].setValue(with2Decimals);
  }

  public ContractDur(value) {
    const with1Decimals = this.TransitionProfileForm.controls['ContractDuration'].value.toString().match(/^-?\d+(?:\.\d{0,1})?/)[0];
    this.TransitionProfileForm.controls['ContractDuration'].setValue(with1Decimals);
  }

  public UpdateTier(value) {

    const with2Decimals = this.TransitionProfileForm.controls['TCV'].value.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
    this.TransitionProfileForm.controls['TCV'].setValue(with2Decimals);

    if (this.TransitionProfileForm.controls['TCV'].value === '') {

      this.TransitionProfileForm.controls['TransitionTier'].setValue('');
    } else if (this.TransitionProfileForm.controls['TCV'].value > 50) {

      this.TransitionProfileForm.controls['TransitionTier'].setValue('Tier 1');
    } else if (this.TransitionProfileForm.controls['TCV'].value >= 5 && this.TransitionProfileForm.controls['TCV'].value <= 50) {

      this.TransitionProfileForm.controls['TransitionTier'].setValue('Tier 2');
    } else {

      this.TransitionProfileForm.controls['TransitionTier'].setValue('Tier 3');
    }



  }

  OrgValidation() {
    this.CurOwnOrg = this.userAccessProfileService.getCurrentTransitionOrg();
    this.ChangeOwnOrg = this.TransitionProfileForm.controls['Geo'].value;
    console.log(this.CurOwnOrg)
    this._Ser1.getUserOrgCheck(this.IntegrationID, this.ChangeOwnOrg).subscribe(res => {
      if (res[0]["count(*)"] > 0) {
        this.TransitionProfileForm.controls['Geo'].setValue(this.CurOwnOrg);
        alert('Please remove the members from Transition/Delivery Team whose Owning Organization is not ' + this.ChangeOwnOrg + ' before Proceeding for Owning TTS Organization change');
        return false;
      }
    });
  }

  HideOtherV(value) {
    const string: any = this.TransitionProfileForm.controls['IncumbentVendor'].value;

    if (string.indexOf('Other') < 0) {
      this.boolan = true;
      this.TransitionProfileForm.controls['OtherVendor'].setValue('');
    } else {
      this.boolan = false;
    }
  }

  deselect() {
    this.IncVendorval = this.TransitionProfileForm.controls['IncumbentVendor'].value;
    var arrleng = this.IncVendorval.length
    for (let i = 1; i < arrleng; i++) {
      this.IncVendorval.splice(1, 1);
    }
    this.TransitionProfileForm.controls['IncumbentVendor'].setValue(this.IncVendorval);
    this.boolan = true;
    this.TransitionProfileForm.controls['OtherVendor'].setValue('');
  }

  deselectCIC() {
    this.CICval = this.TransitionProfileForm.controls['CICLocations'].value;
    var arrlengCIC = this.CICval.length
    for (let i = 1; i < arrlengCIC; i++) {
      this.CICval.splice(1, 1);
    }
    this.TransitionProfileForm.controls['CICLocations'].setValue(this.CICval);
  }

  // convenience getter for easy access to form fields
  get f() { return this.TransitionProfileForm.controls; }

  Save() {

    var today = new Date(Date.parse(Date()));
    var startDT = new Date(this.TransitionProfileForm.controls['TransStartDt'].value);
    var endDT = new Date(this.TransitionProfileForm.controls['TransEndDt'].value);

    if (new Date(endDT) <= new Date(startDT)) {
      this.toaster.error('Transition End Date must be after Transition Start Date');
      return false;
    }

    if (new Date(startDT) > new Date(endDT)) {
      this.toaster.error('Transition Start Date must be before Transition End Date');
      return false;
    }

    if (new Date(endDT) < new Date(today)) {
      this.toaster.error('Transition End Date must be future date.');
      return false;
    }


    this.submitted = true;
    this.buildForm();
    // stop here if form is invalid
    if (this.TransitionProfileForm.invalid) {
      return;
    }
    this.TransitionProfileForm.controls['SiebelOppNo'].setValue(this.TransitionProfileForm.controls['SiebelOppNo'].value.trim().replace(/\s/g, '').toUpperCase())
    const sourceComponentPath = '/transition-Main/';
    const destinationComponentPath = '/transition-Main/';
    if ((this.TransitionProfileForm.controls['TCV'].value === '0') || (this.TransitionProfileForm.controls['TCV'].value === 0)) {
      this.toaster.error('TCV (M $) should not be 0');
      return false;
    }
    this.TransitionProfileForm.controls['CreatedBy'].setValue(this.username);
    this.TransitionProfileForm.controls['ModifiedBy'].setValue(this.username);
        if (this.Flag === 'Save') {

      this._Ser1.DuplicateSeibelCheck(this.TransitionProfileForm.value).subscribe(Dupres => {
        if (Dupres.length !== 0) {
          if (confirm('Tranistion Profile with the Siebel No: ' + this.TransitionProfileForm.controls['SiebelOppNo'].value + ' already exists. Do you still want to continue?')) {

          } else {
            this.toaster.info('Save Cancelled.', 'Transition Profile');
            return false;
          }
        }
        this.Flag = 'Update';
        this.saveflg = true;
        this.TransitionProfileForm.markAsUntouched();
        this.saveSubscription = this._Ser1.SaveTransitionProfile(this.TransitionProfileForm.value).subscribe(res => {

          if (res.RecordSave === 'Sucess') {
//Transition Team User Addition
            let obj: any;
            obj = {
              'USER_ID': this.userID,
              'IntegrationID': this.TransitionProfileForm.controls['IntegrationID'].value,
              'CreatedBy': this.username,
              'ModifiedBy': this.username,
              'TransitionTeamName': this.useremail,
              'TransitionTeamRole': '',
              'USER_FULLNAME': this.username,
              'USER_ROLE_ID': '',
              'USER_ORG': this.userOrg,
            };
            this._Ser1.postAddTransitionteam(obj).subscribe(res => {
            });

       //Contratual deliverable Addition
        let objCD: any;
        objCD = {
          'IntegrationID': this.TransitionProfileForm.controls['IntegrationID'].value,
          'DeliverableName': '',
          'DeliverableValues': '',
          'ContractDoc_OwnerNM': this.username,
          'ContractDoc_Owneremail': this.useremail,
          'CreatedBy': this.username,
          'ModifiedBy': this.username,
          'ContractDeliver_Status': '',
          'ContractDeliver_Comments': '',
          'MandatoryFields':this.CDMandatoryFields
        };
        this._SerCD.postCDMandatory(objCD).subscribe(res => {
        });      

            this.userAccessProfileService.setCurrentTransitionID(this.TransitionProfileForm.controls['IntegrationID'].value);
            this.userAccessProfileService.setHasAccessTransitionID(this.TransitionProfileForm.controls['IntegrationID'].value)
            var transitionOrg = this.TransitionProfileForm.controls['Geo'].value;  // Owning organization        
            this.userAccessProfileService.setCurrentTransitionOrg(transitionOrg);

            const destinationComponentParameterArray = [{ id: 'Id', param: this.TransitionProfileForm.controls['IntegrationID'].value },
            { id: 'ClientName', param: this.TransitionProfileForm.controls['ClientName'].value },
            { id: 'Sector', param: this.TransitionProfileForm.controls['Sector'].value },
            { id: 'Industry', param: this.TransitionProfileForm.controls['Industry'].value },
            { id: 'ViewFlag', param: 'No' }];
            this.userAccessProfileService.initializeAccountDetails(destinationComponentParameterArray);
            this.toaster.success('Transition Profile Saved Sucessfully.');
          } else {
            this.toaster.error('Transition Profile Save failed.');
          }
        });

      });
    } else if (this.Flag === 'Update') {
      this._Ser1.DuplicateSeibelCheck(this.TransitionProfileForm.value).subscribe(Dupres => {

        if (Dupres.length > 1) {
          if (confirm('Tranistion Profile with the Siebel No: ' + this.TransitionProfileForm.controls['SiebelOppNo'].value + ' already exists. Do you still want to continue?')) {

          } else {
            this.toaster.info('Update Cancelled.', 'Transition Profile');
            return false;
          }
        }

        this.saveflg = true;
        this.TransitionProfileForm.markAsUntouched();
        this.UpdateSubscription = this._Ser1.UpdateTransitionProfile(this.TransitionProfileForm.value).subscribe(res => {
          if (res.RecordSave === 'Sucess') {
            const destinationComponentParameterArray = [{ id: 'Id', param: this.TransitionProfileForm.controls['IntegrationID'].value },
            { id: 'ClientName', param: this.TransitionProfileForm.controls['ClientName'].value },
            { id: 'Sector', param: this.TransitionProfileForm.controls['Sector'].value },
            { id: 'Industry', param: this.TransitionProfileForm.controls['Industry'].value },
            { id: 'ViewFlag', param: this.viewflag },
            { id: 'OwningTTS', param: this.TransitionProfileForm.controls['Geo'].value }];
            var transitionOrg = this.TransitionProfileForm.controls['Geo'].value;
            this.userAccessProfileService.setCurrentTransitionOrg(transitionOrg);
            this.userAccessProfileService.initializeAccountDetails(destinationComponentParameterArray);
            this.toaster.success('Transition Profile Updated Sucessfully.');
          } else {
            this.toaster.error('Transition Profile Update failed.');
          }
        });

      });
    }
  }
}

