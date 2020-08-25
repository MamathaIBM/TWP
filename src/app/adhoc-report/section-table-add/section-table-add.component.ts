import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormArray, FormControl } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker, MatTableDataSource, MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { UtilityService } from 'Services/utility.service';
import * as XLSX from 'xlsx';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';
import { NavtntService } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';
import { of, Observable } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { Section } from 'Vo/section';
import { Customcolumn } from 'Vo/customcolumn';
import { ContentType } from 'Vo/contenttype';
import { ContentTypeService } from 'Services/contenttype.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from 'Services/excel.service';
import { CustomReportService } from 'Services/customreport.service';



export interface DialogData {
  jsonTest: string;
  reportType:string;
}


@Component({
  selector: 'app-section-table-add',
  templateUrl: './section-table-add.component.html',
  styleUrls: ['./section-table-add.component.css']
})
export class SectionTableAddComponent implements OnInit {

  slideTypes: Keyvalue[] = [];
  sectionTableAddForm: FormGroup;
  sectionTableAdd1Form: FormGroup;
  selfReference:any;
  columns:any[]=[];
  columnKeyValue: KeyValue={};
  errorReason="";
  reportType:'';
  customOrAdmin:'';

  sectionTable: Section = {
        sectionName:'',
        sectionContent:'',
  }

  columnList:any[]=[];
  rowDataList:any[]=[];

  dataSource = new MatTableDataSource;
  displayedColumns:any[]=[];
  dataLength = 0;
  dataLoaded: Observable<{}>;
  rowObjects:any[]=[];

  components = [];
  container:any;
  tabs:FormArray;
  dataTime:string ="";

  

  constructor(
              private navigation: NavtntService, 
              private utility: UtilityService,
              private fb: FormBuilder, 
              public dialog: MatDialog,
              private datePipe: DatePipe, 
              private customReportService: CustomReportService             
              ) {
                  this.sectionTableAddForm = fb.group({
                      sectionName:[''],                      
                      sectionSlide:[''],                        
                      positionX:['5'],   
                      positionY:['5'], 
                      fontSize:['20'],     
                      bodyColor:['F1F1F1'],
                      titleColor:['FFFF00'],
                      titleBgColor:['0088CC'],
                      titleFontSize:['20'],
                      titleHeight:['7'],
                      bodyHeight:['50']                                                     
                                 
                  });  
                  
              
            
              this.sectionTableAdd1Form = this.fb.group({
                    tabs:this.fb.array([])                
              }); 
              
              this.tabs = this.sectionTableAdd1Form.get('tabs') as FormArray;     
              
              
                     
  }

  ngOnInit() {  
              

             this.slideTypes = this.utility.getSlideTypes();

             /*
              this.sectionTableAdd1Form = this.fb.group({
                  tabs:this.fb.array([])
                            
                });

            this.tabs = this.sectionTableAdd1Form.get('tabs') as FormArray;
            */
                
              

  }

  removeSelf(){

    if (confirm("Are you sure you want to delete? Delete will be effective after you Save.")){

            const componentIndex = this.components.indexOf(this.selfReference);
            this.container.remove(this.container.indexOf(this.selfReference));
            this.components.splice(componentIndex, 1);
            
            try{
                  this.selfReference.destroy();
            }
            catch(e){
            }

    }

   }


