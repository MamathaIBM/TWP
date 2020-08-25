import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Profile } from "Vo/profile";
import { Http, Response, RequestOptions} from "@angular/http";
import { Country } from "Vo/country";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { Keyvalue } from 'Vo/keyvalue';
import { environment } from 'src/environments/environment';
import { SessionStorageService } from 'angular-web-storage';
import { query } from '@angular/animations';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core'






import * as _moment from 'moment';

// tslint:disable-next-line:no-duplicate-imports
//import {default as _rollupMoment} from 'moment';

//const moment = _rollupMoment || _moment;
const moment =  _moment;



@Injectable({
  providedIn: 'root'
})
export class UtilityService {

  AdminbaseUrl = environment.AdminbaseUrl;

  private _getRecordsURL = this.AdminbaseUrl+"/tnt/databaseRecords/";

  countries: Country[] = [
    {value:'Afghanistan', viewValue: 'Afghanistan'},
    {value:'Aland Islands', viewValue: 'Aland Islands'},
    {value:'Albania', viewValue: 'Albania'},
    {value:'Algeria', viewValue: 'Algeria'},
    {value:'American Samoa', viewValue: 'American Samoa'},
    {value:'Andorra', viewValue: 'Andorra'},
    {value:'Angola', viewValue: 'Angola'},
    {value:'Anguilla', viewValue: 'Anguilla'},
    {value:'Antarctica', viewValue: 'Antarctica'},
    {value:'Antigua and Barbuda', viewValue: 'Antigua and Barbuda'},
    {value:'Argentina', viewValue: 'Argentina'},
    {value:'Armenia', viewValue: 'Armenia'},
    {value:'Aruba', viewValue: 'Aruba'},
    {value:'Australia', viewValue: 'Australia'},
    {value:'Austria', viewValue: 'Austria'},
    {value:'Azerbaijan', viewValue: 'Azerbaijan'},
    {value:'Bahamas', viewValue: 'Bahamas'},
    {value:'Bahrain', viewValue: 'Bahrain'},
    {value:'Bangladesh', viewValue: 'Bangladesh'},
    {value:'Barbados', viewValue: 'Barbados'},
    {value:'Belarus', viewValue: 'Belarus'},
    {value:'Belgium', viewValue: 'Belgium'},
    {value:'Belize', viewValue: 'Belize'},
    {value:'Benin', viewValue: 'Benin'},
    {value:'Bermuda', viewValue: 'Bermuda'},
    {value:'Bhutan', viewValue: 'Bhutan'},
    {value:'Bolivia', viewValue: 'Bolivia'},
    {value:'Bonaire, Saint Eustatius and Saba ', viewValue: 'Bonaire, Saint Eustatius and Saba '},
    {value:'Bosnia and Herzegovina', viewValue: 'Bosnia and Herzegovina'},
    {value:'Botswana', viewValue: 'Botswana'},
    {value:'Bouvet Island', viewValue: 'Bouvet Island'},
    {value:'Brazil', viewValue: 'Brazil'},
    {value:'British Indian Ocean Territory', viewValue: 'British Indian Ocean Territory'},
    {value:'British Virgin Islands', viewValue: 'British Virgin Islands'},
    {value:'Brunei', viewValue: 'Brunei'},
    {value:'Bulgaria', viewValue: 'Bulgaria'},
    {value:'Burkina Faso', viewValue: 'Burkina Faso'},
    {value:'Burundi', viewValue: 'Burundi'},
    {value:'Cambodia', viewValue: 'Cambodia'},
    {value:'Cameroon', viewValue: 'Cameroon'},
    {value:'Canada', viewValue: 'Canada'},
    {value:'Cape Verde', viewValue: 'Cape Verde'},
    {value:'Cayman Islands', viewValue: 'Cayman Islands'},
    {value:'Central African Republic', viewValue: 'Central African Republic'},
    {value:'Chad', viewValue: 'Chad'},
    {value:'Chile', viewValue: 'Chile'},
    {value:'China', viewValue: 'China'},
    {value:'Christmas Island', viewValue: 'Christmas Island'},
    {value:'Cocos Islands', viewValue: 'Cocos Islands'},
    {value:'Colombia', viewValue: 'Colombia'},
    {value:'Comoros', viewValue: 'Comoros'},
    {value:'Cook Islands', viewValue: 'Cook Islands'},
    {value:'Costa Rica', viewValue: 'Costa Rica'},
    {value:'Croatia', viewValue: 'Croatia'},
    {value:'Cuba', viewValue: 'Cuba'},
    {value:'Curacao', viewValue: 'Curacao'},
    {value:'Cyprus', viewValue: 'Cyprus'},
    {value:'Czech Republic', viewValue: 'Czech Republic'},
    {value:'Democratic Republic of the Congo', viewValue: 'Democratic Republic of the Congo'},
    {value:'Denmark', viewValue: 'Denmark'},
    {value:'Djibouti', viewValue: 'Djibouti'},
    {value:'Dominica', viewValue: 'Dominica'},
    {value:'Dominican Republic', viewValue: 'Dominican Republic'},
    {value:'East Timor', viewValue: 'East Timor'},
    {value:'Ecuador', viewValue: 'Ecuador'},
    {value:'Egypt', viewValue: 'Egypt'},
    {value:'El Salvador', viewValue: 'El Salvador'},
    {value:'Equatorial Guinea', viewValue: 'Equatorial Guinea'},
    {value:'Eritrea', viewValue: 'Eritrea'},
    {value:'Estonia', viewValue: 'Estonia'},
    {value:'Ethiopia', viewValue: 'Ethiopia'},
    {value:'Falkland Islands', viewValue: 'Falkland Islands'},
    {value:'Faroe Islands', viewValue: 'Faroe Islands'},
    {value:'Fiji', viewValue: 'Fiji'},
    {value:'Finland', viewValue: 'Finland'},
    {value:'France', viewValue: 'France'},
    {value:'French Guiana', viewValue: 'French Guiana'},
    {value:'French Polynesia', viewValue: 'French Polynesia'},
    {value:'French Southern Territories', viewValue: 'French Southern Territories'},
    {value:'Gabon', viewValue: 'Gabon'},
    {value:'Gambia', viewValue: 'Gambia'},
    {value:'Georgia', viewValue: 'Georgia'},
    {value:'Germany', viewValue: 'Germany'},
    {value:'Ghana', viewValue: 'Ghana'},
    {value:'Gibraltar', viewValue: 'Gibraltar'},
    {value:'Greece', viewValue: 'Greece'},
    {value:'Greenland', viewValue: 'Greenland'},
    {value:'Grenada', viewValue: 'Grenada'},
    {value:'Guadeloupe', viewValue: 'Guadeloupe'},
    {value:'Guam', viewValue: 'Guam'},
    {value:'Guatemala', viewValue: 'Guatemala'},
    {value:'Guernsey', viewValue: 'Guernsey'},
    {value:'Guinea', viewValue: 'Guinea'},
    {value:'Guinea-Bissau', viewValue: 'Guinea-Bissau'},
    {value:'Guyana', viewValue: 'Guyana'},
    {value:'Haiti', viewValue: 'Haiti'},
    {value:'Heard Island and McDonald Islands', viewValue: 'Heard Island and McDonald Islands'},
    {value:'Honduras', viewValue: 'Honduras'},
    {value:'Hong Kong', viewValue: 'Hong Kong'},
    {value:'Hungary', viewValue: 'Hungary'},
    {value:'Iceland', viewValue: 'Iceland'},
    {value:'India', viewValue: 'India'},
    {value:'Indonesia', viewValue: 'Indonesia'},
    {value:'Iran', viewValue: 'Iran'},
    {value:'Iraq', viewValue: 'Iraq'},
    {value:'Ireland', viewValue: 'Ireland'},
    {value:'Isle of Man', viewValue: 'Isle of Man'},
    {value:'Israel', viewValue: 'Israel'},
    {value:'Italy', viewValue: 'Italy'},
    {value:'Ivory Coast', viewValue: 'Ivory Coast'},
    {value:'Jamaica', viewValue: 'Jamaica'},
    {value:'Japan', viewValue: 'Japan'},
    {value:'Jersey', viewValue: 'Jersey'},
    {value:'Jordan', viewValue: 'Jordan'},
    {value:'Kazakhstan', viewValue: 'Kazakhstan'},
    {value:'Kenya', viewValue: 'Kenya'},
    {value:'Kiribati', viewValue: 'Kiribati'},
    {value:'Kosovo', viewValue: 'Kosovo'},
    {value:'Kuwait', viewValue: 'Kuwait'},
    {value:'Kyrgyzstan', viewValue: 'Kyrgyzstan'},
    {value:'Laos', viewValue: 'Laos'},
    {value:'Latvia', viewValue: 'Latvia'},
    {value:'Lebanon', viewValue: 'Lebanon'},
    {value:'Lesotho', viewValue: 'Lesotho'},
    {value:'Liberia', viewValue: 'Liberia'},
    {value:'Libya', viewValue: 'Libya'},
    {value:'Liechtenstein', viewValue: 'Liechtenstein'},
    {value:'Lithuania', viewValue: 'Lithuania'},
    {value:'Luxembourg', viewValue: 'Luxembourg'},
    {value:'Macao', viewValue: 'Macao'},
    {value:'Macedonia', viewValue: 'Macedonia'},
    {value:'Madagascar', viewValue: 'Madagascar'},
    {value:'Malawi', viewValue: 'Malawi'},
    {value:'Malaysia', viewValue: 'Malaysia'},
    {value:'Maldives', viewValue: 'Maldives'},
    {value:'Mali', viewValue: 'Mali'},
    {value:'Malta', viewValue: 'Malta'},
    {value:'Marshall Islands', viewValue: 'Marshall Islands'},
    {value:'Martinique', viewValue: 'Martinique'},
    {value:'Mauritania', viewValue: 'Mauritania'},
    {value:'Mauritius', viewValue: 'Mauritius'},
    {value:'Mayotte', viewValue: 'Mayotte'},
    {value:'Mexico', viewValue: 'Mexico'},
    {value:'Micronesia', viewValue: 'Micronesia'},
    {value:'Moldova', viewValue: 'Moldova'},
    {value:'Monaco', viewValue: 'Monaco'},
    {value:'Mongolia', viewValue: 'Mongolia'},
    {value:'Montenegro', viewValue: 'Montenegro'},
    {value:'Montserrat', viewValue: 'Montserrat'},
    {value:'Morocco', viewValue: 'Morocco'},
    {value:'Mozambique', viewValue: 'Mozambique'},
    {value:'Myanmar', viewValue: 'Myanmar'},
    {value:'Namibia', viewValue: 'Namibia'},
    {value:'Nauru', viewValue: 'Nauru'},
    {value:'Nepal', viewValue: 'Nepal'},
    {value:'Netherlands', viewValue: 'Netherlands'},
    {value:'Netherlands Antilles', viewValue: 'Netherlands Antilles'},
    {value:'New Caledonia', viewValue: 'New Caledonia'},
    {value:'New Zealand', viewValue: 'New Zealand'},
    {value:'Nicaragua', viewValue: 'Nicaragua'},
    {value:'Niger', viewValue: 'Niger'},
    {value:'Nigeria', viewValue: 'Nigeria'},
    {value:'Niue', viewValue: 'Niue'},
    {value:'Norfolk Island', viewValue: 'Norfolk Island'},
    {value:'North Korea', viewValue: 'North Korea'},
    {value:'Northern Mariana Islands', viewValue: 'Northern Mariana Islands'},
    {value:'Norway', viewValue: 'Norway'},
    {value:'Oman', viewValue: 'Oman'},
    {value:'Pakistan', viewValue: 'Pakistan'},
    {value:'Palau', viewValue: 'Palau'},
    {value:'Palestinian Territory', viewValue: 'Palestinian Territory'},
    {value:'Panama', viewValue: 'Panama'},
    {value:'Papua New Guinea', viewValue: 'Papua New Guinea'},
    {value:'Paraguay', viewValue: 'Paraguay'},
    {value:'Peru', viewValue: 'Peru'},
    {value:'Philippines', viewValue: 'Philippines'},
    {value:'Pitcairn', viewValue: 'Pitcairn'},
    {value:'Poland', viewValue: 'Poland'},
    {value:'Portugal', viewValue: 'Portugal'},
    {value:'Puerto Rico', viewValue: 'Puerto Rico'},
    {value:'Qatar', viewValue: 'Qatar'},
    {value:'Republic of the Congo', viewValue: 'Republic of the Congo'},
    {value:'Reunion', viewValue: 'Reunion'},
    {value:'Romania', viewValue: 'Romania'},
    {value:'Russia', viewValue: 'Russia'},
    {value:'Rwanda', viewValue: 'Rwanda'},
    {value:'Saint Barthelemy', viewValue: 'Saint Barthelemy'},
    {value:'Saint Helena', viewValue: 'Saint Helena'},
    {value:'Saint Kitts and Nevis', viewValue: 'Saint Kitts and Nevis'},
    {value:'Saint Lucia', viewValue: 'Saint Lucia'},
    {value:'Saint Martin', viewValue: 'Saint Martin'},
    {value:'Saint Pierre and Miquelon', viewValue: 'Saint Pierre and Miquelon'},
    {value:'Saint Vincent and the Grenadines', viewValue: 'Saint Vincent and the Grenadines'},
    {value:'Samoa', viewValue: 'Samoa'},
    {value:'San Marino', viewValue: 'San Marino'},
    {value:'Sao Tome and Principe', viewValue: 'Sao Tome and Principe'},
    {value:'Saudi Arabia', viewValue: 'Saudi Arabia'},
    {value:'Senegal', viewValue: 'Senegal'},
    {value:'Serbia', viewValue: 'Serbia'},
    {value:'Serbia and Montenegro', viewValue: 'Serbia and Montenegro'},
    {value:'Seychelles', viewValue: 'Seychelles'},
    {value:'Sierra Leone', viewValue: 'Sierra Leone'},
    {value:'Singapore', viewValue: 'Singapore'},
    {value:'Sint Maarten', viewValue: 'Sint Maarten'},
    {value:'Slovakia', viewValue: 'Slovakia'},
    {value:'Slovenia', viewValue: 'Slovenia'},
    {value:'Solomon Islands', viewValue: 'Solomon Islands'},
    {value:'Somalia', viewValue: 'Somalia'},
    {value:'South Africa', viewValue: 'South Africa'},
    {value:'South Georgia and the South Sandwich Islands', viewValue: 'South Georgia and the South Sandwich Islands'},
    {value:'South Korea', viewValue: 'South Korea'},
    {value:'South Sudan', viewValue: 'South Sudan'},
    {value:'Spain', viewValue: 'Spain'},
    {value:'Sri Lanka', viewValue: 'Sri Lanka'},
    {value:'Sudan', viewValue: 'Sudan'},
    {value:'Suriname', viewValue: 'Suriname'},
    {value:'Svalbard and Jan Mayen', viewValue: 'Svalbard and Jan Mayen'},
    {value:'Swaziland', viewValue: 'Swaziland'},
    {value:'Sweden', viewValue: 'Sweden'},
    {value:'Switzerland', viewValue: 'Switzerland'},
    {value:'Syria', viewValue: 'Syria'},
    {value:'Taiwan', viewValue: 'Taiwan'},
    {value:'Tajikistan', viewValue: 'Tajikistan'},
    {value:'Tanzania', viewValue: 'Tanzania'},
    {value:'Thailand', viewValue: 'Thailand'},
    {value:'Togo', viewValue: 'Togo'},
    {value:'Tokelau', viewValue: 'Tokelau'},
    {value:'Tonga', viewValue: 'Tonga'},
    {value:'Trinidad and Tobago', viewValue: 'Trinidad and Tobago'},
    {value:'Tunisia', viewValue: 'Tunisia'},
    {value:'Turkey', viewValue: 'Turkey'},
    {value:'Turkmenistan', viewValue: 'Turkmenistan'},
    {value:'Turks and Caicos Islands', viewValue: 'Turks and Caicos Islands'},
    {value:'Tuvalu', viewValue: 'Tuvalu'},
    {value:'U.S. Virgin Islands', viewValue: 'U.S. Virgin Islands'},
    {value:'Uganda', viewValue: 'Uganda'},
    {value:'Ukraine', viewValue: 'Ukraine'},
    {value:'United Arab Emirates', viewValue: 'United Arab Emirates'},
    {value:'United Kingdom', viewValue: 'United Kingdom'},
    {value:'United States', viewValue: 'United States'},
    {value:'United States Minor Outlying Islands', viewValue: 'United States Minor Outlying Islands'},
    {value:'Uruguay', viewValue: 'Uruguay'},
    {value:'Uzbekistan', viewValue: 'Uzbekistan'},
    {value:'Vanuatu', viewValue: 'Vanuatu'},
    {value:'Vatican', viewValue: 'Vatican'},
    {value:'Venezuela', viewValue: 'Venezuela'},
    {value:'Vietnam', viewValue: 'Vietnam'},
    {value:'Wallis and Futuna', viewValue: 'Wallis and Futuna'},
    {value:'Western Sahara', viewValue: 'Western Sahara'},
    {value:'Yemen', viewValue: 'Yemen'},
    {value:'Zambia', viewValue: 'Zambia'},
    {value:'Zimbabwe', viewValue: 'Zimbabwe'}];
    
    
    fieldTypes: Keyvalue[] = [
        {id:'TEXTFIELD', param: 'TEXTFIELD'},
        {id:'DROPDOWN', param: 'DROPDOWN'},
        {id:'DATEFIELD', param: 'DATEFIELD'},
        {id:'PERCENTAGE', param: 'PERCENTAGE(%)'}
    ]

