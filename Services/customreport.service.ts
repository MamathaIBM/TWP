import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CustomReport } from 'Vo/customreport';
import { UtilityService } from './utility.service';

@Injectable({
  providedIn: 'root'
})


export class CustomReportService {

  AdminbaseUrl = environment.AdminbaseUrl;

  private _getCustomReportListURL = this.AdminbaseUrl+"/tnt/customReports/";
  private _getCustomReportListAdminURL = this.AdminbaseUrl+"/tnt/customReportsAdmin/";
  
  private _createCustomReportURL = this.AdminbaseUrl+"/tnt/customReport/";
  


  private _createCustomReportAdminURL = this.AdminbaseUrl+"/tnt/customReportAdmin/";
  private _updateCustomReportURL = this.AdminbaseUrl+"/tnt/customReport/";
  private _updateCustomReportAdminURL = this.AdminbaseUrl+"/tnt/customReportAdmin/";
  private _deleteCustomReportURL = this.AdminbaseUrl+"/tnt/customReport/";
  private _deleteCustomReportAdminURL = this.AdminbaseUrl+"/tnt/customReportAdmin/";
  private _getCustomReportDataURL = this.AdminbaseUrl+"/tnt/customReport/";
  private _getCustomReportDataAdminURL = this.AdminbaseUrl+"/tnt/customReportAdmin/";
  

  private _uploadImageURL = this.AdminbaseUrl+"/tnt/uploadImage/";
  private _downloadImageURL = this.AdminbaseUrl+"/tnt/downloadImage/";  

  private _generatePPTReportURL = this.AdminbaseUrl+"/tnt/generatePPTReport/";
  private _generateExcelReportURL = this.AdminbaseUrl+"/tnt/generateExcelCustomReport/";
  private _generateAllMediaCustomReportURL = this.AdminbaseUrl+"/tnt/generateAllMediaCustomReport/";


  constructor(private http: HttpClient, private utility: UtilityService) { }


  getCustomReportData(transitionId, customReport_id,customOrAdmin,reportType): Observable<CustomReport[]> {

    console.log("getCustomReportData");

    var tmpURL = "";
    if (customOrAdmin == 'custom'){
             tmpURL = this._getCustomReportDataURL+transitionId+"/"+customReport_id;
    }else{
             tmpURL = this._getCustomReportDataAdminURL+customReport_id+"/"+reportType;
    }


    //alert("tmpURL "+tmpURL);

    return this.http.get(tmpURL).pipe(
    map((response: Response) => {
      
    console.log("getCustomReportListData Response");
      if(Array.isArray(response)) {
        return <CustomReport[]>response;
      }
     
    })) ;

  }