   getSectionData(){
        //alert("getSectionData");
        //return '{"section_data":{"section_name":"'+this.sectionTableAddForm.controls['sectionName'].value+'","section_content":"'+this.sectionTableAddForm.controls['sectionContent'].value+'"}}';       



        //alert(this.rowDataList.length);

        var data = "";
        for(var i=1; i<this.rowDataList.length+1; i++){

              var row = "";
              for(var j=0; j<this.columnList.length; j++){

                  //alert("Value "+(<FormArray>this.sectionTableAdd1Form.get('tabs'))['controls'][i*this.columnList.length+ j].value);

                  var inputValue = this.customReportService.escapeSpecialCharForReportBody((<FormArray>this.sectionTableAdd1Form.get('tabs'))['controls'][i*this.columnList.length+ j].value);

                  if (j==0){
                         row = '"'+inputValue+'"';
                  }else{
                         row = row+","+'"'+inputValue+'"';
                  }  

                  //alert("Cell value "+j+ " "+row);
              }

              

              row = "["+row +"]";

              if (i==1){
                        data = row;
              }else{
                       data = data + ","+ row; 
              }
        }

        data = "["+data +"]";   
        
        //alert("data "+data);
        console.log("Table data to be saved "+data);
                
        //var data = '{"header": ["col1", "col2"],"data": [["r11", "r12"],["r21", "r22"]]}';

        var header ="";
        for(var j=0; j<this.columnList.length; j++){

             if (j==0){
                     header = '"'+this.columnList[j]+'"';
             }else{
                     header = header +"," + '"'+this.columnList[j]+'"';
             }               
        }  
        
        header = "[" + header + "]";

        //alert('{"header":'+header+ ","+  '"data":'+ data+'}');


        //return '{"header":'+header+ ","+  '"data":'+ data+'}';

        //alert("Table data being saved is "+'{"section_data":{"section_name":"'+this.sectionTableAddForm.controls['sectionName'].value+'","section_type":"table", "section_content":{"header":'+header+ ', "data_time":"'+this.dataTime+'", "data":'+ data+"}}}");

        //alert("this.sectionTableAddForm.controls['positionX'].value"+this.sectionTableAddForm.controls['positionX'].value);
        //alert("this.sectionTableAddForm.controls['positionY'].value"+this.sectionTableAddForm.controls['positionY'].value);
        //alert("this.sectionTableAddForm.controls['bodyColor'].value"+this.sectionTableAddForm.controls['bodyColor'].value);

        console.log("Returened data "+'{"section_data":{"section_name":"'+this.sectionTableAddForm.controls['sectionName'].value+'","section_type":"table", "section_content":{"header":'+header+ ', "data_time":"'+this.dataTime+'", "data":'+ data +"}" +              
        ',"section_position_x":"'+this.sectionTableAddForm.controls['positionX'].value+
        '","section_position_y":"'+this.sectionTableAddForm.controls['positionY'].value+  
        '","section_font_size":"'+this.sectionTableAddForm.controls['fontSize'].value+ 
        '","section_body_color":"'+this.sectionTableAddForm.controls['bodyColor'].value+  
        '","section_title_color":"'+this.sectionTableAddForm.controls['titleColor'].value+  
        '","section_title_bg_color":"'+this.sectionTableAddForm.controls['titleBgColor'].value+  
        '","section_title_height":"'+this.sectionTableAddForm.controls['titleHeight'].value+  
        '","section_title_font_size":"'+this.sectionTableAddForm.controls['titleFontSize'].value+  
        '","section_body_height":"'+this.sectionTableAddForm.controls['bodyHeight'].value+     
        '" }}');

        return '{"section_data":{"section_name":"'+this.customReportService.escapeSpecialCharForReportBody(this.sectionTableAddForm.controls['sectionName'].value)+'","section_type":"table", "section_content":{"header":'+header+ ', "data_time":"'+this.dataTime+'", "data":'+ data +"}" +              
                  ',"section_position_x":"'+this.sectionTableAddForm.controls['positionX'].value+
                  '","section_position_y":"'+this.sectionTableAddForm.controls['positionY'].value+  
                  '","section_font_size":"'+this.sectionTableAddForm.controls['fontSize'].value+ 
                  '","section_body_color":"'+this.sectionTableAddForm.controls['bodyColor'].value+  
                  '","section_title_color":"'+this.sectionTableAddForm.controls['titleColor'].value+  
                  '","section_title_bg_color":"'+this.sectionTableAddForm.controls['titleBgColor'].value+  
                  '","section_title_height":"'+this.sectionTableAddForm.controls['titleHeight'].value+  
                  '","section_title_font_size":"'+this.sectionTableAddForm.controls['titleFontSize'].value+  
                  '","section_body_height":"'+this.sectionTableAddForm.controls['bodyHeight'].value+     
                  '" }}';
   }