    dataTypes: Keyvalue[] = [
        {id:'NUMERIC', param: 'NUMERIC'},
        {id:'TEXT', param: 'TEXT'}        
    ]

    slideTypes: Keyvalue[] = [
      {id:'NEW', param: 'Add new slide'},
      {id:'SAME', param: 'Append to previous slide'},
    ] 


    

    reportMediums: Keyvalue[] = [
      {id:'excel', param: 'Excel'},
      {id:'pptx', param: 'PPT'},
    ] 


    resourceTypes: Keyvalue[] = [
      {id:'trainee', param: 'Trainees'},
      {id:'application', param: 'Applications'},
      {id:'servicebacklog', param: 'Service Backlog'},
      {id:'sprintbacklog', param: 'Sprint Backlog'},
      {id:'epic', param: 'Epics'},
      {id:'sprint', param: 'Sprint'},
      {id:'AT-sprint', param: 'AT Sprint Level'},
      {id:'ST-sprint', param: 'ST Sprint Level'},
      {id:'Others-sprint', param: 'OthersSprint'},
      {id:'ST-scope', param: 'ST Scope Level'},
      {id:'ST-scope-Process', param: 'ST Scope Level-Process'},
      {id:'ST-scope-Metrics', param: 'ST Scope Level-Metrics'},
      {id:'ST-scope-Reports', param: 'ST Scope Level-Reports'},
      {id:'ST-scope-Tools', param: 'ST Scope Level-Tools'},
      {id:'ST-scope-Governance', param: 'ST Scope Level-Governance'},
      //{id:'plan', param: 'Plans'},
      //{id:'learn', param: 'Learns'},
      //{id:'perform', param: 'Performs'},
      {id:'closure', param: 'Closure'},
      {id:'transition', param: 'Transition'}
    ]


