import { ApplicationInfo } from './../class/AppInfo.model';
import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable} from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet/csv;charset=utf-8';
const EXCEL_EXTENSION = '.csv';

@Injectable({
  providedIn: 'root'
})
export class ApplicationInformationService {
  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {
  }
  public exportAsExcelFile(json: any[], json1: any[], colwidth: any[], excelFileName: string): void {
      const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
      const worksheet2: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json1);
      console.log('worksheet', worksheet);
      const workbook: XLSX.WorkBook = { Sheets: {'data': worksheet, 'Instructions': worksheet2  }, SheetNames: ['data', 'Instructions'] };
      worksheet['!cols'] = colwidth;
      worksheet2['!cols'] = colwidth;
      const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      this.saveAsExcelFile(excelBuffer, excelFileName);
    }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    console.log(fileName)
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
  public getApplnInfo1(id: string): Observable<ApplicationInfo[]> {
    console.log(this.baseUrl + '/getApplnInfo/' + id);
     return this.http.get<ApplicationInfo[]>(this.baseUrl + '/getApplnInfo/' + id);
   }

  public getApplnInfo(id: string): any {
   // console.log(this.baseUrl+"/getApplnInfo" )
    return this.http.get(this.baseUrl + '/getApplnInfo/' + id );
  }

  public postApplnInfo(obj: any): any {
    // console.log(this.baseUrl+"/getApplnInfo" )
     return this.http.post(this.baseUrl + '/appInfoSave', obj );

   }

   public putApplnInfo(obj: any): any {
    // console.log(this.baseUrl+"/getApplnInfo" )
     return this.http.put(this.baseUrl + '/appInfoUpdate', obj );

   }

   public deleteApplnInfo(obj: string): any {
    // console.log(this.baseUrl+"/getApplnInfo" )
     return this.http.delete(this.baseUrl + '/appInfoDelete/' + obj );

   }

   public getDuplicateAppInfoResult(obj: any): any {
    const newParam = 'AppName=' + obj.AppName + '&IntegrationID=' + obj.IntegrationID;
     return this.http.get(this.baseUrl + '/DuplicateAPPInfo?' + newParam);
   }

   public getComplexity(): any {
    return this.http.get(this.baseUrl + '/ComplexityKeyword' );
  }

  public getCriticality(): any {
    return this.http.get(this.baseUrl + '/CriticalityKeyword' );
  }
  public getTechnology(): any {
    return this.http.get(this.baseUrl + '/TechnologyKeyword' );
  }
  public getVendor(): any {
    return this.http.get(this.baseUrl + '/VendorKeyword' );
  }
  public getapp_Category(): any {
    return this.http.get(this.baseUrl + '/app_CategoryKeyword' );
  }

  public getBooleanKeyword(): any {
    return this.http.get(this.baseUrl + '/CommonBooleanKeyword' );
  }
  
  public getappSize(): any {
    return this.http.get(this.baseUrl + '/appsizeKeyword' );
  }

  public getappFunctionsValue(): any {
    return this.http.get(this.baseUrl + '/appFunctionsValueKeyword' );
  }

  public getappLinesValue(): any {
    return this.http.get(this.baseUrl + '/appLinesValueKeyword' );
  }

  public getApplicationTypeValue(): any {
    return this.http.get(this.baseUrl + '/appApplicationTypeKeyword' );
  }

  UploadApplicationinfo(AppInfoImportParameter: any): any {
        return this.http.post(this.baseUrl + '/ImportAppInfo', AppInfoImportParameter);
  }

  public ViewAppUploadexecelfile(USERIDUpload: string): any{
    // const newParam = 'USERIDUpload='+USERIDUpload;
    // console.log(this.baseUrl + '/ViewUploadeAppInfo?' + newParam)
    return this.http.get(this.baseUrl + '/ViewUploadeAppInfo/'+ USERIDUpload);  
  }

  getAppInfoexecelfile(obj: string): Observable<ApplicationInfo[]> {
    const newParam = 'username=' + obj.split(' ')[0]
    console.log("newParam"+newParam)    
    return this.http.get<ApplicationInfo[]>(this.baseUrl + '/getexcelAppInfo?' + newParam);  
  }
  }
