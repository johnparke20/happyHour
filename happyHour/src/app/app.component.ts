import { Component } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError} from 'rxjs';
import { catchError } from 'rxjs/operators';
import {results,results2,results3} from './results';
import {resultSites} from './resultSites';
import {menus} from './menus'
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'happyHour';
  restaurants = [];
  apiKey = "AIzaSyA3Jj0W0pYFwgEq65YyxeR6foZcif0WsmU";
  res=results['results'];
  resSites=resultSites;
  pages=[];
  menu=menus;
  menuPDFs=[];
  safeURL;
  
  constructor(private http: HttpClient,private sanitizer: DomSanitizer) { 
    this.safeURL=sanitizer.bypassSecurityTrustResourceUrl('https://www.texasroadhouse.com/texas-roadhouse-master-menu.pdf');
    for(var i=0;i<this.menu.length;i+=1){
      var temp=[];
      for(var j =0;j<this.menu[i][1].length;j+=1){
        if(this.menu[i][1][j].substr(this.menu[i][1][j].length-4,4)=='.pdf'){
          temp.push(sanitizer.bypassSecurityTrustResourceUrl('https://cors-anywhere.herokuapp.com/'+this.menu[i][1][j]));
        }
      }
      this.menuPDFs.push(temp);
    }
    console.log(this.menuPDFs);
  }

  public search(){
    var location = "42.612495,-83.079359";
    var radius = "10000";
    // const searchUrl=`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?types=bar|restaurant&location=${location}&radius=${radius}&key=${this.apiKey}`;
    // this.http.get<any>(searchUrl, {})
    //   .pipe(
    //     catchError((e) => this.handleError(e))
    //   ).subscribe((response) => {
    //     console.log(response as (JSON));
    //     this.res=response['results']
    //   });


    // var place = "";
    // for(var i = 0;i<this.res.length;i++){
    //     place=this.res[i]['place_id']
    //     var secondSearchUrl=`https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${place}&key=${this.apiKey}&fields=website`
    //     this.http.get<any>(secondSearchUrl, {})
    //     .pipe(
    //       catchError((e) => this.handleError(e))
    //     ).subscribe((response) => {
    //       console.log(response['result']['website'] as (JSON));
    //     });
    // }
  }


  public displayResults(){
    this.pages=[];
    for(var i = 0;i<20;i++){
      this.pages.push([this.res[i]['name'],this.resSites[i],this.menuPDFs[i][0]]);
    }
    // const searchUrl = 'https://cors-anywhere.herokuapp.com/'+this.resSites[0];
    
  }

  private handleError(error: HttpErrorResponse) {
    console.log('error', error);
    // return an observable with a user-facing error message
    return throwError(
      'Internal Error.');
  };
}