  createCustomReport(customReportParameter, transitionId, customOrAdmin, reportType): Observable<CustomReport[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("createCustomReport Service ");
    console.log(customReportParameter);

    var tmpURL = "";
    if (customOrAdmin == 'custom'){
             tmpURL = this._createCustomReportURL+transitionId;
    }else{
             tmpURL = this._createCustomReportAdminURL+reportType;
    }
    

    //alert("tmpURL "+tmpURL);

    return this.http.post(tmpURL , customReportParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <CustomReport[]>response;
        }
          
      })) ;

  }


  updateCustomReport( customReportParameter, transitionId, customReport_id, customOrAdmin, reportType): Observable<CustomReport[]>{

    const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateCustomReport Service ");
    console.log(customReportParameter);

    var tmpURL = "";
    if (customOrAdmin == 'custom'){
             tmpURL = this._updateCustomReportURL+transitionId+"/"+customReport_id
    }else{
             tmpURL = this._updateCustomReportAdminURL+customReport_id+"/"+reportType;
    }    

    return this.http.put(tmpURL , customReportParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <CustomReport[]>response;
        }
          
    })) ;
  }


  deleteCustomReport( customReport_id, customOrAdmin): Observable<CustomReport[]>{
    console.log("deleteCustomReport Service ");
    console.log(" customReport_id "+customReport_id);


    var tmpURL = "";
    if (customOrAdmin == 'custom'){
             tmpURL = this._deleteCustomReportURL+customReport_id
    }else{
             tmpURL = this._deleteCustomReportAdminURL+customReport_id;
    }  

    return this.http.delete(tmpURL ).pipe(
      map((response: Response) => {  
        if(Array.isArray(response)) {
          return <CustomReport[]>response;
        }          
    })) ;
  }


  getCustomReportList(transitionId, customOrAdmin, reportType): Observable<CustomReport[]>{

    console.log("getCustomReportList Service ");
    

    if (customOrAdmin == 'custom'){

        return this.http.get(this._getCustomReportListURL+transitionId).pipe(

          map((response: Response) => {
      
            if(Array.isArray(response)) {
                  return <CustomReport[]>response;
            }
              
        })) ;

    }else{

        return this.http.get(this._getCustomReportListAdminURL+reportType).pipe(

          map((response: Response) => {
      
            if(Array.isArray(response)) {
                 return <CustomReport[]>response;
            }
              
        })) ;      

    }

  }

  
  imageUpload(fileToUpload: File, transitionId:string, reportType:string, customOrAdmin:string): Observable<any> {


    //alert("imageUpload 1");
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type':'multipart/form-data' })
    };

    let imageheaders = new Headers();
    imageheaders.append('Content-Type','multipart/form-data');
    const endpoint = this._uploadImageURL+transitionId+"/"+reportType+"/"+customOrAdmin;
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload);
    //formData.append('transitionId', transitionId);
    //formData.append('reportId', reportId);
    //alert("imageUpload 1.1")
    return this.http.post(endpoint, formData).map((response: Response) => { 
      return response; 
    })

    /*
    return this.http.post(endpoint, formData).pipe(
      
      map((response: Response) => {
        alert("imageUpload 2");
        return response;
          
    })) ;
    */


  }


  imageDownload(transitionId:string, reportId:string): Observable<any> {

    return this.http.get(this._downloadImageURL).pipe(
      map((response: Response) => {  
           return response;          
      })) ;

  }

  getImage(filename,transitionId,reportType, customOrAdmin): Observable<Blob> {
       //alert("getImage 1");       
       return this.http.get(this._downloadImageURL+transitionId+"/"+filename+"/"+reportType+"/"+customOrAdmin, { responseType: 'blob' });
  }


  generateAllMediaCustomReport( transitionId,reportId,customOrAdmin, reportType, reportMedium): Observable<any[]>{

    const httpOptions = {
          headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("generateReport");
    

    var tmpURL = '';


    /*

    if (reportMedium == 'excel')    
         tmpURL = this._generateExcelReportURL+transitionId+"/"+reportId+"/"+customOrAdmin+"/"+reportType+"/"+reportMedium;
    if (reportMedium == 'ppt')    
         tmpURL = this._generatePPTReportURL+transitionId+"/"+reportId+"/"+customOrAdmin+"/"+reportType+"/"+reportMedium;

    */     
    tmpURL = this._generateAllMediaCustomReportURL+transitionId+"/"+reportId+"/"+customOrAdmin+"/"+reportType+"/"+reportMedium;     

    //alert("generatePPTReport called "+this._generatePPTReportURL+transitionId)
    return this.http.post(tmpURL, "[]", httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <any[]>response;
        }
          
    })) ;

  }


  escapeSpecialChar(reportName){
    reportName = this.utility.escapeChar(reportName, "\n", " ");
    reportName = this.utility.escapeChar(reportName, "\\", "\\\\");
    reportName = this.utility.escapeChar(reportName,'"','\\"'); 
    reportName = this.utility.escapeChar(reportName, "'", "\\\\'");

    //alert(reportName);
    
    return reportName;
  }


  escapeSpecialCharForReportBody(reportName){
    reportName = this.utility.escapeChar(reportName, "\n", " ");
    reportName = this.utility.escapeChar(reportName, "\\", "\\\\");
    reportName = this.utility.escapeChar(reportName,'"','\\"'); 

    //alert(reportName);
    
    return reportName;
  }  

}