    transitionOrgs: Keyvalue[] = []

    transitionOrgsMultiSelect = []

    operatorTypes: Keyvalue[] = [
      {id:'equal', param: '=='},
      {id:'greater_or_equal', param: '>='},
      {id:'less_or_equal', param: '<='},
      {id:'greater', param: '>'},
      {id:'less', param: '<'}
    ]    

    yn: Keyvalue[] = [
      {id:'Y', param: 'Y'},
      {id:'N', param: 'N'},
    ] 

    milestone_or_task: Keyvalue[] = [
      {id:'M', param: 'Milestone'},
      {id:'T', param: 'Task'},
    ] 

    read_write: Keyvalue[] = [
      {id:'READ', param: 'Read'},
      {id:'WRITE', param: 'Write'},
    ] 


    contentTypeCategories: Keyvalue[] = [
      {id:'TRANSITION', param: 'TRANSITION'},
      {id:'ORGANIZATION', param: 'ORGANIZATION'},
      {id:'GLOBAL', param: 'GLOBAL'}
    ] 

  constructor(public session: SessionStorageService, private http: HttpClient) {}

  getCountryList(): Country[] {  
        return this.countries;
  }


  getDataTypeList(): Keyvalue[] {  
        return this.dataTypes;
  }

  getFieldTypeList(): Keyvalue[]{
        return this.fieldTypes;
  }

