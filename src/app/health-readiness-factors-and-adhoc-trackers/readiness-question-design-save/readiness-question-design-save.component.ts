import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavtntService } from 'src/app/navtnt.service';
import { UserAccessProfileService } from 'Services/user-access-profile.service';
import { ReadinessQuestionService } from 'Services/readinessquestion.service';

@Component({
  selector: 'app-readiness-question-design-save',
  templateUrl: './readiness-question-design-save.component.html',
  styleUrls: ['./readiness-question-design-save.component.css']
})
export class ReadinessQuestionDesignSaveComponent implements OnInit {


  globalCriteriaList='';
  parameterId = "";
  parameterName = "";
  transitionId = "";

  constructor(private route:ActivatedRoute,private navigation: NavtntService, 
    private userAccessProfileService: UserAccessProfileService, 
    private readinessQuestionService: ReadinessQuestionService) { }

  ngOnInit() {

    this.route.queryParams.subscribe((p: any) => {    
      if (p.filter){

              this.parameterId = this.navigation.getParameterValue(p.filter, 'parameterId')   
              this.parameterName = this.navigation.getParameterValue(p.filter, 'parameterName')  
              this.transitionId = this.navigation.getParameterValue(p.filter, 'transitionId')  
              this.globalCriteriaList = this.navigation.getParameterValue(p.filter, 'globalCriteriaList')  

              this.saving( );
      }
    });      
  }


/*
saving(){
  this.readinessQuestionService.createReadinessQuestionCustom('{"globalCriteriaList":'+this.globalCriteriaList+'}', this.transitionId ).subscribe((applications:any[]) => {                     
    console.log("##################################################################################################");

    var sourceComponentPath = '/transition-Main/readiness-question-design-save';
    var destinationComponentPath = '/transition-Main/readiness-question-design-list';
    var destinationComponentParameterArray = [ { id: 'parameterId', param: this.parameterId },
    { id: 'parameterName', param: this.parameterName } ]     
  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
  });  
}
*/

saving(){


  //this.globalCriteriaList = JSON.stringify(this.readinessQuestionsToBeSubmitted);
  //alert("this.globalCriteriaList"+this.globalCriteriaList);
  console.log("this.globalCriteriaList "+this.globalCriteriaList);

  var applicationParameter = '{'+  
        '"transitionId":"'+this.transitionId+'", '+
        '"parameterId":"'+this.parameterId+'",  '+  
        '"globalCriteriaList":'+this.globalCriteriaList+'  '+                     
  '}'

  
  this.readinessQuestionService.adoptReadinessQuestionCustom(applicationParameter, this.transitionId ).subscribe((applications:any[]) => {                     
    console.log("##################################################################################################");

    var sourceComponentPath = '/transition-Main/readiness-question-save';
    var destinationComponentPath = '/transition-Main/readiness-question-design-list';
    var destinationComponentParameterArray:any = [
      { id: 'parameterId', param: this.parameterId },
      { id: 'parameterName', param: this.parameterName }  ]    

  
    this.navigation.goToComponent(sourceComponentPath,destinationComponentPath,destinationComponentParameterArray)                  
  });       
}


}