   getContent(): void {

    //alert("this.reportType "+this.reportType);  
    const dialogRef = this.dialog.open(ContentTypeDialog, {
      width: '12000px',
      height:'400px',
      maxHeight:'400px',
      autoFocus: false,
      data: {jsonTest: '',  reportType:this.reportType}
    });

    dialogRef.componentInstance.parentReference = this;

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
    });
  }

  openExcelUpload(): void {
 
      const dialogRef = this.dialog.open(ExcelUploadDialog, {
            width: '12000px',
            height:'400px',
            maxHeight:'400px',
            autoFocus: false,
            data: {jsonTest: '',  reportType:this.reportType}
      });
  
      dialogRef.componentInstance.parentReference = this;
  
      dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');        
      });
  }

  processContent(jsonData){
      //alert(jsonData);
      var jsonParsedData = JSON.parse(jsonData)

      
      //alert(jsonParsedData.header);
      this.formTable(jsonParsedData);
      this.sectionTable.sectionContent = jsonParsedData;    
      //alert("jsonParsedData "+jsonParsedData);  
      console.log("Saving table data  "+jsonParsedData);
  }


  formTable(jsonTabData){

            //Empty the previous value
            this.displayedColumns = [];
            this.columnKeyValue = {};
            this.rowObjects = [];
            //Emptying form array
            while (this.tabs.length) {
                  this.tabs.removeAt(0);
               }

            var columnList = jsonTabData.header;
            var rowDataList = jsonTabData.data;
            //alert("jsonTabData.data "+jsonTabData.data);
           
            this.dataTime = jsonTabData.data_time;

            this.columnList = columnList;
            this.rowDataList = rowDataList;

            for(var i=0; i<columnList.length;i++ ){
                    let customcolumn: Customcolumn = {
                          name:'',
                          position:-1,   
                    }

                    customcolumn.name = columnList[i];
                    customcolumn.position = i;

                    this.columns.push(customcolumn);

                    this.displayedColumns.push(''+customcolumn.name);
                    this.columnKeyValue[''+customcolumn.name] = customcolumn.name;  
            }

            for(var i=0;i<rowDataList.length;i++){
                    let rowData = rowDataList[i];
                    let obj={};
                    obj = this.getFormControlsRowData(rowDataList[i], columnList);
                    this.rowObjects.push(obj);
            }

            // Dynamic form control

            //Column headers
            for(var i=0; i<columnList.length; i++) {  
                  this.tabs.push(this.fb.control(columnList[i]));                               
            }  

             // Dynamic form control
            for(var i=0;i<rowDataList.length;i++){
                    let rowData = rowDataList[i];
                    for(var j=0;j<rowData.length;j++){
                       
                       this.tabs.push(this.fb.control(rowData[j]));  
                    }
            }

            
           this.dataSource.data = this.rowObjects;                       
           this.dataLength =  this.dataSource.data.length;

           //this.dataLoaded = this.loadData().pipe(share()); 
  }

  populateData(data){


      for(var i=this.columnList.length; i<this.columnList.length;i++){  
           alert("  data value of i = "+(<FormArray>this.sectionTableAdd1Form.get('tabs'))['controls'][i].value.answer);
      }

      this.setSectionName(data.section_data.section_name);
      this.setSectionContent(data.section_data.section_content);  
      this.dataTime = data.section_data.section_content.data_time;
      this.setSectionSlide(data.section_data.section_slide);  
      this.setSectionX(data.section_data.section_position_x);  
      this.setSectionY(data.section_data.section_position_y);  
      this.setFontSize(data.section_data.section_font_size);  
      this.setBodyColor(data.section_data.section_body_color); 
      this.setTitleColor(data.section_data.section_title_color); 
      this.setTitleBgColor(data.section_data.section_title_bg_color);  
      this.setTitleHeight(data.section_data.section_title_height); 
      this.setTitleFontSize(data.section_data.section_title_font_size); 
      this.setBodyHeight(data.section_data.section_body_height);    

  }
                       
  setSectionContent(jsonTabData){


      //alert(jsonTabData);
      this.formTable(jsonTabData);
  }

  setSectionName(sectionName){
      this.sectionTableAddForm.controls['sectionName'].setValue(sectionName);
  }

  getFormControlsRowData(rowData,columnList ){
         var obj = {};          
         for(var i=0; i<columnList.length; i++) {               
               obj[''+columnList[i]]=rowData[i];                                
         }                                  
         return obj;
    }


    loadData() {
      // Fake Slow Async Data
      return of({
        dataLoaded: true
      }).pipe(
              delay(0)
      );
    }

    goUp(){

      var x= this.container.indexOf(this.selfReference);
      if (x>0){            
              this.container.detach(x);
              this.container.insert(this.selfReference,x-1);
      }

    }

      goDown(){
            var x= this.container.indexOf(this.selfReference);
            if (x< (this.container.length-1)){
            
            this.container.detach(x);
            this.container.insert(this.selfReference,x+1);
            }     
      }

      setSectionSlide(sectionSlide){
            this.sectionTableAddForm.controls['sectionSlide'].setValue(sectionSlide);   
        }
      
        setSectionX(positionX){
            this.sectionTableAddForm.controls['positionX'].setValue(positionX);   
        }   
      
        setSectionY(positionY){
            this.sectionTableAddForm.controls['positionY'].setValue(positionY);   
        }   
      
         setFontSize(fontSize){
             this.sectionTableAddForm.controls['fontSize'].setValue(fontSize);   
         }   
      
         setBodyColor(bodyColor){
             this.sectionTableAddForm.controls['bodyColor'].setValue(bodyColor);   
         }   
      
         setTitleColor(titleColor){
             this.sectionTableAddForm.controls['titleColor'].setValue(titleColor);   
         }   
         
         setTitleBgColor(titleBgColor){
             this.sectionTableAddForm.controls['titleBgColor'].setValue(titleBgColor);   
         }  
         
      
         setTitleHeight(titleHeight){
             this.sectionTableAddForm.controls['titleHeight'].setValue(titleHeight);   
         }   

         setTitleFontSize(titleFontSize){
             this.sectionTableAddForm.controls['titleFontSize'].setValue(titleFontSize);   
         }           
         
         setBodyHeight(bodyHeight){
             this.sectionTableAddForm.controls['bodyHeight'].setValue(bodyHeight);   
         }          


         validate(){

            var validationResult = true;
            if (this.sectionTableAddForm.controls['positionX'].value.trim() == ''){
                  this.errorReason = "X can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['positionX'].value.trim() <0){
                  this.errorReason = "X can't be negative";
                  validationResult = false;
                  return validationResult;
            }

            if (typeof this.sectionTableAddForm.controls['positionX'].value.trim() === "string" && Number.isNaN(Number(this.sectionTableAddForm.controls['positionX'].value.trim()))) {
            
                  this.errorReason = "X must be number";
                  validationResult = false;
                  return validationResult;
            }     
            
            if (this.sectionTableAddForm.controls['positionY'].value.trim() == ''){
                  this.errorReason = "Y can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['positionY'].value.trim() <0){
                  this.errorReason = "Y can't be negative";
                  validationResult = false;
                  return validationResult;
            }

            if (typeof this.sectionTableAddForm.controls['positionY'].value.trim() === "string" && Number.isNaN(Number(this.sectionTableAddForm.controls['positionY'].value.trim()))) {
            
                  this.errorReason = "Y must be number";
                  validationResult = false;
                  return validationResult;
            }   

            // Font Size     
            if (this.sectionTableAddForm.controls['fontSize'].value.trim() == ''){
                  this.errorReason = "Tab text size can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['fontSize'].value.trim() <0){
                  this.errorReason = "Tab text size can't be negative";
                  validationResult = false;
                  return validationResult;
            }

            if (typeof this.sectionTableAddForm.controls['fontSize'].value.trim() === "string" && Number.isNaN(Number(this.sectionTableAddForm.controls['fontSize'].value.trim()))) {
            
                  this.errorReason = "Tab text size must be number";
                  validationResult = false;
                  return validationResult;
            }  

            //  Body Color
            if (this.sectionTableAddForm.controls['bodyColor'].value.trim() == ''){
                  this.errorReason = "Tab background color can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['bodyColor'].value.trim() <0){
                  this.errorReason = "Tab background color can't be negative";
                  validationResult = false;
                  return validationResult;
            }


            // Title color
            if (this.sectionTableAddForm.controls['titleColor'].value.trim() == ''){
                  this.errorReason = "Title text color can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['titleColor'].value.trim() <0){
                  this.errorReason = "Title text color can't be negative";
                  validationResult = false;
                  return validationResult;
            }  
            
            // Title background color
            if (this.sectionTableAddForm.controls['titleBgColor'].value.trim() == ''){
                  this.errorReason = "Title background color can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['titleBgColor'].value.trim() <0){
                  this.errorReason = "Title background color can't be negative";
                  validationResult = false;
                  return validationResult;
            }     
            //Title height       
            if (this.sectionTableAddForm.controls['titleHeight'].value.trim() == ''){
                  this.errorReason = "Title height can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['titleHeight'].value.trim() <0){
                  this.errorReason = "Title height can't be negative";
                  validationResult = false;
                  return validationResult;
            }

            if (typeof this.sectionTableAddForm.controls['titleHeight'].value.trim() === "string" && Number.isNaN(Number(this.sectionTableAddForm.controls['titleHeight'].value.trim()))) {
            
                  this.errorReason = "Title height must be number";
                  validationResult = false;
                  return validationResult;
            }    
            // Title font size
            if (this.sectionTableAddForm.controls['titleFontSize'].value.trim() == ''){
                  this.errorReason = "Title font size can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['titleFontSize'].value.trim() <0){
                  this.errorReason = "Title font size can't be negative";
                  validationResult = false;
                  return validationResult;
            }

            if (typeof this.sectionTableAddForm.controls['titleFontSize'].value.trim() === "string" && Number.isNaN(Number(this.sectionTableAddForm.controls['titleFontSize'].value.trim()))) {
            
                  this.errorReason = "Title font size must be number";
                  validationResult = false;
                  return validationResult;
            } 
            //Section body height
            if (this.sectionTableAddForm.controls['bodyHeight'].value.trim() == ''){
                  this.errorReason = "Table height can't be empty";
                  validationResult = false;
                  return validationResult;
            }

            if (this.sectionTableAddForm.controls['bodyHeight'].value.trim() <0){
                  this.errorReason = "Table height can't be negative";
                  validationResult = false;
                  return validationResult;
            }

            if (typeof this.sectionTableAddForm.controls['bodyHeight'].value.trim() === "string" && Number.isNaN(Number(this.sectionTableAddForm.controls['bodyHeight'].value.trim()))) {
            
                  this.errorReason = "Table height must be number";
                  validationResult = false;
                  return validationResult;
            }                           

            return validationResult;
      


           /*
            ',"section_position_x":"'+this.sectionTableAddForm.controls['positionX'].value+
            '","section_position_y":"'+this.sectionTableAddForm.controls['positionY'].value+  
            '","section_font_size":"'+this.sectionTableAddForm.controls['fontSize'].value+ 
            '","section_body_color":"'+this.sectionTableAddForm.controls['bodyColor'].value+  
            '","section_title_color":"'+this.sectionTableAddForm.controls['titleColor'].value+  
            '","section_title_bg_color":"'+this.sectionTableAddForm.controls['titleBgColor'].value+  
            '","section_title_height":"'+this.sectionTableAddForm.controls['titleHeight'].value+  
            '","section_title_font_size":"'+this.sectionTableAddForm.controls['titleFontSize'].value+  
            '","section_body_height":"'+this.sectionTableAddForm.controls['bodyHeight'].value+    
           */
         }         

}