  getResourceTypeList(): Keyvalue[]{
      return this.resourceTypes;
  }

  getOpeartorTypeList(): Keyvalue[]{
      return this.operatorTypes;
  }

  getTransitionOrgList(list): Keyvalue[]{

    return this.getDropdownValues('OwningTTS',list);
    //return this.transitionOrgs;
  }


  getTransitionOrgListMultiple(): any[]{
    this.getDropdownValues('OwningTTS',this.transitionOrgsMultiSelect);    
    return this.transitionOrgsMultiSelect;
  }

  getYN(): Keyvalue[]{
      return this.yn;
  }

  getMilestoneOrTask(){
      return this.milestone_or_task;
  }

  getReadWrite(){
      return this.read_write;
  }  

  getRecords(query): Observable<string[]>{
    

    //alert(this._getRecordsURL+encodeURIComponent(query));
    return this.http.get(this._getRecordsURL+(query)).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <string[]>response;
        }
          
    })) ;
  }


  getDropdownValues(dropDownKey, list){

       var query = "select Categoryvalues from adminprofile where FieldCategoryName='"+dropDownKey+"'";
       //list  = this.session.get('ADMIN_'+dropDownKey);
       if (this.session.get('ADMIN_'+dropDownKey) == null){               
            this.getRecords(query).subscribe((records:any[]) => {        
                    for(var i=0; i<records.length; i++) {

                            let keyValue: Keyvalue = {
                                id:'',
                                param:''
                            }  

                            keyValue.id = records[i].Categoryvalues;
                            keyValue.param = records[i].Categoryvalues;
                            list.push(keyValue);
                    }  
                    
                    //put it in the session
                    this.session.set('ADMIN_'+dropDownKey, list);    // to avoid conflict with other session variable   
            });         
       }else{
             list = this.session.get('ADMIN_'+dropDownKey);
       }
       return list;
  }

  getMoment(dateString){

    //alert("dateString "+dateString);
    if (dateString !== undefined) {
        var dateFields = dateString.split("-");

        var month = dateFields[0];
        var day = dateFields[1];
        var year = dateFields[2];
        return moment([year, month-1, day]);
    }
  }

  
  escapeSpecialChars (str) {   
    //console.log("Before replace "+str); 

    // Convert the string to pure string so append empty string
    return (str+"")
      .replace(/["]/g, '\\"')
      .replace(/[\"]/g, '\\"')
      .replace(/[\\]/g, '\\\\')
      .replace(/[\/]/g, '\\/')
      .replace(/[\b]/g, '\\b')
      .replace(/[\f]/g, '\\f')
      .replace(/[\n]/g, '\\n')
      .replace(/[\r]/g, '\\r')
      .replace(/[\t]/g, '\\t')
    ; 
  };

  

  getSlideTypes(){
    return this.slideTypes;
  }  

  getContentTypeCategories(){
    return this.contentTypeCategories;
  }

  
  getReportMediumTypes(){
    return this.reportMediums;
  }  

  escapeChar(textString, replaceChar, replacedChar){

      var finalText ="";
      var splitedText = (textString).split(replaceChar);
      //alert("splitedText.length "+splitedText.length);
      if (splitedText.length >1){
            finalText = splitedText[0];
            for(var i=1;i<splitedText.length;i++){
                  finalText = finalText +replacedChar+splitedText[i];
                  //alert("finalText "+finalText);
            }
      }else{
            finalText = textString;
      }

      return finalText;        
  }


}
