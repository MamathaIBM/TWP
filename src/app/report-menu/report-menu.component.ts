import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Validators, FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SprintPlanApplnLevelService } from 'src/app/account_sprint-plan/sprint-plan-appln-level/sprint-plan-appln-level/sprint-plan-appln-level.service';
import { environment } from 'src/environments/environment';
import { UserAccessProfileService } from 'Services/user-access-profile.service';

export interface OrgWSRDialogData {
  WSROrg: string;
}

@Component({
  selector: 'app-report-menu',
  templateUrl: './report-menu.component.html',
  styleUrls: ['./report-menu.component.css']
})

export class ReportMenuComponent implements OnInit {

  WSROrg = new FormControl;
  private ID: string;
  private ViewFlag: string;
  OwningTTS: string;
  username: any;
  baseURL = environment.baseUrl;
  SolOwnTTS = [];
  USER_ORG: any;

  constructor(public dialog : MatDialog,
    private SprintPlanApplnLevelService: SprintPlanApplnLevelService,
    private userAccessProfileService: UserAccessProfileService,) { }

  WSR_OpenDialog(): void {

    const dialogRef = this.dialog.open(OrgWSRDialog, {
      disableClose: true,
      width: '350px',
      data: { WSROrg: this.WSROrg.value }
    });
    
    dialogRef.afterClosed().subscribe(result => {
      
      if(result === undefined){
      }else{
      if (result.includes(undefined) === true) {
        result = result.slice(1)
      }
     let checker = (arr, target) => target.every(v => arr.includes(v)); 
     var val = ((result===null) || result===undefined) ? false : checker(this.SolOwnTTS, result);   
     if( val === true){       
        this.SprintPlanApplnLevelService.OrgWSRReport(this.username,result);
        window.open(this.baseURL+'/OrgWSRExport/'+this.username+'/'+result);
      }
    }
    });
  }

  ngOnInit() {

    this.OwningTTS = this.userAccessProfileService.getCurrentTransitionOrg();
    this.ID = this.userAccessProfileService.getIntegrationID();
    this.ViewFlag = this.userAccessProfileService.getViewFlag();

    this.username = JSON.parse(sessionStorage.getItem('USER_NAME'));
    this.username = decodeURIComponent(this.username._value);

    this.USER_ORG = JSON.parse(sessionStorage.getItem('USER_TRAN_ORG'));
    this.SolOwnTTS.push(decodeURIComponent(this.USER_ORG._value));
    const str = this.SolOwnTTS.join('\n').split(',');
    this.SolOwnTTS = str;
  }

}

@Component({
  selector: 'report-menu-dailog',
  templateUrl: 'report-menu-dailog.html',
})
export class OrgWSRDialog{

  WSROrg = new FormControl;
  SolOwnTTS = [];
  USER_ORG: any;
  WSROrgVal: any;
  flgval: string

  constructor(
    public dialogRef: MatDialogRef<OrgWSRDialog>,
    @Inject(MAT_DIALOG_DATA) public data: OrgWSRDialogData ) {
      this.WSROrg.setValue(data.WSROrg);
  } 

  ngOnInit() {
    this.USER_ORG = JSON.parse(sessionStorage.getItem('USER_TRAN_ORG'));
    this.SolOwnTTS.push(decodeURIComponent(this.USER_ORG._value));
    const str = this.SolOwnTTS.join('').split(',');
    this.SolOwnTTS = str;
    this.flgval='Yes'
  }  

  selectOrg() {
    this.WSROrg.setValue(this.SolOwnTTS);   
    this.flgval='No'
  }
  ValMethod(obj:any){
    this.WSROrg.setValue(obj.value.slice(0));
  }
  OpenAutoFile(){
    window.open('../../assets/How do I install AutoEvents Add-ins.docx');
  }
  deselectOrg() {
    if(this.WSROrg.value){
    this.WSROrgVal = this.WSROrg.value;
    var arrlengWSR = this.WSROrgVal.length;
    for (let i = 0; i < arrlengWSR; i++) {
      this.WSROrgVal.splice(0, 1);
    }
  }
    // this.WSROrg.setValue(this.WSROrgVal.value.slice(0));  
    this.WSROrg.setValue('')  
    this.flgval='Yes'
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
