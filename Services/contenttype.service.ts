import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ContentType } from "Vo/contentType";
import { Http, Response, RequestOptions} from "@angular/http";
import { map } from 'rxjs/operators';
import { HttpClientModule, HttpClient, HttpParams, HttpHeaders }    from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})


export class ContentTypeService {

  AdminbaseUrl = environment.AdminbaseUrl;

  private _getContentTypeListURL = this.AdminbaseUrl+"/tnt/contentTypes/";
  private _getContentTypeListAllURL = this.AdminbaseUrl+"/tnt/contentTypesAll/";
  private _createContentTypeURL = this.AdminbaseUrl+"/tnt/contentType/";
  private _updateContentTypeURL = this.AdminbaseUrl+"/tnt/contentType/";
  private _deleteContentTypeURL = this.AdminbaseUrl+"/tnt/contentType/";
  private _getContentTypeDataURL = this.AdminbaseUrl+"/tnt/contentType/";
  private _uploadStandardActivityURL = this.AdminbaseUrl+"/tnt/uploadContentType/";

  constructor(private http: HttpClient) { }


  getContentTypeData(contentType_id): Observable<ContentType[]> {

    console.log("getContentTypeData");
    return this.http.get(this._getContentTypeDataURL+contentType_id).pipe(
    map((response: Response) => {
      
    console.log("getContentTypeListData Response");
      if(Array.isArray(response)) {
        return <ContentType[]>response;
      }
     
    })) ;

  }

  createContentType(contentTypeParameter): Observable<ContentType[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };


    console.log("createContentType Service ");
    console.log(contentTypeParameter);
    
    return this.http.post(this._createContentTypeURL , contentTypeParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ContentType[]>response;
        }
          
    })) ;
  }


  updateContentType( contentType_id, appliactionParameter): Observable<ContentType[]>{

    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    console.log("updateContentType Service ");
    console.log(appliactionParameter);
    
    return this.http.put(this._updateContentTypeURL+contentType_id , appliactionParameter, httpOptions).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ContentType[]>response;
        }
          
    })) ;
  }


  deleteContentType( contentType_id): Observable<ContentType[]>{

    console.log("deleteContentType Service ");
    console.log(" contentType_id "+contentType_id);

    return this.http.delete(this._deleteContentTypeURL+contentType_id ).pipe(
      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ContentType[]>response;
        }
          
    })) ;
  }


  getContentTypeList(reportType): Observable<ContentType[]>{

    console.log("getContentTypeList Service ");


    var tmpURL = ''
    if (reportType == 'org')
          tmpURL = this._getContentTypeListURL+'ORGANIZATION';

    else if (reportType == 'global')
          tmpURL = this._getContentTypeListURL+'GLOBAL';   
    else if (reportType == 'template')          
          tmpURL = this._getContentTypeListURL+'TEMPLATE';  
          else                 
               tmpURL = this._getContentTypeListURL+'TRANSITION';  


    //alert(""+tmpURL);      

    return this.http.get(tmpURL).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ContentType[]>response;
        }
          
    })) ;
  }


  getContentTypeListAll(): Observable<ContentType[]>{

    console.log("getContentTypeListAll Service ");

    return this.http.get(this._getContentTypeListAllURL).pipe(

      map((response: Response) => {
  
        if(Array.isArray(response)) {
          return <ContentType[]>response;
        }
          
    })) ;
  }

}