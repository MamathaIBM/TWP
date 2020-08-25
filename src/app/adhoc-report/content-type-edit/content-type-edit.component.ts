import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker, MatTableDataSource } from '@angular/material';
import { ContentType } from 'Vo/contentType';

import { UtilityService } from 'Services/utility.service';
import {Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';
import { NavtntService, KeyValue } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';
import { of, Observable } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { ContentTypeService } from 'Services/contenttype.service';




@Component({
  selector: 'app-content-type-edit',
  templateUrl: './content-type-edit.component.html',
  styleUrls: ['./content-type-edit.component.css']
})
export class ContentTypeEditComponent implements OnInit {

  operationTypes: Keyvalue[] = [];
  defaults: Keyvalue[] = [];
  contentTypeCategories:Keyvalue[] = [];
  
  recordKeyValue: KeyValue={};  
  owning_org ='';

  contentTypeId:string='';
  contentTypes: ContentType[] = [];
  records:any[]=[];
  contentTypeEditForm: FormGroup;
  contentType: ContentType = {
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



  constructor(private navigation: NavtntService, 
              private utility: UtilityService,
             fb: FormBuilder, private contentTypeService: ContentTypeService,private utilityService: UtilityService, private router: Router, private route: ActivatedRoute) {
    this.contentTypeEditForm = fb.group({
                                          contentTypeName:[''],
                                          contentTypeCategory:[''],
                                          description:[''],
                                          transitionId:[''],
                                          contentTypeQuery:[''],
                                          owning_org:[]                   
                                       });
  }

  ngOnInit() {
    this.dataLoaded = this.loadData().pipe(share()); 
    this.contentTypeCategories = this.utility.getContentTypeCategories();
    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){                        
            this.contentTypeId = this.navigation.getParameterValue(p.filter, 'contentTypeId'); 
            this.getContentTypeData(this.contentTypeId);  

      }
    });
  }


  
  onSubmit() {

    this.contentType.contentTypeName = this.contentTypeEditForm.controls['contentTypeName'].value;
    this.contentType.contentTypeCategory = this.contentTypeEditForm.controls['contentTypeCategory'].value;
    this.contentType.description = this.contentTypeEditForm.controls['description'].value;
    this.contentType.contentTypeQuery = this.contentTypeEditForm.controls['contentTypeQuery'].value;

     if (this.contentType.contentTypeName.trim() == ''  || this.contentType.contentTypeQuery.trim() == '' ){
        alert("Mandatory fields must not be empty!");

     }else{
           this.saveContentType();
     }
 
      
    
  }



  back() {


    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/content-type-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    ;
    
  }


  saveContentType(){

          var lines = this.contentType.contentTypeQuery.split('\n');
          //alert(" lines.length "+lines.length);

          var newQuery=this.contentType.contentTypeQuery;
          if (lines.length >1){
              newQuery = "";
              for(var i=0; i<lines.length;i++){
                  console.log(i +"    =====   "+lines[i]);
                  newQuery = newQuery +" "+ lines[i];
              }
          }else{
                  newQuery = this.contentType.contentTypeQuery;
          }

          newQuery = this.utility.escapeSpecialChars(newQuery);
          newQuery = this.utility.escapeChar(newQuery, '"', '\\"');
         //alert("newQuery "+newQuery);

          let contentTypeParameter = 
          '{"CONTENT_TYPE_NAME":"'+ this.contentType.contentTypeName+ '","CONTENT_TYPE_CATEGORY":"'+ this.contentType.contentTypeCategory+'","CONTENT_TYPE_DESCRIPTION":"'+ this.contentType.description+'", '+
          '  "CONTENT_TYPE_QUERY":"'+ newQuery+'"}';



          console.log("contentTypeParameter update "+contentTypeParameter);

          if (newQuery.toUpperCase().includes("INSERT ") || newQuery.toUpperCase().includes("UPDATE ")  || newQuery.toUpperCase().includes("DELETE ")){
              alert("Words like INSERT<SPACE>, UPDATE<SPACE> & DELETE<SPACE> not allowed");
          }else{          
              this.contentTypeService.updateContentType(this.contentTypeId,contentTypeParameter ).subscribe((contentTypes:any[]) => {                     
                console.log("##################################################################################################");

      
                var sourceComponentPath = '/admin-home/content-type-edit';
                var destinationComponentPath = '/admin-home/content-type-list';
                var destinationComponentParameterArray = []     
              
                this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)          
              });   
          }                  
  }

  testContentType(){

    this.contentType.contentTypeQuery = this.contentTypeEditForm.controls['contentTypeQuery'].value;
    this.contentType.transitionId = this.contentTypeEditForm.controls['transitionId'].value;
    this.owning_org = this.contentTypeEditForm.controls['owning_org'].value;

    //alert(this.contentType.contentTypeQuery);
    //alert(this.contentType.transitionId);
    var finalQuery = "";
    var splitedQuery = [];

    //alert(this.contentType.transitionId);
    if (this.contentType.transitionId !=undefined){

        splitedQuery = (this.contentType.contentTypeQuery).split('=INTEGRATION_ID');
        //alert("splitedQuery.length "+splitedQuery.length);
        if (splitedQuery.length >1){
            finalQuery = splitedQuery[0];
            for(var i=1;i<splitedQuery.length;i++){
                  finalQuery = finalQuery +"='"+this.contentType.transitionId+"'"+" "+splitedQuery[i];
            }
        }else{
            finalQuery = this.contentType.contentTypeQuery;
        }

    }else{
           finalQuery = this.contentType.contentTypeQuery;
    }



    //Check for owning org organization

    splitedQuery =[];
    //alert(this.owning_org);
    if (this.owning_org !=undefined){


        splitedQuery = (finalQuery).split('=OWNING_ORG');
        //alert("splitedQuery.length "+splitedQuery.length);
        if (splitedQuery.length >1){
            finalQuery = splitedQuery[0];
            for(var i=1;i<splitedQuery.length;i++){
                  finalQuery = finalQuery +" '"+this.owning_org+"' "+splitedQuery[i];
            }
        }else{
              finalQuery = finalQuery;
        }
    }else{
         finalQuery = finalQuery;
    }


    //alert("finalQuery "+finalQuery);
    this.recordKeyValue={};
    this.displayedColumns=[];
    this.dataSource.data = [];
    this.utility.getRecords(finalQuery).subscribe((records:any[]) => {

      console.log("records.length "+records.length);
      this.recordKeyValue={};
      this.displayedColumns=[];
      this.dataSource.data = [];

            if (records.length>0){
                  // Clears old data
                  this.records = [];
                  //form the header
                  for(var key in records[0]){
                        this.recordKeyValue[key]=key;
                        this.displayedColumns.push(key);
                  }                     
                  this.dataSource.data = records;
                  this.dataLength =  this.dataSource.data.length;
                  this.dataLoaded = this.loadData().pipe(share()); 
            }  
    });    

  }

  getRecords(){

    var query = this.contentTypeEditForm.controls['contentTypeQuery'].value;
    console.log(  "getContentTypeList()"); 

    //alert(query);
    this.recordKeyValue={};
    this.displayedColumns=[];
    this.dataSource.data = [];
    this.utility.getRecords(query).subscribe((records:any[]) => {

      console.log("records.length "+records.length);
      this.recordKeyValue={};
      this.displayedColumns=[];
      this.dataSource.data = [];

            if (records.length>0){
                  // Clears old data
                  this.records = [];
                  //form the header
                  for(var key in records[0]){
                        this.recordKeyValue[key]=key;
                        this.displayedColumns.push(key);
                  }                     
                  this.dataSource.data = records;
                  this.dataLength =  this.dataSource.data.length;
                  this.dataLoaded = this.loadData().pipe(share()); 
            }  
    });    
  }


  loadData() {
    // Fake Slow Async Data
    return of({
      dataLoaded: true
    }).pipe(
            delay(0)
    );
}


