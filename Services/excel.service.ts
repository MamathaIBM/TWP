import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';

const EXCEL_EXTENSION = '.xlsx';


@Injectable({
  providedIn: 'root'
})


export class ExcelService {


letters:any[]=[ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

baseURL = environment.baseUrl


constructor(private http: HttpClient) { }


    public exportAsExcelFile(json: any[], excelFileName: string): void {
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
        const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };


        var wscols = [
          {wch:40},
          {wch:30},
          {wch:30},
          {wch:30},
          {wch:30},
          {wch:30},
          {wch:30},
          {wch:30}
      ];
      
      worksheet['!cols'] = wscols;

        const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        this.saveAsExcelFile(excelBuffer, excelFileName);
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
          const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
          FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
    }

    public getExcelColumnName(x){

         var colNameReverse:any[]=[];         
         var rem = 0;
         var res = 0;
         var colName = "";

         rem = x % 26;
         res = x / 26;
         

         if (rem == 0){
                colNameReverse.push('Z');
         }else{
                colNameReverse.push(this.letters[rem-1]);
                //alert("Here 1 "+this.letters[rem-1]);
         }

         while (res > 1){
                colNameReverse.push(this.letters[res-1]);    
                //alert("Here 2 "+this.letters[res-1]);         
                res = res - 1;
         }

         for(var i=colNameReverse.length; i>0; i-- ){
                colName = colName + colNameReverse[i-1];
                //alert("Here Loop "+colName);
         }
         //alert(colName);
         return colName;

    }

    public getCellAddress(i,j){
          return this.getExcelColumnName(i) +j.toString();
    }

}

