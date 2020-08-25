import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { MatDatepicker, MatTableDataSource } from '@angular/material';
import { UtilityService } from 'Services/utility.service';
import { Router} from "@angular/router";
import { ActivatedRoute} from "@angular/router";
import 'rxjs/add/operator/filter';
import { NavtntService, KeyValue } from 'src/app/navtnt.service';
import { Keyvalue } from 'Vo/keyvalue';
import { of, Observable } from 'rxjs';
import { delay, share } from 'rxjs/operators';
import { MatDatepickerModule } from '@angular/material';
import { Section } from 'Vo/section';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import { CustomReportService } from 'Services/customreport.service';


@Component({
  selector: 'app-section-text-add',
  templateUrl: './section-text-add.component.html',
  styleUrls: ['./section-text-add.component.css']
})
export class SectionTextAddComponent implements OnInit {


  slideTypes: Keyvalue[] = [];
  errorReason="";

  sectionTextAddForm: FormGroup;
  selfReference:any;
  reportType:'';
  customOrAdmin:'';

  sectionText: Section = {
        sectionName:'',
        sectionContent:'',
  }

  dataSource = new MatTableDataSource;
  displayedColumns:any[]=[];
  dataLength = 0;
  dataLoaded: Observable<{}>;

  components = [];
  container:any;

