import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
// import { traineeinfo } from 'Services/class/globalimport.model';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';



const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet/csv;charset=utf-8';
const EXCEL_EXTENSION = '.csv';
const fmt = 'mm-dd-yyy';
@Injectable({
  providedIn: 'root'
})


export class TraineeService {

  baseURL = environment.baseUrl;
  constructor(private _http: HttpClient ) {
    // this.StakeLength = 0;
    }

    exportAsXLSX(): any {
      return this._http.get(this.baseURL + '/CreateExcel');
    }
    
    public exportAsExcelFile(colwidth: any[], excelFileName: string): void {

      const data = [
        ['Trainee_Name' , 'Trainee_email', 'Trainee_Role', 'Trainee_OnBoardDate', 'Trainee_Travel', 'Trainee_Skills', 'Trainee_Visa' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
        ['' , '', '', '', '', '', '' ],
          ];
          const Instruction = [
            ['Column Name', 'Format' , 'Example'],
            ['Trainee_Name' , 'Trainee First & Last Name' , 'TTSTools Support'],
            ['Trainee_email' , 'Trainee intranet ID' , 'ttstoolssupport@in.ibm.com'],
            ['Trainee_Role' , 'Trainee Role' , 'Developer'],
            ['Trainee_OnBoardDate' , 'Date should be in "mm-dd-yyyy"' , '02-20-2019'],
            ['Trainee_Travel' , '"Yes" or "No"' , 'Yes'],
            ['Trainee_Skills' , 'Trainee Techical Skills' , 'SAP, JAVA'],
            ['Trainee_Visa' , 'If Trainee_Travel= "Yes" then Trainee_Visa ="Yes" or "No"' , 'Yes']
          ];
               const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);
                const worksheet2: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(Instruction);
      console.log('worksheet', worksheet);
      const workbook: XLSX.WorkBook = { Sheets: {'data': worksheet, 'Instructions': worksheet2  }, SheetNames: ['data', 'Instructions'] };
      worksheet['!cols'] = colwidth;
                  worksheet2['!cols'] = colwidth;
                  const range = {
                    s: {
                        c: 3,
                        r: 0
                    },
                    e: {
                        c: 3,
                        r: 10
                    }
                };
                            for (let i = range.s.r + 1 ; i <= range.e.r; ++i) {
                       const ref = XLSX.utils.encode_cell({c: 3 , r : i});
                       console.log(ref);
                     worksheet[ref].z = fmt;
                             }
                                   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
      this.saveAsExcelFile(excelBuffer, "test.csv");
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
    }

    public TraineeNameKeywordResult(): any {
      return this._http.get(this.baseURL + '/TraineeNameKeyword');
   }
    public TraineeRoleKeywordResult(): any {
    return this._http.get(this.baseURL + '/TraineeRoleKeyword');
  }
  public TraineeEmailKeywordResult(): any {
    return this._http.get(this.baseURL + '/TraineeEmailKeyword');
  }
  public TraineeSkillsKeywordResult(): any {
    return this._http.get(this.baseURL + '/TraineeSkillsKeyword');
  }
  public TraineeTravelKeywordResult(): any {
    return this._http.get(this.baseURL + '/TraineeTravelKeyword');
  }
  public TraineeDataResult(id: string): any {
    return this._http.get(this.baseURL + '/TraineeDataResultKeyword/' + id);
  }
  public postAddTrainee(obj: any): any {
    console.log(obj);
      return this._http.post(this.baseURL + '/AddTrainee', obj );
   }
    public putUpdateTrainee(obj: any): any {
    console.log('inside Service');
      return this._http.put(this.baseURL + '/UpdateTrainee', obj);
  }
    public DeleteTrainee(obj: string): any {
    console.log('Trainee_SNO' + obj);
    return this._http.delete(this.baseURL + '/DeleteTrainee/' + obj);
  }

  public getDuplicateTrainee(obj: any): any {
    const newParam = 'USER_NAME=' + obj.TransitionTeamName + '&TRANSITION_ID=' + obj.IntegrationID;
     return this._http.get(this.baseURL + '/getDuplicateTrainee?' + newParam);
  }

  getEmployeeDirectory(obj: string): any {

    const newParam = 'USERNAME=' + obj;
       return this._http.get(this.baseURL + '/getEmployeeDirectory?' + newParam );

  }

  createStandardActivity(traineeImportParameter: any): any {
    return this._http.post(this.baseURL + '/ImportTrainee', traineeImportParameter);   
  }


  // getexecelfile(traineeImportParameter: any): any{
  //   console.log("Service"+traineeImportParameter)
  //   return this._http.get(this.baseURL + '/getexcelTrainee?'+ traineeImportParameter);  
  // }

  getexecelfile(obj: string): any {
    const newParamex = 'USERNM=' + obj;
    return this._http.get(this.baseURL + '/getexcelTrainee?' + newParamex );  
  }

  ViewUploadexecelfile(USERIDUpload: string): any{
    // console.log(traineeImportParameter)
    return this._http.get(this.baseURL + '/ViewUploadexecelTrainee/'+ USERIDUpload);  
  }

  getTraineeIntranetID(obj: string): any {
    const newParam = 'USERID=' + obj;
       return this._http.get(this.baseURL + '/gettraineeIntranetID?' + newParam );

  }

  TestApp(testapp: any): any{

    console.log(this.baseURL + '/TestAppInfo?' + testapp)
   return this._http.get(this.baseURL + '/TestAppInfo?' + testapp );

  }

}