getContentTypeData(contentTypeId){

  console.log(  "getContentTypeData()"); 
  this.contentTypeService.getContentTypeData(contentTypeId).subscribe((contentTypes:any[]) => {
    for(var i=0; i<contentTypes.length; i++) {

         
        this.contentType.contentTypeId = contentTypes[i].CONTENT_TYPE_ID;          
        this.contentType.contentTypeName = contentTypes[i].CONTENT_TYPE_NAME;
        this.contentType.contentTypeCategory = contentTypes[i].CONTENT_TYPE_CATEGORY;
        this.contentType.description = contentTypes[i].CONTENT_TYPE_DESCRIPTION;
        this.contentType.contentTypeQuery =   this.utility.escapeChar(contentTypes[i].CONTENT_TYPE_QUERY,'\"', '"');  
      
        console.log(  "getContentTypeData()  after decoded"+this.contentType.contentTypeQuery); 
        
        this.contentTypeEditForm.controls['contentTypeName'].setValue(this.contentType.contentTypeName);
        this.contentTypeEditForm.controls['contentTypeCategory'].setValue(this.contentType.contentTypeCategory);
        this.contentTypeEditForm.controls['description'].setValue(this.contentType.description);
        this.contentTypeEditForm.controls['contentTypeQuery'].setValue(this.contentType.contentTypeQuery);              
    }

        
  });    
}

}
