import { Component } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {menus} from './menus'
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'happyHour';
  restaurants = [];
  apiKey = "AIzaSyA3Jj0W0pYFwgEq65YyxeR6foZcif0WsmU";
  res=[];
  resSites=[];
  pages=[];
  menu=menus;
  safeURL;
  
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) { 
    // this.safeURL=[[sanitizer.bypassSecurityTrustResourceUrl('https://www.konagrill.com/download_file/view_inline/691')]];
    // for(var i=0;i<this.menu.length;i+=1){
    //   var temp=[];
    //   for(var j =0;j<this.menu[i][1].length;j+=1){
    //     if(this.menu[i][1][j].substr(this.menu[i][1][j].length-4,4)=='.pdf'){
    //       temp.push(sanitizer.bypassSecurityTrustResourceUrl(this.menu[i][1][j]));
    //     }
    //   }
    //   if(temp.length==0){
    //     temp.push(this.safeURL[0][0]);
    //   }
    //   this.safeURL.push(temp);
    // }
  }

  public search(){
    var location = "42.612495,-83.079359";
    var radius = "10000";
    const searchUrl=`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?opennow&type=bar&location=${location}&radius=${radius}&key=${this.apiKey}`;
    this.res=[];
    this.resSites=[];
    this.http.get<any>(searchUrl, {})
      .pipe(
        catchError((e) => this.handleError(e))
      ).subscribe((response) => {
        var tempRes=response['results']
        for(var i = 0;i<20;i+=1){
          var types = tempRes[i]["types"];
          var count = 0;
          for(var j = 0;j<types.length;j+=1){
            if(types[j]=="lodging"){
              count=0;
              break;
            }else if(types[j]=="bowling_alley"){
              break;
            }else if(types[j]=="bar"){
              count+=1;
            }else if(types[j]=="restaurant"){
              count+=1;
            }else if(types[j]=="food"){
              count+=1;
            }
          }
          if(count==3){
            this.res.push(tempRes[i]);
          }
        }
        console.log(this.res);
        console.log(this.resSites);
        this.continueSearch();
      });
  }

  public continueSearch(){
    var place = "";
    for(var i = 0;i<this.res.length;i++){
        place=this.res[i]['place_id']
        var secondSearchUrl=`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${place}&key=${this.apiKey}&fields=website`
        this.http.get<any>(secondSearchUrl, {})
        .pipe(
          catchError((e) => this.handleError(e))
        ).subscribe((response) => {
          this.resSites.push(response['result']['website']);
          console.log(response['result']['website']);
        });
    }
    
  }


  public displayResults(){
    this.pages=[];
    for(var i = 0;i<this.res.length;i++){
      this.pages.push([this.res[i]['name'],this.resSites[i]]);
      // console.log(this.safeURL[i]);
    }
    
  }

  private handleError(error: HttpErrorResponse) {
    console.log('error', error);
    // return an observable with a user-facing error message
    return throwError(
      'Internal Error.');
  };
}
