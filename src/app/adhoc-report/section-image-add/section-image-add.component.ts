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
import { Section } from 'Vo/section';
import { HttpClient } from '@angular/common/http';
import { CustomReportService } from 'Services/customreport.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';


@Component({
  selector: 'app-section-image-add',
  templateUrl: './section-image-add.component.html',
  styleUrls: ['./section-image-add.component.css']
})
export class SectionImageAddComponent implements OnInit {

  errorReason ="";
  uploadedFiles: Array < File > ;
  sectionImageAddForm: FormGroup;
  selfReference:any;
  imageData:any;
  filename:string;
  slideTypes: Keyvalue[] = [];
  reportType:'';
  customOrAdmin:'';

  imageToShow: any;
  isImageLoading: boolean;

  fileUpload : File = null;
  imageURL :string = "";

  sectionText: Section = {
        sectionName:'',
        sectionContent:'',
  }

  dataSource = new MatTableDataSource;
  displayedColumns:any[]=[];
  dataLength = 0;
  dataLoaded: Observable<{}>;

  transitionId: string = "";

  components = [];
  container:any;

  constructor(
              private navigation: NavtntService, 
              private utility: UtilityService,
              private fb: FormBuilder, 
              private http: HttpClient,
              private reportService: CustomReportService,
              private userAccessProfileService: UserAccessProfileService,
              private customReportService: CustomReportService 
              ) {
                  this.sectionImageAddForm = fb.group({
  
                      pictureName:[''],
                      note:[''],                     
                      sectionName:[''],   
                      sectionContent:[''],                   
                      sectionSlide:[''],   
                      positionX:['5'],   
                      positionY:['5'], 
                      noteHeight:['20'],     
                      bodyColor:['F1F1F1'],
                      titleColor:['FFFF00'],
                      titleBgColor:['0088CC'],
                      titleFontSize:['20'],
                      titleHeight:['7'],
                      bodyHeight:['50']                         


                  });
  }

  ngOnInit() {  
        
      
       //this.getImage();
       //this.getImageFromService("fileKey-1574396621013");

       this.transitionId = this.userAccessProfileService.getCurrentTransitionID();
       this.slideTypes = this.utility.getSlideTypes();
       //alert("this.transitionId "+this.transitionId);


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
        //alert(data.section_data.section_image);
        this.filename = data.section_data.section_image;

        //alert("file name population "+this.filename);
        //alert("this.transitionId"+this.transitionId);
        this.getImageFromService(data.section_data.section_image, this.userAccessProfileService.getCurrentTransitionID(),this.reportType, this.customOrAdmin);                     
        this.setSectionSlide(data.section_data.section_slide);  
        this.setPictureName(data.section_data.section_pic_name);  
        this.setPicNote(data.section_data.section_pic_note);  
        this.setSectionX(data.section_data.section_position_x);  
        this.setSectionY(data.section_data.section_position_y);  
        this.setNoteHeight(data.section_data.section_note_height);  
        this.setBodyColor(data.section_data.section_body_color); 
        this.setTitleColor(data.section_data.section_title_color); 
        this.setTitleBgColor(data.section_data.section_title_bg_color);  
        this.setTitleHeight(data.section_data.section_title_height); 
        this.setTitleFontSize(data.section_data.section_title_font_size); 
        this.setBodyHeight(data.section_data.section_body_height);    
   }

   
   getSectionData(){
        //alert("getSectionData");
        return '{"section_data":{"section_name":"'+this.customReportService.escapeSpecialCharForReportBody(this.sectionImageAddForm.controls['sectionName'].value)+'","section_type":"image", "section_image":"'+this.filename+
        '","section_slide":"'+this.sectionImageAddForm.controls['sectionSlide'].value+
        '","section_pic_name":"'+this.customReportService.escapeSpecialCharForReportBody(this.sectionImageAddForm.controls['pictureName'].value)+
        '","section_pic_note":"'+this.customReportService.escapeSpecialCharForReportBody(this.sectionImageAddForm.controls['note'].value)+
        '","section_position_x":"'+this.sectionImageAddForm.controls['positionX'].value+
        '","section_position_y":"'+this.sectionImageAddForm.controls['positionY'].value+  
        '","section_note_height":"'+this.sectionImageAddForm.controls['noteHeight'].value+ 
        '","section_body_color":"'+this.sectionImageAddForm.controls['bodyColor'].value+  
        '","section_title_color":"'+this.sectionImageAddForm.controls['titleColor'].value+  
        '","section_title_bg_color":"'+this.sectionImageAddForm.controls['titleBgColor'].value+  
        '","section_title_height":"'+this.sectionImageAddForm.controls['titleHeight'].value+  
        '","section_title_font_size":"'+this.sectionImageAddForm.controls['titleFontSize'].value+  
        '","section_body_height":"'+this.sectionImageAddForm.controls['bodyHeight'].value+          
        '"}}';            
   }