export interface KeyValue {
  [id :string]: string;
}


@Component({
  selector: 'content-type-dialog',
  templateUrl: 'content-type-dialog.html',
  styleUrls: ['./content-type-dialog.component.css']
})

export class ContentTypeDialog {

  form: FormGroup;
  dataForm:FormGroup;
  jsonTest:string;
  version:string;
  parentReference: SectionTableAddComponent;
  maps:any[];
  columnHeaderCheckbox:boolean[];
  rowHeaderCheckbox:boolean[];
  contentTypes: ContentType[] = [];
  contentTypeData: ContentType = {
    contentTypeId:'',
    contentTypeName:'',
    contentTypeCategory:'',
    description:'',
    transitionId:'',
    contentTypeQuery:''   
}

dataSource = new MatTableDataSource;
displayedColumns:any[]=[];
dataLength = 0;
dataLoaded: Observable<{}>;
recordKeyValue: KeyValue={};  
records:any[]=[];
recordsMultiDimen:any[]=[];
dataTime:string="";

checked_value = false;
disableValue = false;

checkbox_array:FormArray;
errorMessage = "";


  ngOnInit() {         
      
       this.checked_value = false;    
  }


  constructor(
              private fb: FormBuilder,
              public dialogRef: MatDialogRef<ContentTypeDialog>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public utilityService: UtilityService,
              private contentTypeService: ContentTypeService,
              private userAccessProfileService: UserAccessProfileService,
              private datePipe: DatePipe) {
            
            
      this.getContentTypeList(data.reportType);                   
      this.jsonTest = data.jsonTest;
      //this.recordsMultiDimen=[];
      
      this.form = fb.group({
        jsonTest: this.jsonTest,     
        contentType:['']       
          
      });

      this.dataForm = fb.group({                
            checkbox_array:this.fb.array([])    
      });

      //this.form.controls['transferButton'].disable;

      this.checkbox_array = this.dataForm.get('checkbox_array') as FormArray; 

    }  

