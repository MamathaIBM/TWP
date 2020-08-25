import { Component, OnInit } from '@angular/core';
import { ContentType } from 'Vo/contentType';
import { DataandparamService } from 'Services/dataandparam.service';
import { MatTableDataSource } from '@angular/material';

import {Router} from "@angular/router";
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/filter';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { NavtntService } from 'src/app/navtnt.service';
import { ContentTypeService } from 'Services/contenttype.service';


@Component({
  selector: 'app-content-type-list',
  templateUrl: './content-type-list.component.html',
  styleUrls: ['./content-type-list.component.css']
})
export class ContentTypeListComponent implements OnInit {


  dataLength = 0;

  contentType: ContentType = {
        contentTypeId:'',
        contentTypeName:'',
        contentTypeCategory:'',
        description:'',
        transitionId:'',
        contentTypeQuery:''    
  }

  contentTypes: ContentType[] = [];
  dataSource = new MatTableDataSource;
  displayedColumns: string[] = [ 'contentTypeName', 'contentTypeCategory', 'description', 'contentTypeId'];

  constructor(private navigation: NavtntService, 
      private userAccessProfileService: UserAccessProfileService, 
      private contentTypeService: ContentTypeService, 
      private dataandparamService: DataandparamService, 
      private  route: ActivatedRoute) { }

  ngOnInit() {
       

       this.route.queryParams.subscribe((p: any) => {    
        if (p.filter){            
              this.getContentTypeList();     
        }
      });
  }

  getContentTypeList(){

    console.log(  "getContentTypeList()"); 
    this.contentTypeService.getContentTypeListAll().subscribe((contentTypes:any[]) => {

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
          contentType.contentTypeCategory = contentTypes[i].CONTENT_TYPE_CATEGORY;
          contentType.description = contentTypes[i].CONTENT_TYPE_DESCRIPTION;
          contentType.contentTypeQuery = contentTypes[i].CONTENT_TYPE_QUERY;  
          console.log("contentType.contentTypeName = "+contentType.contentTypeName);
          console.log("contentType.description = "+contentType.description);
          console.log("contentType.contentTypeQuery = "+contentType.contentTypeQuery);
          
          this.contentTypes.push(contentType);
      }

      //this.contentTypes = contentTypes;
      this.dataSource = new MatTableDataSource(this.contentTypes);
      this.dataLength =  this.dataSource.data.length;            
    });    
  }

  deleteContentType(contentType_id:string){
        this.contentTypeService.deleteContentType(contentType_id ).subscribe((contentTypes:any[]) => {
            this.getContentTypeList();
        });
  }

  onDelete(contentType) {    
        
      if (confirm("Are you sure to delete "+contentType.contentTypeName+"?")){
            this.deleteContentType(contentType.contentTypeId);
      }   
  }


  onUpdate(contentType) {
          var sourceComponentPath = "/admin-home/content-type-list";
          var destinationComponentPath = "/admin-home/content-type-edit";
          var destinationComponentParameterArray = [{ id: 'contentTypeId', param: contentType.contentTypeId } ]     
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

  createContentType() {    
          var sourceComponentPath = "/admin-home/content-type-list";
          var destinationComponentPath = "/admin-home/content-type-add";
          var destinationComponentParameterArray = [];
          this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)    
  }

}