   setSectionName(sectionName){
       this.sectionImageAddForm.controls['sectionName'].setValue(sectionName);
   }

  
   setSectionSlide(sectionSlide){
    this.sectionImageAddForm.controls['sectionSlide'].setValue(sectionSlide);   
   }

    setSectionX(positionX){
        this.sectionImageAddForm.controls['positionX'].setValue(positionX);   
    }   

    setSectionY(positionY){
        this.sectionImageAddForm.controls['positionY'].setValue(positionY);   
    }   

    setNoteHeight(noteHeight){
        this.sectionImageAddForm.controls['noteHeight'].setValue(noteHeight);   
    }   

    setBodyColor(bodyColor){
        this.sectionImageAddForm.controls['bodyColor'].setValue(bodyColor);   
    }   

    setTitleColor(titleColor){
        this.sectionImageAddForm.controls['titleColor'].setValue(titleColor);   
    }   
    
    setTitleBgColor(titleBgColor){
        this.sectionImageAddForm.controls['titleBgColor'].setValue(titleBgColor);   
    }  
    

    setTitleHeight(titleHeight){
        this.sectionImageAddForm.controls['titleHeight'].setValue(titleHeight);   
    }   
    
    setTitleFontSize(titleFontSize){
        this.sectionImageAddForm.controls['titleFontSize'].setValue(titleFontSize);   
    }   

    setBodyHeight(bodyHeight){
        this.sectionImageAddForm.controls['bodyHeight'].setValue(bodyHeight);   
    }      

    setPictureName(pic_name){
        this.sectionImageAddForm.controls['pictureName'].setValue(pic_name);   
    }

    setPicNote(section_pic_note){
        this.sectionImageAddForm.controls['note'].setValue(section_pic_note);           
    }
   
   upload() {
    let formData = new FormData();
    for (var i = 0; i < this.uploadedFiles.length; i++) {
        formData.append("uploads[]", this.uploadedFiles[i], this.uploadedFiles[i].name);
    }
    this.http.post('/tnt/customReport/uploadImage', formData)
    .subscribe((response) => {
         console.log('response received is ', response);
    })
   }

   fileChanged(element) {
    this.uploadedFiles = element.target.files;
    //this.handleFileInput(this.uploadedFiles )
    //alert("file changed");
   }   

   handleFileInput(file : FileList){


        //alert("handleFileInput called");
        this.fileUpload =  file.item(0);
        // show the image review 
        var reader = new FileReader();
        reader.onload = (event:any) =>{
            this.imageURL = event.target.result;
        }        
        reader.readAsDataURL(this.fileUpload);
        this.saveImage();
   }

   saveImage(){

         this.reportService.imageUpload(this.fileUpload,this.userAccessProfileService.getIntegrationID(), this.reportType, this.customOrAdmin).subscribe(
            (res:any) => {
                //this.onSuccess();                        
                this.filename = res.filename;

                //alert("this.filename "+this.filename);
                this.getImageFromService(this.filename, this.transitionId, this.reportType, this.customOrAdmin);
            },
            (err) => {
                //this.onError();
            })
    };

   getImage(){
   } 