    close(): void {
         this.dialogRef.close();
    }

    transfer() {

            if (confirm("FYI:  Selecting many columns may create problem generating PPT report. However it will depend upon the content volume of each column. Further tunning may be done by reducing the font size of the table content and/or excluding the selection of irrelevant column, in case if you face problem.\nAre you ok? ")){

                  //You can be informed in adavnce if you select preview button to see if report generating successfully. You may choose 'Cancel' to preview or modify your selection. You may OK to proceed with report editor
                  if (this.form.controls['contentType'].value !=''){
                        
                              if (this.columnSelected() == false || this.rowSelected() == false){
                                    alert("You must select at least one column and one row");
                              }else{
                                    this.dialogRef.close(this.form.value);
                                    this.parentReference.processContent(this.getJsonForSelectedDataSet());
                              }
                  }else{
                              alert("Please select a content type");
                  }
            }   
    }

    getContentTypeList(reportType){

      console.log(  "getContentTypeList()"); 
      this.contentTypeService.getContentTypeList(reportType).subscribe((contentTypes:any[]) => {
  
              if (contentTypes.length>0){
                    // Clears old data
                    this.contentTypes = [];
              }
                    
              
              for(var i=0; i<contentTypes.length; i++) {
        
                        let contentType: ContentType = {
                              contentTypeId:'',
                              contentTypeName:'',
                              contentTypeCategory:'',
                              description:'',
                              transitionId:'',
                              contentTypeQuery:''                        
                        }
                        
                        contentType.contentTypeId = contentTypes[i].CONTENT_TYPE_ID;          
                        contentType.contentTypeName = contentTypes[i].CONTENT_TYPE_NAME;
                        contentType.description = contentTypes[i].CONTENT_TYPE_DESCRIPTION;
                        contentType.contentTypeQuery = contentTypes[i].CONTENT_TYPE_QUERY;  
                        
                        this.contentTypes.push(contentType);
              }          
      });    
     }    


     getContentData(contentTypeId){
          //alert("Selection chnage "+contentTypeId);
          this.getContentTypeData(contentTypeId);
     }