  constructor(
              private navigation: NavtntService, 
              private utility: UtilityService,
              private customReportService : CustomReportService,
              private fb: FormBuilder, 
              ) {
                  this.sectionTextAddForm = fb.group({
                    sectionName:[''],   
                    sectionContent:[''],                                          
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
  }

  ngOnInit() {    
        this.slideTypes = this.utility.getSlideTypes();
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

   populateData(data){
        this.setSectionName(data.section_data.section_name);
        this.setSectionContent(data.section_data.section_content);  
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


   getSectionData(){
        //alert(this.sectionTextAddForm.controls['positionY'].value);
        return '{"section_data":{"section_name":"'+this.customReportService.escapeSpecialCharForReportBody(this.sectionTextAddForm.controls['sectionName'].value)+
                '","section_type":"text", "section_content":"'+this.customReportService.escapeSpecialCharForReportBody(this.sectionTextAddForm.controls['sectionContent'].value)+
                '","section_slide":"'+this.sectionTextAddForm.controls['sectionSlide'].value+
                '","section_position_x":"'+this.sectionTextAddForm.controls['positionX'].value+
                '","section_position_y":"'+this.sectionTextAddForm.controls['positionY'].value+  
                '","section_font_size":"'+this.sectionTextAddForm.controls['fontSize'].value+ 
                '","section_body_color":"'+this.sectionTextAddForm.controls['bodyColor'].value+  
                '","section_title_color":"'+this.sectionTextAddForm.controls['titleColor'].value+  
                '","section_title_bg_color":"'+this.sectionTextAddForm.controls['titleBgColor'].value+  
                '","section_title_height":"'+this.sectionTextAddForm.controls['titleHeight'].value+  
                '","section_title_font_size":"'+this.sectionTextAddForm.controls['titleFontSize'].value+  
                '","section_body_height":"'+this.sectionTextAddForm.controls['bodyHeight'].value+          
                '"}}';       
   }

   setSectionName(sectionName){
       this.sectionTextAddForm.controls['sectionName'].setValue(sectionName);
   }

   setSectionContent(sectionContent){
       this.sectionTextAddForm.controls['sectionContent'].setValue(sectionContent);   
   }
   
   setSectionSlide(sectionSlide){
       this.sectionTextAddForm.controls['sectionSlide'].setValue(sectionSlide);   
   }

   setSectionX(positionX){
       this.sectionTextAddForm.controls['positionX'].setValue(positionX);   
   }   

   setSectionY(positionY){
       //alert("positionY "+positionY);
       this.sectionTextAddForm.controls['positionY'].setValue(positionY);   
   }   

    setFontSize(fontSize){
        this.sectionTextAddForm.controls['fontSize'].setValue(fontSize);   
    }   

    setBodyColor(bodyColor){
        this.sectionTextAddForm.controls['bodyColor'].setValue(bodyColor);   
    }   

    setTitleColor(titleColor){
        this.sectionTextAddForm.controls['titleColor'].setValue(titleColor);   
    }   
    
    setTitleBgColor(titleBgColor){
        this.sectionTextAddForm.controls['titleBgColor'].setValue(titleBgColor);   
    }  
    
    setTitleFontSize(titleFontSize){
        this.sectionTextAddForm.controls['titleFontSize'].setValue(titleFontSize);   
    }  

    setTitleHeight(titleHeight){
        this.sectionTextAddForm.controls['titleHeight'].setValue(titleHeight);   
    }   
    
    setBodyHeight(bodyHeight){
        this.sectionTextAddForm.controls['bodyHeight'].setValue(bodyHeight);   
    }      

    validate(){

        var validationResult = true;
        if (this.sectionTextAddForm.controls['positionX'].value.trim() == ''){
              this.errorReason = "X can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['positionX'].value.trim() <0){
              this.errorReason = "X can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionTextAddForm.controls['positionX'].value.trim() === "string" && Number.isNaN(Number(this.sectionTextAddForm.controls['positionX'].value.trim()))) {
        
              this.errorReason = "X must be number";
              validationResult = false;
              return validationResult;
        }     
        
        if (this.sectionTextAddForm.controls['positionY'].value.trim() == ''){
              this.errorReason = "Y can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['positionY'].value.trim() <0){
              this.errorReason = "Y can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionTextAddForm.controls['positionY'].value.trim() === "string" && Number.isNaN(Number(this.sectionTextAddForm.controls['positionY'].value.trim()))) {
        
              this.errorReason = "Y must be number";
              validationResult = false;
              return validationResult;
        }   

        // Font Size     
        if (this.sectionTextAddForm.controls['fontSize'].value.trim() == ''){
              this.errorReason = "Tab text size can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['fontSize'].value.trim() <0){
              this.errorReason = "Tab text size can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionTextAddForm.controls['fontSize'].value.trim() === "string" && Number.isNaN(Number(this.sectionTextAddForm.controls['fontSize'].value.trim()))) {
        
              this.errorReason = "Tab text size must be number";
              validationResult = false;
              return validationResult;
        }  

        //  Body Color
        if (this.sectionTextAddForm.controls['bodyColor'].value.trim() == ''){
              this.errorReason = "Text body bg color can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['bodyColor'].value.trim() <0){
              this.errorReason = "Text body bg color can't be negative";
              validationResult = false;
              return validationResult;
        }


        // Title color
        if (this.sectionTextAddForm.controls['titleColor'].value.trim() == ''){
              this.errorReason = "Title text color can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['titleColor'].value.trim() <0){
              this.errorReason = "Title text color can't be negative";
              validationResult = false;
              return validationResult;
        }  
        
        // Title background color
        if (this.sectionTextAddForm.controls['titleBgColor'].value.trim() == ''){
              this.errorReason = "Title background color can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['titleBgColor'].value.trim() <0){
              this.errorReason = "Title background color can't be negative";
              validationResult = false;
              return validationResult;
        }     
        //Title height       
        if (this.sectionTextAddForm.controls['titleHeight'].value.trim() == ''){
              this.errorReason = "Title height can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['titleHeight'].value.trim() <0){
              this.errorReason = "Title height can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionTextAddForm.controls['titleHeight'].value.trim() === "string" && Number.isNaN(Number(this.sectionTextAddForm.controls['titleHeight'].value.trim()))) {
        
              this.errorReason = "Title height must be number";
              validationResult = false;
              return validationResult;
        }    
        // Title font size
        if (this.sectionTextAddForm.controls['titleFontSize'].value.trim() == ''){
              this.errorReason = "Title font size can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['titleFontSize'].value.trim() <0){
              this.errorReason = "Title font size can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionTextAddForm.controls['titleFontSize'].value.trim() === "string" && Number.isNaN(Number(this.sectionTextAddForm.controls['titleFontSize'].value.trim()))) {
        
              this.errorReason = "Title font size must be number";
              validationResult = false;
              return validationResult;
        } 
        //Section body height
        if (this.sectionTextAddForm.controls['bodyHeight'].value.trim() == ''){
              this.errorReason = "Table height can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionTextAddForm.controls['bodyHeight'].value.trim() <0){
              this.errorReason = "Table height can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionTextAddForm.controls['bodyHeight'].value.trim() === "string" && Number.isNaN(Number(this.sectionTextAddForm.controls['bodyHeight'].value.trim()))) {
        
              this.errorReason = "Table height must be number";
              validationResult = false;
              return validationResult;
        }                           

        return validationResult;
  

     }           

}