   createImageFromBlob(image: Blob) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
       //alert("createImageFromBlob 1");  
       this.imageToShow = reader.result;
    }, false);
 
    if (image) {
       reader.readAsDataURL(image);
    }
   }
 
   getImageFromService(filename, transitionId, reportType,customOrAdmin ) {

       //alert("filename "+filename);
       this.isImageLoading = true;
       this.reportService.getImage(filename, transitionId, reportType, customOrAdmin).subscribe(data => {
         //alert("getImageFromService 1");  
         this.createImageFromBlob(data);
         //alert("getImageFromService 2");  
         this.isImageLoading = false;
       }, error => {
         this.isImageLoading = false;
         console.log(error);
       });
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

    validate(){

        var validationResult = true;
        if (this.sectionImageAddForm.controls['positionX'].value.trim() == ''){
              this.errorReason = "X can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['positionX'].value.trim() <0){
              this.errorReason = "X can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionImageAddForm.controls['positionX'].value.trim() === "string" && Number.isNaN(Number(this.sectionImageAddForm.controls['positionX'].value.trim()))) {
        
              this.errorReason = "X must be number";
              validationResult = false;
              return validationResult;
        }     
        
        if (this.sectionImageAddForm.controls['positionY'].value.trim() == ''){
              this.errorReason = "Y can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['positionY'].value.trim() <0){
              this.errorReason = "Y can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionImageAddForm.controls['positionY'].value.trim() === "string" && Number.isNaN(Number(this.sectionImageAddForm.controls['positionY'].value.trim()))) {
        
              this.errorReason = "Y must be number";
              validationResult = false;
              return validationResult;
        }   

        // Font Size     
        if (this.sectionImageAddForm.controls['noteHeight'].value.trim() == ''){
              this.errorReason = "Tab text size can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['noteHeight'].value.trim() <0){
              this.errorReason = "Tab text size can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionImageAddForm.controls['noteHeight'].value.trim() === "string" && Number.isNaN(Number(this.sectionImageAddForm.controls['noteHeight'].value.trim()))) {
        
              this.errorReason = "Tab text size must be number";
              validationResult = false;
              return validationResult;
        }  

        //  Body Color
        if (this.sectionImageAddForm.controls['bodyColor'].value.trim() == ''){
              this.errorReason = "Text body bg color can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['bodyColor'].value.trim() <0){
              this.errorReason = "Text body bg color can't be negative";
              validationResult = false;
              return validationResult;
        }


        // Title color
        if (this.sectionImageAddForm.controls['titleColor'].value.trim() == ''){
              this.errorReason = "Title text color can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['titleColor'].value.trim() <0){
              this.errorReason = "Title text color can't be negative";
              validationResult = false;
              return validationResult;
        }  
        
        // Title background color
        if (this.sectionImageAddForm.controls['titleBgColor'].value.trim() == ''){
              this.errorReason = "Title background color can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['titleBgColor'].value.trim() <0){
              this.errorReason = "Title background color can't be negative";
              validationResult = false;
              return validationResult;
        }     
        //Title height       
        if (this.sectionImageAddForm.controls['titleHeight'].value.trim() == ''){
              this.errorReason = "Title height can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['titleHeight'].value.trim() <0){
              this.errorReason = "Title height can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionImageAddForm.controls['titleHeight'].value.trim() === "string" && Number.isNaN(Number(this.sectionImageAddForm.controls['titleHeight'].value.trim()))) {
        
              this.errorReason = "Title height must be number";
              validationResult = false;
              return validationResult;
        }    
        // Title font size
        if (this.sectionImageAddForm.controls['titleFontSize'].value.trim() == ''){
              this.errorReason = "Title font size can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['titleFontSize'].value.trim() <0){
              this.errorReason = "Title font size can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionImageAddForm.controls['titleFontSize'].value.trim() === "string" && Number.isNaN(Number(this.sectionImageAddForm.controls['titleFontSize'].value.trim()))) {
        
              this.errorReason = "Title font size must be number";
              validationResult = false;
              return validationResult;
        } 
        //Section body height
        if (this.sectionImageAddForm.controls['bodyHeight'].value.trim() == ''){
              this.errorReason = "Table height can't be empty";
              validationResult = false;
              return validationResult;
        }

        if (this.sectionImageAddForm.controls['bodyHeight'].value.trim() <0){
              this.errorReason = "Table height can't be negative";
              validationResult = false;
              return validationResult;
        }

        if (typeof this.sectionImageAddForm.controls['bodyHeight'].value.trim() === "string" && Number.isNaN(Number(this.sectionImageAddForm.controls['bodyHeight'].value.trim()))) {
        
              this.errorReason = "Table height must be number";
              validationResult = false;
              return validationResult;
        }                           

        return validationResult;
  

     }      

}