     getContentTypeData(contentTypeId){

      console.log(  "getContentTypeData()"); 
      this.contentTypeService.getContentTypeData(contentTypeId).subscribe((contentTypes:any[]) => {
            for(var i=0; i<contentTypes.length; i++) {
        
                
                this.contentTypeData.contentTypeId = contentTypes[i].CONTENT_TYPE_ID;          
                this.contentTypeData.contentTypeName = contentTypes[i].CONTENT_TYPE_NAME;
                this.contentTypeData.description = contentTypes[i].CONTENT_TYPE_DESCRIPTION;
                this.contentTypeData.contentTypeQuery = contentTypes[i].CONTENT_TYPE_QUERY;  

                //alert("this.contentTypeData.contentTypeQuery "+this.contentTypeData.contentTypeQuery);
            }   
            
            var finalQuery = "";

            //Check for transition 
            var splitedQuery = (this.contentTypeData.contentTypeQuery).split('=INTEGRATION_ID');
            //alert("splitedQuery.length "+splitedQuery.length);
            if (splitedQuery.length >1){
                 finalQuery = splitedQuery[0];
                 for(var i=1;i<splitedQuery.length;i++){
                       finalQuery = finalQuery +"='"+this.userAccessProfileService.getCurrentTransitionID()+"'"+" "+splitedQuery[i];
                 }
            }else{
                 finalQuery = this.contentTypeData.contentTypeQuery;
            }
        
            //Check for owning org organization
            splitedQuery = (finalQuery).split('=OWNING_ORG');
            //alert("splitedQuery.length "+splitedQuery.length);
            if (splitedQuery.length >1){
                 finalQuery = splitedQuery[0];
                 for(var i=1;i<splitedQuery.length;i++){
                       finalQuery = finalQuery +this.addQuotes(this.userAccessProfileService.getUserTransionOrg())+" "+splitedQuery[i];
                 }
            }

            //alert("finalQuery "+finalQuery);
      
            this.getRecords(finalQuery);
      });         
    }    

  
    addQuotes(inputText){
            var finalInputText = "";
            var commaSeperatedArray = inputText.split(',');
            if (commaSeperatedArray.length >1){
                  finalInputText = "'"+(commaSeperatedArray[0]).trim()+"'";
                  for(var i=1;i<commaSeperatedArray.length;i++){
                        finalInputText = finalInputText +","+ "'"+(commaSeperatedArray[i]).trim()+"'";
                  }
            }else{
                  finalInputText = "'"+inputText.trim()+"'";
            }
            //alert("finalInputText "+finalInputText);
            return finalInputText;
    }


    getRecords(query){
  

      console.log( "getContentTypeList()"); 
  
      //alert(query);
      this.recordKeyValue={};
      this.displayedColumns=[];
      this.dataSource.data = [];
      this.recordsMultiDimen = [];


      this.utilityService.getRecords(query).subscribe((records:any[]) => {
            
            if (records != undefined){ 
                  console.log("records.length "+records.length);

                  this.dataTime= this.datePipe.transform(new Date(),"MMM d, y, h:mm:ss a")
                  this.recordKeyValue={};
                  this.displayedColumns=[];
                  this.dataSource.data = [];
  
                  if (records.length>0){
                        this.errorMessage = "";
                        // Clears old data
                        this.records = [];
                        this.columnHeaderCheckbox = [];
                        this.rowHeaderCheckbox = [];
                        
                        //form the header
                        for(var key in records[0]){
                              this.recordKeyValue[key]=key;
                              this.displayedColumns.push(key);
                              this.columnHeaderCheckbox.push(false);
                              
                              /* 
                              this.checkbox_array.push(this.fb.group({   
                                    //id:"c"+key,                                                                   
                                    check_box: "false"                                      
                              })); 
                              
                              */
                              
                              this.checkbox_array.push(this.fb.control(''))
                        }    
                        
                        for(var i=0; i<records.length;i++){   

                              /*
                              this.checkbox_array.push(this.fb.group({ 
                                    //id:"r"+i,                                                                      
                                    check_box: "false"                                       
                        }))
                        */
                              //this.rowHeaderCheckbox.push(false);
                              this.checkbox_array.push(this.fb.control(''))

                        }   

                        //alert("this.checkbox_array "+this.checkbox_array.length);
                        this.checked_value = false;   
                        this.dataSource.data = records;
                        this.dataLength =  this.dataSource.data.length;
                        //this.dataLoaded = this.loadData().pipe(share()); 

                        //Populate the two diamentional array header
                        var row:any[]=[];
                        for (var obj in records[0]){

                              console.log("obj "+records[0][obj]);
                              row.push(obj);  
                              
                        }
                        this.recordsMultiDimen.push(row);
                        

                        for(var i=0; i<records.length;i++){
                              this.rowHeaderCheckbox.push(false);
                              var j = 0;
                              //Populate the two diamentional array
                              var row:any[]=[];
                              for (var obj in records[i]){

                                    console.log("obj "+records[i][obj]);

                                    row.push( this.utilityService.escapeSpecialChars(records[i][obj])); 

                                    j = j+1;
                              }
                              this.recordsMultiDimen.push(row);
                        }   
                        
                        this.errorMessage = "";
                  }else{
                        //alert("No data is fetched");
                        this.errorMessage ="No data is fetched";
                  }
                  
            }else{
                  //alert("No data is fetched");
                  this.errorMessage ="No data is fetched";
            }      
           
      });    
    }
  
     onColCheck(event, colIndex){
          if (event.checked){
                
                this.columnHeaderCheckbox[colIndex]=true;
                //alert(this.columnHeaderCheckbox[colIndex]);
          }else{
                this.columnHeaderCheckbox[colIndex]=false;
                //alert(this.columnHeaderCheckbox[colIndex]);
          }
          this.disableEnableTransferButton();

     }

