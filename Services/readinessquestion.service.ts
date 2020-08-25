import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ReadinessQuestion } from "Vo/readinessquestion";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { ReadinessQuestionsTracker } from 'Vo/readinessquestionstracker';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ReadinessQuestionService {


  AdminbaseUrl = environment.AdminbaseUrl;
  baseURL = environment.baseUrl 

  private _getReadinessQuestionListURL = this.AdminbaseUrl+"/tnt/readinessQuestions/";
  private _getReadinessQuestionDesignListURL = this.AdminbaseUrl+"/tnt/readinessQuestionDesignList/";
  private _getReadinessQuestionDesignDataURL = this.AdminbaseUrl+"/tnt/readinessQuestionCustomData/";
  private _getReadinessQuestionListForAdoptionURL = this.AdminbaseUrl+"/tnt/readinessQuestionListForAdoption/";
  private _getReadinessQuestionTrackingHeaderListURL = this.AdminbaseUrl+"/tnt/readinessQuestionTrackingHeaderList/";
  private _getReadinessQuestionTrackingListURL = this.AdminbaseUrl+"/tnt/readinessQuestionTrackingList/";
  private _getReadinessQuestionTrackingResourceListURL = this.AdminbaseUrl+"/tnt/readinessQuestionTrackingResourceList/";
  private _createReadinessQuestionURL = this.AdminbaseUrl+"/tnt/readinessQuestion/";
  

  

  private _updateReadinessQuestionURL = this.AdminbaseUrl+"/tnt/readinessQuestionUpdate/";
  private _updateReadinessQuestionCustomURL = this.AdminbaseUrl+"/tnt/readinessQuestionCustomUpdate/";
  private _createReadinessQuestionCustomURL = this.AdminbaseUrl+"/tnt/readinessQuestionCustom/";
  private _adoptReadinessQuestionCustomURL = this.AdminbaseUrl+"/tnt/adoptReadinessQuestionCustom/";
  private _appendReadinessQuestionCustomURL = this.AdminbaseUrl+"/tnt/readinessQuestionCustomAppend/";
  private _updateReadinessQuestionDesignURL = this.AdminbaseUrl+"/tnt/readinessQuestionDesign/";  
  private _deleteReadinessQuestionURL = this.AdminbaseUrl+"/tnt/deleteReadinessQuestion/";
  private _deleteReadinessQuestionAdminURL = this.AdminbaseUrl+"/tnt/deleteReadinessQuestionAdmin/";
  private _checkReadinessQuestionDataURL = this.AdminbaseUrl+"/tnt/checkReadinessQuestionData/";
  private _getReadinessQuestionDataURL = this.AdminbaseUrl+"/tnt/readinessQuestion/";

  private _addEditReadinessQuestionTrackingURL = this.AdminbaseUrl+"/tnt/readinessQuestionTrackingAddEdit/";

  private _getResourceAsHeaderInTrackingListURL = this.AdminbaseUrl+"/tnt/resourceAsHeaderInTrackingList/";


  
  constructor(private http: HttpClient) { }

  getReadinessQuestionData(readinessQuestion_id): Observable<ReadinessQuestion[]> {

    console.log("getReadinessQuestionData");
    return this.http.get(this._getReadinessQuestionDataURL+readinessQuestion_id).pipe(
    map((response: Response) => {
      
    console.log("getReadinessQuestionListData Response");
      if(Array.isArray(response)) {
        return <ReadinessQuestion[]>response;
      }
     
    })) ;

  }

  getReadinessQuestionCustomData(readinessQuestion_id): Observable<ReadinessQuestion[]> {

    console.log("getReadinessQuestionData");
    return this.http.get(this._getReadinessQuestionDesignDataURL+readinessQuestion_id).pipe(
    map((response: Response) => {
      
    console.log("getReadinessQuestionListData Response");
      if(Array.isArray(response)) {
        return <ReadinessQuestion[]>response;
      }
     
    })) ;

  }

  createReadinessQuestion(readinessQuestionParameter): Observable<ReadinessQuestion[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createReadinessQuestion Service ");
    console.log(readinessQuestionParameter);
    
    return this.http.post(this._createReadinessQuestionURL , readinessQuestionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestion[]>response;
        }
          
    })) ;
  }


  editReadinessQuestion( appliactionParameter): Observable<ReadinessQuestion[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateReadinessQuestion Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateReadinessQuestionURL , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestion[]>response;
        }
          
    })) ;
  }


  editReadinessQuestionCustom( appliactionParameter): Observable<ReadinessQuestion[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateReadinessQuestionCustom Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateReadinessQuestionCustomURL , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestion[]>response;
        }
          
    })) ;
  }


  deleteReadinessQuestion( appliactionParameter): Observable<ReadinessQuestion[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("deleteReadinessQuestion Service ");
    //console.log(" readinessQuestion_id "+readinessQuestion_id);


    //alert("appliactionParameter "+appliactionParameter);
    return this.http.put(this._deleteReadinessQuestionURL, appliactionParameter, httpOptions ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestion[]>response;
        }
          
    })) ;
  }

  deleteReadinessQuestionAdmin( readinessQuestionId): Observable<ReadinessQuestion[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("deleteReadinessQuestion Service ");
    //console.log(" readinessQuestion_id "+readinessQuestion_id);


    //alert("appliactionParameter "+appliactionParameter);
    return this.http.delete(this._deleteReadinessQuestionAdminURL+readinessQuestionId,  httpOptions ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestion[]>response;
        }
          
    })) ;
  }


  checkReadinessQuestionData( appliactionParameter): Observable<ReadinessQuestion[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("checkReadinessQuestionData Service ");
    //console.log(" readinessQuestion_id "+readinessQuestion_id);


    //alert("appliactionParameter "+appliactionParameter);
    return this.http.post(this._checkReadinessQuestionDataURL, appliactionParameter, httpOptions ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestion[]>response;
        }
          
    })) ;
  }


  getReadinessQuestionList(parameterId): Observable<ReadinessQuestion[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("getReadinessQuestionList Service ");
    
    return this.http.get(this._getReadinessQuestionListURL+parameterId).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestion[]>response;
        }
          
    })) ;
  }

  getReadinessQuestionDesignList(appliactionParameter): Observable<ReadinessQuestionsTracker[]>{

    console.log("getReadinessQuestionDesignList Service ");
    
      return this.http.get(this._getReadinessQuestionDesignListURL+appliactionParameter).pipe(

      map((response: Response) => {
  

        if(Array.isArray(response)) {
               return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }

  getReadinessQuestionListForAdoption(appliactionParameter): Observable<ReadinessQuestionsTracker[]>{



    console.log("getReadinessQuestionListForAdoption Service ");
    
      return this.http.get(this._getReadinessQuestionListForAdoptionURL+appliactionParameter).pipe(

      map((response: Response) => {
  

        if(Array.isArray(response)) {
               return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }

  

  getReadinessQuestionTrackingHeaderList(transition_id): Observable<ReadinessQuestionsTracker[]>{


    console.log("getReadinessQuestionDesignList Service ");
    
    return this.http.get(this._getReadinessQuestionTrackingHeaderListURL+transition_id).pipe(

      map((response: Response) => {
  

        if(Array.isArray(response)) {
               return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }


  getReadinessQuestionTrackingList(transition_id): Observable<ReadinessQuestionsTracker[]>{



    console.log("getReadinessQuestionDesignList Service ");
    
    return this.http.get(this._getReadinessQuestionTrackingListURL+transition_id).pipe(

      map((response: Response) => {
  

        if(Array.isArray(response)) {
               return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }





    getReadinessQuestionTrackingResourceList(transition_id): Observable<ReadinessQuestionsTracker[]>{



    console.log("getReadinessQuestionDesignList Service ");
    
    return this.http.get(this._getReadinessQuestionTrackingResourceListURL+transition_id).pipe(

      map((response: Response) => {
  

        if(Array.isArray(response)) {
               return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }

  getResourceAsHeaderInTrackingList(transition_id): Observable<ReadinessQuestionsTracker[]>{



    console.log("getReadinessQuestionDesignList Service ");
    
    return this.http.get(this._getReadinessQuestionTrackingListURL+transition_id).pipe(

      map((response: Response) => {
  

        if(Array.isArray(response)) {
               return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }

  

  createReadinessQuestionCustom(globalCriteriaList, transitionId): Observable<ReadinessQuestionsTracker[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log(globalCriteriaList);
    
    return this.http.post(this._createReadinessQuestionCustomURL+transitionId , globalCriteriaList, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }

  
  adoptReadinessQuestionCustom(globalCriteriaList, transitionId): Observable<ReadinessQuestionsTracker[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log(globalCriteriaList);
    
    return this.http.post(this._adoptReadinessQuestionCustomURL+transitionId , globalCriteriaList, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }


  

  appendReadinessQuestionCustom(readinessQuestionCustom, transitionId): Observable<ReadinessQuestionsTracker[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log(readinessQuestionCustom);
    
    return this.http.post(this._appendReadinessQuestionCustomURL+transitionId , readinessQuestionCustom, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }


  addOrUpdateReadinessQuestionTracking(readinessQuestionParameter, transition_id): Observable<ReadinessQuestionsTracker[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createReadinessQuestion Service ");
    console.log(readinessQuestionParameter);
    
    return this.http.post(this._addEditReadinessQuestionTrackingURL+transition_id , readinessQuestionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }

  updateReadinessQuestionDesign( readinessQuestionTracker_id, appliactionParameter): Observable<ReadinessQuestionsTracker[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateReadinessQuestion Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateReadinessQuestionDesignURL+readinessQuestionTracker_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ReadinessQuestionsTracker[]>response;
        }
          
    })) ;
  }  

  getExcelHealthReadinessSingle(IntegrationID: string, parameterCustomId: string, parameterName: string, resourceTypeMeasured: string, username: string): any {
    const newParam = 'IntigrationID=' + IntegrationID+'/parameterCustomId='+parameterCustomId+'/parameter='+parameterName+'/resourceTypeMeasured='+resourceTypeMeasured+'/username='+username;
    return this.http.get(this.baseURL + '/getExcelHealthReadinessSingle/' + newParam );
  }


  getExcelHealthReadinessSingleOverall(IntegrationID: string, parameterCustomId: string, parameterName: string, resourceTypeMeasured: string, username: string): any {
    const newParam = 'IntigrationID=' + IntegrationID+'/parameterCustomId='+parameterCustomId+'/parameter='+parameterName+'/resourceTypeMeasured='+resourceTypeMeasured+'/username='+username;
    return this.http.get(this.baseURL + '/getExcelHealthReadinessSingleOverall/' + newParam );
  } 

}