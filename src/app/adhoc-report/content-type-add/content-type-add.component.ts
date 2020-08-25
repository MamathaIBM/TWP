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
import {  ContentTypeService } from 'Services/contenttype.service';



@Component({
  selector: 'app-content-type-add',
  templateUrl: './content-type-add.component.html',
  styleUrls: ['./content-type-add.component.css']
})
export class ContentTypeAddComponent implements OnInit {

  operationTypes: Keyvalue[] = [];
  defaults: Keyvalue[] = [];
  
  recordKeyValue: KeyValue={};  
  owning_org ='';
  contentTypeCategories:Keyvalue[] = [];

  contentTypeId:string='';
  contentTypes: ContentType[] = [];
  records:any[]=[];
  contentTypeAddForm: FormGroup;
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
    this.contentTypeAddForm = fb.group({
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
  }


  
  onSubmit() {

    this.contentType.contentTypeName = this.contentTypeAddForm.controls['contentTypeName'].value;
    this.contentType.contentTypeCategory = this.contentTypeAddForm.controls['contentTypeCategory'].value;
    this.contentType.description = this.contentTypeAddForm.controls['description'].value;
    this.contentType.contentTypeQuery = this.contentTypeAddForm.controls['contentTypeQuery'].value;

     if (this.contentType.contentTypeName.trim() == ''  || this.contentType.contentTypeQuery.trim() == '' ){
        alert("Mandatory fields must not be empty!");

     }else{
           this.createContentType();
     }
 
      
    
  }

  cancel() {


    var sourceComponentPath = "/admin-home";
    var destinationComponentPath = "/admin-home/content-type-list";
    var destinationComponentParameterArray:any = []     

    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    ;
    
  }


  createContentType(){

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

          let contentTypeParameter = 
          '{ "CONTENT_TYPE_NAME":"'+ this.contentType.contentTypeName+ '","CONTENT_TYPE_CATEGORY":"'+ this.contentType.contentTypeCategory+'","CONTENT_TYPE_DESCRIPTION":"'+ this.contentType.description+'", '+
          '  "CONTENT_TYPE_QUERY":"'+ newQuery+'"}';

          console.log("contentTypeParameter "+contentTypeParameter);


          
          if (newQuery.toUpperCase().includes("INSERT ") || newQuery.toUpperCase().includes("UPDATE ")  || newQuery.toUpperCase().includes("DELETE ")){
                alert("Words like INSERT<SPACE>, UPDATE<SPACE> & DELETE<SPACE> not allowed");
          }else{
            this.contentTypeService.createContentType(contentTypeParameter ).subscribe((contentTypes:any[]) => {                     
                  console.log("##################################################################################################");
      
                  alert("Query type created");
      
                  var sourceComponentPath = '/admin-home/content-type-add';
                  var destinationComponentPath = '/admin-home/content-type-list';
                  var destinationComponentParameterArray = []     
                
                  this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)          
                });     
          }
          
                
  }

  testContentType(){

    this.contentType.contentTypeQuery = this.contentTypeAddForm.controls['contentTypeQuery'].value;
    this.contentType.transitionId = this.contentTypeAddForm.controls['transitionId'].value;

    this.owning_org = this.contentTypeAddForm.controls['owning_org'].value;

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

    var query = this.contentTypeAddForm.controls['contentTypeQuery'].value;
    console.log(  "getContentTypeList()"); 

    //alert(query);
    this.recordKeyValue={};
    this.displayedColumns=[];
    this.dataSource.data = [];
    this.utility.getRecords(query).subscribe((records:any[]) => {

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

}