     onRowCheck(event, rowIndex){
          if (event.checked){
                this.rowHeaderCheckbox[rowIndex]=true;
          }else{
                this.rowHeaderCheckbox[rowIndex]=false;
          }

          this.disableEnableTransferButton();
     } 
     

     disableEnableTransferButton(){
            if (this.rowSelected()==false || this.columnSelected() == false){
                  // Disable transfer button
                  this.disableValue = false;
                  //this.form.controls['transferButton'].disable;
            }
            if (this.rowSelected()==true && this.columnSelected() == true){
                  // Enable transfer button
                  //this.form.controls['transferButton'].enable;
                  this.disableValue = true;
            }
     }

     
     onCheckAllRow(event){

            //alert("this.rowHeaderCheckbox.length "+this.rowHeaderCheckbox.length);
            if (event.checked){
                  for(var i=0; i<this.rowHeaderCheckbox.length;i++){            
                        this.rowHeaderCheckbox[i]=true;
                        (<FormArray>this.dataForm.get('checkbox_array')).controls[this.columnHeaderCheckbox.length +i].setValue(true);
                  }            
            }else{
                        for(var i=0; i<this.rowHeaderCheckbox.length;i++){            
                              this.rowHeaderCheckbox[i]=false;
                              (<FormArray>this.dataForm.get('checkbox_array')).controls[this.columnHeaderCheckbox.length + i].setValue(false);
                        }  
            }

            this.disableEnableTransferButton();

     } 


     initializeCheckBox(){

            for(var i=0; i<(this.rowHeaderCheckbox.length +this.columnHeaderCheckbox.length);i++){                              
                  (<FormArray>this.dataForm.get('checkbox_array')).controls[i].setValue(false);
            }  

     }


     onCheckAllColumn(event){

          //alert(this.columnHeaderCheckbox.length+" "+ this.columnHeaderCheckbox.length);
          if (event.checked){
                  for(var i=0; i<this.columnHeaderCheckbox.length;i++){            
                        this.columnHeaderCheckbox[i]=true;

                        //alert(i+" "+ (<FormArray>this.dataForm.get('checkbox_array')).controls[i].value.check_box);
                        (<FormArray>this.dataForm.get('checkbox_array')).controls[i].setValue(true);
                  }            
          }else{
                  for(var i=0; i<this.columnHeaderCheckbox.length;i++){    
                        //alert(i+" "+ (<FormArray>this.dataForm.get('checkbox_array')).controls[i].value.check_box);        
                        this.columnHeaderCheckbox[i]=false;
                        (<FormArray>this.dataForm.get('checkbox_array')).controls[i].setValue(false);
                  }  
          }
          this.disableEnableTransferButton();

     }

     getJsonForSelectedDataSet(){

           var columnCounter = 0;
           var columnText  = "";
           for(var i=0; i<this.columnHeaderCheckbox.length;i++){                
                if (this.columnHeaderCheckbox[i]==true){
                       if (columnCounter == 0){
                              columnText = '"'+this.recordsMultiDimen[0][i]+'"';
                       }else{
                              columnText = columnText + ","+'"'+this.recordsMultiDimen[0][i]+'"';
                       }
                       columnCounter = columnCounter + 1;
                }
           }
           var headerText = "["+columnText+"]";

           var rowCounter = 0;
           var dataText = "";
           for(var j=0; j<this.rowHeaderCheckbox.length;j++){   
                if ( this.rowHeaderCheckbox[j] == true){

                      var columnCounter = 0;
                      var rowText ="";
                      for(var i=0; i<this.columnHeaderCheckbox.length;i++){                
                            if (this.columnHeaderCheckbox[i]==true){
                                  if (columnCounter == 0){
                                          //rowText = '"'+this.utilityService.escapeSpecialChars(this.recordsMultiDimen[j+1][i])+'"';
                                          rowText = '"'+this.recordsMultiDimen[j+1][i]+'"';
                                  }else{
                                          //rowText = rowText + ","+'"'+this.utilityService.escapeSpecialChars(this.recordsMultiDimen[j+1][i])+'"';
                                          rowText = rowText + ","+'"'+this.recordsMultiDimen[j+1][i]+'"';
                                  }
                                  columnCounter = columnCounter + 1;
                            }
                      }
                      rowText = "["+rowText+"]";

                      if  (rowCounter == 0){
                           dataText = rowText;
                      }else{
                           dataText = dataText +","+rowText;
                      }

                      rowCounter = rowCounter + 1;
                }
            }//for

            dataText = "["+dataText + "]";
                      
            //alert('{"header":'+ headerText+',"data":'+ dataText+'}');
            console.log("final data "+'{"header":'+ headerText+',"data":'+ dataText+'}');
        
            //var data = '{"header":'+ headerText+',"data":'+ dataText+'}';
         
            return '{"header":'+ headerText+',"data_time":"'+this.dataTime+'","data":'+ dataText+'}';
     }

     columnSelected(){

                  var colSelected = false;
                  for(var i=0; i<this.columnHeaderCheckbox.length;i++){                
                        if (this.columnHeaderCheckbox[i]==true){
                            colSelected = true;
                        }
                  }
                  return colSelected;
     }

     rowSelected(){

            var rowSelected = false;
            for(var i=0; i<this.rowHeaderCheckbox.length;i++){                
                  if (this.rowHeaderCheckbox[i]==true){
                  rowSelected = true;
                  }
            }
      return rowSelected;
}     

     
}


@Component({
      selector: 'excel-upload-dialog',
      templateUrl: 'excel-upload-dialog.html',
      styleUrls: ['./excel-upload-dialog.component.css']
    })
    

export class ExcelUploadDialog {

      form: FormGroup;
      dataForm:FormGroup;
      jsonTest:string;
      version:string;
      parentReference: SectionTableAddComponent;
      maps:any[];
      
      bstr:any;
      wb: any;
      wsname: string = ""
      ws:any;                 
      json = "" ;
    

    dataTime:string="";
    

     file:any;
    
      ngOnInit() {         

      }
    
    
        constructor(
                  private fb: FormBuilder,
                  public excelService:ExcelService,
                  public dialogRef: MatDialogRef<ExcelUploadDialog>,
                  @Inject(MAT_DIALOG_DATA) public data: DialogData,
                  public utilityService: UtilityService,
                  private contentTypeService: ContentTypeService,
                  private userAccessProfileService: UserAccessProfileService,
                  private datePipe: DatePipe) {
                
                 
          this.jsonTest = data.jsonTest;
          //this.recordsMultiDimen=[];
          
          this.form = fb.group({
            jsonTest: this.jsonTest,     
            contentType:['']
              
          });

        }  
    
        close(): void {
             this.dialogRef.close();
        }
    
        save() {

            
                  this.dialogRef.close(this.form.value);            
                  this.parentReference.processContent(this.getJsonForSelectedDataSet(this.json));   
                            
        }
      
        getJsonForSelectedDataSet(json){
    
            var maps = JSON.parse(json);
            var headerRow=[];
            var j=1;
            while( this.ws[this.getColumnName(j)+'1']  !=undefined){ 

                  //alert(this.getColumnName(j)+'1');
                  headerRow.push(this.utilityService.escapeSpecialChars(this.ws[this.getColumnName(j)+'1'].v));  
                  j = j+ 1;                   
            }  

            //alert(" headerRow.length "+headerRow.length);
            
            var columnText  = "";
            for(var i=0; i<headerRow.length;i++){ 

                        if (i == 0){
                               columnText = '"'+headerRow[i]+'"';
                        }else{
                               columnText = columnText + ","+'"'+headerRow[i]+'"';
                        }
            }
            var headerText = "["+columnText+"]";            

            //alert(" headerText "+headerText);

            var rowCounter = 0;
            var rowText = "";
            var dataText = "";
            for( var i=0; i< maps.length; i++){
                  for(var j=0; j<headerRow.length;j++){ 
                                               
                       //alert("maps[i][headerRow[j]] "+maps[i][headerRow[j]]); 
                       var data = "";
                       if (maps[i][headerRow[j]] == undefined)
                              data = "";
                       else
                              data = this.utilityService.escapeSpecialChars(maps[i][headerRow[j]]);

                       if (j == 0){
                              rowText = '"'+data+'"';
                       }else{
                              rowText = rowText + ","+'"'+data+'"';
                       }                         
                  }                         
                  rowText = "["+rowText+"]";

                  if  (rowCounter == 0){
                        dataText = rowText;
                  }else{
                        dataText = dataText +","+rowText;
                  }
                  rowCounter = rowCounter + 1;
            }      

            dataText = "["+dataText + "]";
                          
            console.log("final data "+'{"header":'+ headerText+',"data":'+ dataText+'}');               
            return '{"header":'+ headerText+',"data_time":"'+this.dataTime+'","data":'+ dataText+'}';
        }

        fileChanged(e) {
              this.file = e.target.files[0];
        }

        upload() {    
                  let fileReader = new FileReader();
                  fileReader.onload = (e:any) => {
                              /* read workbook */
                              this.bstr = e.target.result;
                              this.wb = XLSX.read(this.bstr, {type: 'binary'});
                              /* grab first sheet */
                              this.wsname = this.wb.SheetNames[0];
                              this.ws = this.wb.Sheets[this.wsname];     
                              var jsonObj = {};
                              console.log(XLSX.utils.sheet_to_json(this.ws,{raw:true}));                        
                              this.json = JSON.stringify(XLSX.utils.sheet_to_json(this.ws,{raw:true})) ;   
                              this.getJsonForSelectedDataSet(this.json);      
                              this.dialogRef.close(this.form.value);
                              //alert(" this.getJsonForSelectedDataSet(this.json)  "+this.getJsonForSelectedDataSet(this.json));
                              this.parentReference.processContent(this.getJsonForSelectedDataSet(this.json));                                      
                  }
                  fileReader.readAsBinaryString(this.file);            
        } 
        
        getColumnName(columnNumber){       
            return this.excelService.getExcelColumnName(columnNumber);            
        }        
             
      
}

